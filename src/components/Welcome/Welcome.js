import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useWallet } from "use-wallet";

import WelcomeTopBar from "./WelcomeTopBar";

function Welcome({ selectorNetworks, web3 }) {
  const theme = useTheme();

  const {
    account,
    balance,
    isContract: isContractAccount,
    web3: walletWeb3,
  } = useWallet();

  return (
    <div css="position: relative; z-index: 1">
      <WelcomeTopBar />
    </div>
  );
}
