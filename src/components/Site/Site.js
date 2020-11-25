import React, { useCallback, useEffect, useState } from "react";
import { Route, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useWallet } from "use-wallet";
import { BREAKPOINTS, useTheme, SidePanel, Tag } from "@aragon/ui";
import throttle from "lodash.throttle";

import TopBar from "../TopBar/TopBar";
import Welcome from "../Welcome/Welcome";
import XTokens from "../XTokens/XTokens";
import MintPanel from "../MintPanel/MintPanel";
import RedeemPanel from "../RedeemPanel/RedeemPanel";

import RoundButton from "./RoundButton/RoundButton";

function Site({ selectorNetworks, web3 }) {
  const theme = useTheme();

  const {
    account,
    balance,
    isContract: isContractAccount,
    web3: walletWeb3,
  } = useWallet();

  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

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

  const handleMintClick = (vaultId, ticker) => {
    setPanelTitle(`Mint ${ticker}`);
    setPanelOpened(true);
    setInnerPanel(<MintPanel ticker={ticker} />);
  };

  const handleRedeemClick = (vaultId, ticker) => {
    setPanelTitle(`Redeem ${ticker}`);
    setPanelOpened(true);
    setInnerPanel(<RedeemPanel ticker={ticker} />);
  };

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
            height: 100%;
          `}
        >
          <Welcome />
          <div
            css={`
              text-align: center;
              transform: translateY(-24px);
              & > span {
                margin: 0 26px;
                transform: scale(1.5);
                color: white;
                background-color: #423660;
                font-size: 10px;
              }
            `}
          >
            <RoundButton text="Homepage" link="/" />
            <RoundButton text="D1 Funds" link="/d1-funds" />
            <RoundButton text="Bounties" link="/bounties" />
          </div>

          <Route path="/d1-funds">
            <XTokens
              title="CryptoPunks"
              entries={[
                { ticker: "PUNK-BASIC", supply: "0", vaultId: "0" },
                { ticker: "PUNK-ATTR-4", supply: "0", vaultId: "1" },
                { ticker: "PUNK-ATTR-5", supply: "0", vaultId: "2" },
                { ticker: "PUNK-ZOMBIE", supply: "0", vaultId: "3" },
              ]}
              handleMint={handleMintClick}
              handleRedeem={handleRedeemClick}
            />

            <XTokens
              title="CryptoKitties"
              entries={[
                { ticker: "KITTY-GEN-0", supply: "0", vaultId: "4" },
                { ticker: "KITTY-GEN-0-FAST", supply: "0", vaultId: "5" },
                { ticker: "KITTY-FANCY", supply: "0", vaultId: "6" },
                { ticker: "KITTY-FOUNDER", supply: "0", vaultId: "7" },
              ]}
              handleMint={handleMintClick}
              handleRedeem={handleRedeemClick}
            />

            <XTokens
              title="Autoglyphs"
              entries={[{ ticker: "GLYPH", supply: "0", vaultId: "8" }]}
              handleMint={handleMintClick}
              handleRedeem={handleRedeemClick}
            />
            <XTokens
              title="Axie Infinity"
              entries={[
                { ticker: "AXIE-MYSTIC-1", supply: "0", vaultId: "9" },
                { ticker: "AXIE-MYSTIC-2", supply: "0", vaultId: "10" },
              ]}
              handleMint={handleMintClick}
              handleRedeem={handleRedeemClick}
            />

            <XTokens
              title="Avastars"
              entries={[
                { ticker: "AVASTAR-RANK-25", supply: "0", vaultId: "11" },
                { ticker: "AVASTAR-RANK-50", supply: "0", vaultId: "12" },
                { ticker: "AVASTAR-RANK-75", supply: "0", vaultId: "13" },
              ]}
              handleMint={handleMintClick}
              handleRedeem={handleRedeemClick}
            />
            <XTokens
              title="Joyworld"
              entries={[{ ticker: "JOY", supply: "0", vaultId: "14" }]}
              handleMint={handleMintClick}
              handleRedeem={handleRedeemClick}
            />
          </Route>

          <br />
          <SidePanel
            title={panelTitle}
            opened={panelOpened}
            onClose={() => setPanelOpened(false)}
          >
            {innerPanel}
          </SidePanel>
        </div>
      </div>
    </div>
  );
}

export default Site;
