import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useWallet } from "use-wallet";
import { BREAKPOINTS, useTheme } from "@aragon/ui";
import throttle from "lodash.throttle";

import OnboardingTopBar from "./OnboardingTopBar";
import Welcome from "../Welcome/Welcome";
import XTokens from "../XTokens/XTokens";

function Onboarding({ selectorNetworks, web3 }) {
  const theme = useTheme();

  const {
    account,
    balance,
    isContract: isContractAccount,
    web3: walletWeb3,
  } = useWallet();

  const [solidTopBar, setSolidTopBar] = useState(false);

  const updateSolidScrollBar = useCallback(
    throttle((solid) => {
      setSolidTopBar(solid);
    }, 50),
    []
  );

  const handleOnBoardingScroll = useCallback(
    (event) => {
      updateSolidScrollBar(event.target.scrollTop > 0);
    },
    [updateSolidScrollBar]
  );

  return (
    <div css="position: relative; z-index: 1">
      <OnboardingTopBar solid={solidTopBar} />
      <div
        onScroll={handleOnBoardingScroll}
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
          <XTokens
            title="CryptoPunks"
            entries={[
              { ticker: "PUNK-BASIC", supply: "0" },
              { ticker: "PUNK-ATTR-4", supply: "0" },
              { ticker: "PUNK-ATTR-5", supply: "0" },
              { ticker: "PUNK-ZOMBIE", supply: "0" },
            ]}
          />
          
          <XTokens
            title="CryptoKitties"
            entries={[
              { ticker: "KITTY-GEN-0", supply: "0" },
              { ticker: "KITTY-GEN-0-FAST", supply: "0" },
              { ticker: "KITTY-FANCY", supply: "0" },
              { ticker: "KITTY-FOUNDER", supply: "0" },
            ]}
          />
          
          <XTokens
            title="Autoglyphs"
            entries={[{ ticker: "GLYPH", supply: "0" }]}
          />
          <XTokens
            title="Axie Infinity"
            entries={[
              { ticker: "AXIE-MYSTIC-1", supply: "0" },
              { ticker: "AXIE-MYSTIC-2", supply: "0" },
            ]}
          />
          
          <XTokens
            title="Avastars"
            entries={[
              { ticker: "AVASTAR-RANK-25", supply: "0" },
              { ticker: "AVASTAR-RANK-50", supply: "0" },
              { ticker: "AVASTAR-RANK-75", supply: "0" },
            ]}
          /> 
          <XTokens
            title="Joyworld"
            entries={[
              { ticker: "JOY", supply: "0" },
            ]}
          /> 
          
          <br />
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
