import React, { useState, useEffect, useRef } from "react";
import { useWallet } from "use-wallet";
import { useLocation, Link } from "react-router-dom";
import Web3 from "web3";
import XStore from "../../contracts/XStore.json";
import addresses from "../../addresses/mainnet.json";
import D1FundView from "../D1FundView/D1FundView";
import D2FundView from "../D2FundView/D2FundView";
// import D2FundView from '../D2FundView/D2FundView';

function FundView() {
  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : "wss://eth-mainnet.ws.alchemyapi.io/v2/fL1uiXELcu8QeuLAxoCNmnbf_XuVlHBD";
  const { current: web3 } = useRef(new Web3(provider));

  const xStore = new web3.eth.Contract(XStore.abi, addresses.xStore);

  const [vaultId, setVaultId] = useState(null);
  const [invalidVid, setInvalidVid] = useState(false);
  const [degree, setDegree] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location) {
      const _vaultId = location.pathname.split("/")[2];
      if (isNaN(parseInt(_vaultId))) {
        setInvalidVid(true);
      }
      setVaultId(_vaultId);
    }
  }, [location]);

  useEffect(() => {
    if (xStore && vaultId) {
      xStore.methods
        .isD2Vault(vaultId)
        .call({ from: account })
        .then((retVal) => {
          setDegree(retVal ? 2 : 1);
        });
    }
  }, [xStore, vaultId, account]);

  if (invalidVid) {
    return <div>Invalid Fund ID</div>;
  } else if (!degree) {
    return <div></div>;
  } else if (degree === 1) {
    return <D1FundView />;
  } else {
    console.log("TODO");
    return <D2FundView />;
  }
}

export default FundView;
