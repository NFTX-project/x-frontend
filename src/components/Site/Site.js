import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Route, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useWallet } from "use-wallet";
import { BREAKPOINTS, useTheme, SidePanel, Split, DropDown } from "@aragon/ui";
import throttle from "lodash.throttle";

import TopBar from "../TopBar/TopBar";
import Welcome from "../Welcome/Welcome";
import RoundButton from "./RoundButton/RoundButton";
import Landing from "../Landing/Landing";
import NftList from "../NftList/NftList";
import D1FundList from "../D1FundList/D1FundList";
import Backend from "../Backend/Backend";
import D1FundView from "../D1FundView/D1FundView";

function Site({ selectorNetworks }) {
  const theme = useTheme();

  // const { account, balance, isContract: isContractAccount } = useWallet();

  const [solidTopBar, setSolidTopBar] = useState(false);

  const updateSolidScrollBar = useCallback(
    throttle((solid) => {
      setSolidTopBar(solid);
    }, 50),
    []
  );

  const handleScroll = useCallback(
    (event) => {
      updateSolidScrollBar(event.target.scrollTop > 0);
    },
    [updateSolidScrollBar]
  );

  return (
    <div css="position: relative; z-index: 1">
      <TopBar solid={solidTopBar} />
      <div
        onScroll={handleScroll}
        css={`
          position: relative;
          z-index: 1;
          background: ${theme.background};
          height: 100vh;
          min-width: ${BREAKPOINTS.min}px;
          overflow-y: auto;
        `}
      >
        <div
          css={`
            position: relative;
            z-index: 1;
            min-height: calc(100vh - 10px);
          `}
        >
          <Welcome />
          <div
            css={`
              display: flex;
              justify-content: center;
              transform: translateY(-24px);
            `}
          >
            <RoundButton text="Landing" link="/landing" />
            <RoundButton text="D1 Funds" link="/" />
            <RoundButton text="Backend" link="/backend" />
          </div>
          <div
            css={`
              max-width: 950px;
              width: 80%;
              margin: auto;
              margin-bottom: 25px;
            `}
          >
            <Route path="/landing">
              <Landing selectorNetworks={selectorNetworks} />
            </Route>

            <Route path="/" exact>
              <D1FundList />
            </Route>
            <Route path="/backend">
              <Backend />
            </Route>
            <Route path="/fund">
              <D1FundView />
            </Route>
          </div>
          <div
            className="footer-filler"
            css={`
              width: 100%;
              text-align: center;
              line-height: 5;
              opacity: 0;
              pointer-events: none;
            `}
          >
            filler
          </div>
          <div
            className="footer"
            css={`
              position: absolute;
              bottom: 0;
              width: 100%;
              font-size: 18px;
              text-align: center;
              line-height: 3.5;
              & > a {
                display: inline-block;
                padding: 0 18px;
                color: #d0ceff;
                opacity: 0.65;
                cursor: pointer;
                text-decoration: none;
                &:hover {
                  opacity: 0.9;
                }
              }
            `}
          >
            <a
              href="https://twitter.com/NFTX_"
              target="_blank"
              rel="noreferrer"
            >
              Twitter
            </a>
            <a
              href="https://github.com/NFTX-project"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://nftx.substack.com/"
              target="_blank"
              rel="noreferrer"
            >
              Substack
            </a>
            <a
              href="https://rinkeby.client.aragon.org/#/nftx/"
              target="_blank"
              rel="noreferrer"
            >
              Aragon
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Site;
