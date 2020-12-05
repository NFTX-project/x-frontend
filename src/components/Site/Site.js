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
            <RoundButton text="NFT List" link="/nft-list" />
            <RoundButton text="Backend" link="/backend" />
          </div>
          <div
            className="xtokens-wrapper"
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
            <Route path="/nft-list">
              <NftList />
            </Route>
            <Route path="/backend">
              <Backend />
            </Route>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Site;
