import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useWallet } from "use-wallet";
import Web3 from "web3";
import {
  Button,
  DataView,
  textStyle,
  AddressField,
  SidePanel,
} from "@aragon/ui";
import XStore from "../../contracts/XStore.json";
import Nftx from "../../contracts/NFTX.json";
import XToken from "../../contracts/XToken.json";
import IErc721Plus from "../../contracts/IERC721Plus.json";
import addresses from "../../addresses/mainnet.json";

import ManageFundPanel from "../InnerPanels/ManageFundPanel";
import MintD1FundPanel from "../InnerPanels/MintD1FundPanel";
import MintRequestPanel from "../InnerPanels/MintRequestPanel";
import RedeemD1FundPanel from "../InnerPanels/RedeemD1FundPanel";

import FundsList from "../FundsList/FundsList";

const zeroAddress = "0x0000000000000000000000000000000000000000";

function D1FundView({ fundsData, balances }) {
  const location = useLocation();
  const [vaultId, setVaultId] = useState(null);
  const [invalidVid, setInvalidVid] = useState(false);

  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : `wss://eth-mainnet.ws.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`;

  const { current: web3 } = useRef(new Web3(provider));
  const xStore = new web3.eth.Contract(XStore.abi, addresses.xStore);
  const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);

  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const [fundData, setFundData] = useState(null);

  useEffect(() => {
    if (location) {
      const _vaultId = location.pathname.split("/")[2];
      if (isNaN(parseInt(_vaultId))) {
        setInvalidVid(true);
      }
      setVaultId(parseInt(_vaultId));
    }
  }, [location]);

  useEffect(() => {
    if (vaultId !== null && fundsData) {
      const _fundData = fundsData.find((elem) => elem.vaultId === vaultId);
      if (_fundData) {
        setFundData(_fundData);
      }
    }
  }, [vaultId, fundsData]);

  const handleClickManage = () => {
    if (!fundData) return;
    setPanelTitle(`Manage ${fundData.fund || "Fund"}`);
    setInnerPanel(
      <ManageFundPanel
        vaultId={vaultId}
        onContinue={() => setPanelOpened(false)}
        isFinalized={fundData.isFinalized}
        manager={fundData.manager}
        isClosed={fundData.isClosed}
      />
    );
    setPanelOpened(true);
  };

  const handleMint = () => {
    setPanelTitle(`${fundData.fundToken.symbol} ▸ Mint`);
    setInnerPanel(
      <MintD1FundPanel
        vaultId={vaultId}
        ticker={fundData.fundToken.symbol}
        onContinue={() => {
          setPanelOpened(false);
        }}
        allowMintRequests={fundData.allowMintRequests}
        onMakeRequest={() => {
          setPanelOpened(false);
          setTimeout(() => {
            handleMintRequest();
          }, 500);
        }}
      />
    );
    setPanelOpened(true);
  };

  const handleMintRequest = () => {
    setPanelTitle(`${fundData.fundToken.symbol} ▸ Request`);
    setInnerPanel(
      <MintRequestPanel
        vaultId={vaultId}
        ticker={fundData.fundToken.symbol}
        onContinue={() => {
          setPanelOpened(false);
        }}
        onMintNow={() => {
          setPanelOpened(false);
          setTimeout(() => {
            handleMint();
          }, 500);
        }}
      />
    );
    setPanelOpened(true);
  };

  const handleRedeem = () => {
    setPanelTitle(`${fundData.fundToken.symbol} ▸ Redeem`);
    setInnerPanel();
    setInnerPanel(
      <RedeemD1FundPanel
        vaultId={vaultId}
        address={fundData.fundToken.address}
        ticker={fundData.fundToken.symbol}
        onContinue={() => {
          setPanelOpened(false);
        }}
      />
    );
    setPanelOpened(true);
  };

  if (invalidVid) {
    return <div>Invalid fundID</div>;
  }
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
        <Button
          label="Manage Fund"
          disabled={!vaultId}
          onClick={handleClickManage}
        />
      </div>
      <div
        css={`
          & > div {
            padding-bottom: 20px;
          }
        `}
      >
        <div
          css={`
            display: ${fundData ? "" : "none"};
          `}
        >
          <FundsList
            fundsListData={fundData ? [fundData] : []}
            balances={balances}
            hideInspectButton={true}
          />
        </div>
        <div>
          <DataView
            status={fundData ? "default" : "loading"}
            fields={["key", "value", ""]}
            entries={(() => {
              if (!fundData) {
                return [];
              }
              let arr = [
                {
                  key: "ERC20",
                  value: {
                    name: fundData.fundToken.name,
                    symbol: fundData.fundToken.symbol,
                    address: fundData.fundToken.address,
                  },
                },

                {
                  key: "NFT",
                  value: {
                    name: fundData.asset.name,
                    symbol: fundData.asset.symbol,
                    address: fundData.asset.address,
                  },
                },
                {
                  key: "Status",
                  value: fundData.isClosed
                    ? "Closed"
                    : fundData.isFinalized
                    ? "Finalized"
                    : fundData.isFinalized === false
                    ? "Managed"
                    : "",
                },
              ];

              if (fundData.isFinalized === false) {
                arr.push({
                  key: "Manager",
                  value: fundData.manager,
                });
              }
              if (!fundData.isClosed && !fundData.negateEligibility) {
                arr.push({
                  key: "Requests",
                  value: fundData.flipEligOnRedeem
                    ? "Required"
                    : fundData.allowMintRequests
                    ? "Allowed"
                    : "Not allowed",
                });
              }
              if (
                (fundData.requests || []).length > 0 ||
                fundData.allowMintRequests
              ) {
                arr.push({
                  key: "Pending",
                  value:
                    !(fundData.requests || []).length === 0
                      ? "<empty>"
                      : (fundData.requests || []).join(", "),
                });
              }
              arr.push({
                key: "Holdings",
                value:
                  (fundData.holdings || []).length === 0
                    ? "<empty>"
                    : (fundData.holdings || []).join(", "),
              });
              if (
                (fundData.eligibilities || []).length > 0 ||
                !fundData.negateEligibility
              ) {
                arr.push({
                  key: fundData.negateEligibility ? "Denylist" : "Allowlist",
                  value:
                    (fundData.eligibilities || []).length === 0
                      ? "<empty>"
                      : (fundData.eligibilities || []).join(", "),
                });
              }
              return arr;
            })()}
            renderEntry={({ key, value }) => [
              <div
                css={`
                  padding-right: 15px;
                  & > div {
                    display: inline-block;
                  }
                `}
              >
                <div>{key}</div>
                <div>
                  {(() => {
                    return [
                      "Holdings",
                      "Pending",
                      "Allowlist",
                      "Denylist",
                    ].includes(key) && value.length > 100
                      ? `(${value.split(", ").length})`
                      : "";
                  })()}
                </div>
              </div>,
              <div
                css={`
                  margin: 15px 0;
                  max-height: 190px;
                  overflow: scroll;
                `}
              >
                <div
                  css={`
                    min-width: 450px;
                    ${["Holdings", "Pending", "Allowlist", "Denylist"].includes(
                      key
                    )
                      ? `
                  padding-right: 15px;
                  text-align: justify;
                  ${textStyle("address2")};
                  `
                      : ""}
                  `}
                >
                  {["Holdings", "Pending", "Allowlist", "Denylist"].includes(
                    key
                  ) && value.length === 1 ? (
                    `[ ${value} ]`
                  ) : ["ERC20", "NFT"].includes(key) ? (
                    <div>
                      <div
                        css={`
                          margin: 5px 0;
                        `}
                      >
                        {value.name}{" "}
                        <span
                          css={`
                            padding: 0 5px;
                            font-size: 14px;
                            opacity: 0.6;
                          `}
                        >
                          |
                        </span>{" "}
                        <span
                          css={`
                            font-size: 15.5px;
                          `}
                        >
                          {value.symbol}
                        </span>
                      </div>
                      <div
                        css={`
                          margin-top: 8px;
                        `}
                      >
                        <AddressField
                          address={value.address}
                          autofocus={false}
                        />
                      </div>
                    </div>
                  ) : (
                    value
                  )}
                </div>
              </div>,
            ]}
          />
        </div>
      </div>
      <SidePanel
        title={panelTitle}
        opened={panelOpened}
        onClose={() => setPanelOpened(false)}
      >
        {innerPanel}
      </SidePanel>
    </div>
  );
}

export default D1FundView;
