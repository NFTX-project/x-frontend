import React, { useState, useEffect, useRef } from "react";
import { useWallet } from "use-wallet";
import { useLocation, Link } from "react-router-dom";
import Web3 from "web3";
import XStore from "../../contracts/XStore.json";
import addresses from "../../addresses/mainnet.json";
// import D1FundViewOld from "../D1FundView/D1FundView_Old";
import D1FundView from "../D1FundView/D1FundView";
import D2FundView from "../D2FundView/D2FundView";
// import D2FundView from '../D2FundView/D2FundView';
import { Button, DataView, textStyle } from "@aragon/ui";

function FundView({ fundsData, balances }) {
  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : `wss://eth-mainnet.ws.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`;
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
  } else if (degree === 1) {
    return <D1FundView fundsData={fundsData} balances={balances} />;
  } else if (degree === 2) {
    return <D2FundView fundsData={fundsData} balances={balances} />;
  } else {
    return (
      <div
        css={`
          padding-bottom: 10px;
        `}
      >
        <div
          css={`
            display: flex;
            justify-content: space-between;
            margin-top: 24px;
            margin-bottom: 5px;
          `}
        >
          <div
            css={`
              ${textStyle("title2")};
              margin-bottom: 15px;
              transform: translateY(-2.5px);
            `}
          >
            <div
              css={`
                transform: translateX(-7px);
                display: inline-block;
              `}
            >
              <Link
                to="/"
                css={`
                  text-decoration: none;

                  padding: 9px 7px 4px;
                  border-radius: 8px;
                  transition: background-color 0.15s;
                  &:hover {
                    background-color: rgba(175, 175, 230, 0.12);
                  }
                `}
              >
                Funds
              </Link>
            </div>{" "}
            <div
              css={`
                transform: translateX(-6px);
                display: inline-block;
              `}
            >
              <span
                css={`
                  font-size: 29px;
                  padding-right: 5px;
                `}
              >
                ›
              </span>{" "}
              <span
                css={`
                  color: #9690c1;
                `}
              >
                Fund #{vaultId}
              </span>
            </div>
          </div>
          <Button label="Manage Fund" disabled={true} />
        </div>
        <div
          css={`
            & > div {
              padding-bottom: 20px;
            }
          `}
        >
          <DataView
            status={"loading"}
            fields={[]}
            entries={[]}
            renderEntry={() => <div></div>}
          />
        </div>
      </div>
    );
  }
}

export default FundView;
