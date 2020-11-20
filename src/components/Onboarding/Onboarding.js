import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useWallet } from "use-wallet";
import { BREAKPOINTS, useTheme } from "@aragon/ui";
import throttle from "lodash.throttle";

import OnboardingTopBar from "./OnboardingTopBar";
import Welcome from "../Welcome/Welcome";

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
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
