import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useWallet } from "use-wallet";
import Web3 from "web3";
import {
  Header,
  Button,
  DataView,
  textStyle,
  AddressField,
  SidePanel,
  ContextMenu,
  ContextMenuItem,
} from "@aragon/ui";
import XStore from "../../contracts/XStore.json";
import Nftx from "../../contracts/NFTX.json";
import XToken from "../../contracts/XToken.json";
import Erc20 from "../../contracts/ERC20.json";
import addresses from "../../addresses/mainnet.json";

import ManageFundPanel from "../InnerPanels/ManageFundPanel";
import MintD1FundPanel from "../InnerPanels/MintD1FundPanel";
import MintRequestPanel from "../InnerPanels/MintRequestPanel";
import RedeemD1FundPanel from "../InnerPanels/RedeemD1FundPanel";

const zeroAddress = "0x0000000000000000000000000000000000000000";

function D2FundView() {
  const location = useLocation();
  const [vaultId, setVaultId] = useState(null);
  const [invalidVid, setInvalidVid] = useState(false);

  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : "wss://eth-mainnet.ws.alchemyapi.io/v2/fL1uiXELcu8QeuLAxoCNmnbf_XuVlHBD";

  const { current: web3 } = useRef(new Web3(provider));
  const xStore = new web3.eth.Contract(XStore.abi, addresses.xStore);
  const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);

  const [isFinalized, setIsFinalized] = useState(null);
  const [manager, setManager] = useState(null);
  const [isClosed, setIsClosed] = useState(null);
  const [assetAddress, setAssetAddress] = useState(null);
  const [xTokenAddress, setXTokenAddress] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [balance, setBalance] = useState(null);
  const [fundName, setFundName] = useState(null);
  const [fundSymbol, setFundSymbol] = useState(null);
  const [assetName, setAssetName] = useState(null);
  const [assetSymbol, setAssetSymbol] = useState(null);

  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const setAllToNull = () => {
    setIsFinalized(null);
    setManager(null);
    setIsClosed(null);
    setTotalSupply(null);
    setBalance(null);
    setFundSymbol(null);
    setFundSymbol(null);
    setAssetName(null);
    setAssetSymbol(null);
  };

  const ready = () => {
    return ![
      isFinalized,
      manager,
      isClosed,
      assetAddress,
      xTokenAddress,
      totalSupply,
      fundName,
      fundSymbol,
      assetName,
      assetSymbol,
    ].includes(null);
  };

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
    if (vaultId) {
      setTimeout(() => {
        makeFetchCalls();
      }, 500);
    }
  }, [vaultId]);

  const makeFetchCalls = () => {
    fetchXTokenAddress();
    fetchAssetAddress();
    fetchIsFinalized();
    fetchManager();
    fetchIsClosed();
  };

  useEffect(() => {
    if (xTokenAddress) {
      const xToken = new web3.eth.Contract(XToken.abi, xTokenAddress);
      xToken.methods
        .name()
        .call({ from: account })
        .then((retVal) => setFundName(retVal));
      xToken.methods
        .symbol()
        .call({ from: account })
        .then((retVal) => setFundSymbol(retVal));
      xToken.methods
        .totalSupply()
        .call({ from: account })
        .then((retVal) => setTotalSupply(retVal));
      if (account) {
        xToken.methods
          .balanceOf(account)
          .call({ from: account })
          .then((retVal) => setBalance(retVal));
      }
    }
  }, [xTokenAddress]);

  useEffect(() => {
    if (assetAddress) {
      console.log("assetAddress", assetAddress);
      const asset = new web3.eth.Contract(Erc20.abi, assetAddress);
      console.log("asset", asset);
      asset.methods
        .name()
        .call({ from: account })
        .then((retVal) => setAssetName(retVal));
      asset.methods
        .symbol()
        .call({ from: account })
        .then((retVal) => setAssetSymbol(retVal));
    }
  }, [assetAddress]);

  const fetchAssetAddress = () => {
    xStore.methods
      .d2AssetAddress(vaultId)
      .call({ from: account })
      .then((retVal) => setAssetAddress(retVal));
  };

  const fetchIsFinalized = () => {
    xStore.methods
      .isFinalized(vaultId)
      .call({ from: account })
      .then((retVal) => setIsFinalized(retVal));
  };

  const fetchManager = () => {
    xStore.methods
      .manager(vaultId)
      .call({ from: account })
      .then((retVal) => setManager(retVal));
  };

  const fetchIsClosed = () => {
    xStore.methods
      .isClosed(vaultId)
      .call({ from: account })
      .then((retVal) => setIsClosed(retVal));
  };

  const fetchXTokenAddress = () => {
    xStore.methods
      .xTokenAddress(vaultId)
      .call({ from: account })
      .then((retVal) => setXTokenAddress(retVal));
  };

  const handleClickManage = () => {
    setPanelTitle(`Manage ${fundSymbol || "Fund"}`);
    setInnerPanel(
      <ManageFundPanel
        vaultId={vaultId}
        onContinue={() => setPanelOpened(false)}
        isFinalized={isFinalized}
        manager={manager}
        isClosed={isClosed}
      />
    );
    setPanelOpened(true);
  };

  const handleMint = () => {
    setPanelTitle(`${fundSymbol} ▸ Mint`);
    setInnerPanel(
      <MintD1FundPanel
        vaultId={vaultId}
        ticker={fundSymbol}
        onContinue={() => {
          setAllToNull();
          makeFetchCalls();
          setPanelOpened(false);
        }}
        allowMintRequests={false}
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
    setPanelTitle(`${fundSymbol} ▸ Request`);
    setInnerPanel(
      <MintRequestPanel
        vaultId={vaultId}
        ticker={fundSymbol}
        onContinue={() => {
          setAllToNull();
          makeFetchCalls();
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
    setPanelTitle(`${fundSymbol} ▸ Redeem`);
    setInnerPanel();
    setInnerPanel(
      <RedeemD1FundPanel
        vaultId={vaultId}
        address={xTokenAddress}
        ticker={fundSymbol}
        onContinue={() => {
          setAllToNull();
          makeFetchCalls();
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
              D1 Funds
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
            display: ${ready() ? "" : "none"};
          `}
        >
          <DataView
            status={(() => (ready() ? "default" : "loading"))()}
            fields={[
              "Ticker",
              "Price",
              "Volume",
              "Supply",
              "TVL ‌‌ ‌‌ ‌‌ ‌‌ ‌‌",
              "",
            ]}
            entries={(() =>
              ready()
                ? [
                    {
                      ticker: fundSymbol,
                      price: "TBD",
                      volume: "TBD",
                      supply: totalSupply,
                      tvl: "TBD",
                      final: isFinalized,
                    },
                  ]
                : [])()}
            renderEntry={({ ticker, price, volume, supply, tvl, final }) => [
              <div>{ticker}</div>,
              <div style={{ minWidth: "40px" }}>{price}</div>,
              <div style={{ minWidth: "40px" }}>{volume}</div>,
              <div style={{ minWidth: "40px" }}>
                {web3.utils.fromWei(supply)}
              </div>,
              <div style={{ minWidth: "40px" }}>{tvl}</div>,
            ]}
            renderEntryActions={(entry, index) => {
              // const entryOwner =
              return (
                <ContextMenu>
                  <ContextMenuItem
                    onClick={() => {
                      handleMint(vaultId, fundSymbol);
                    }}
                  >
                    {"Mint"}
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => handleRedeem(entry.vaultId, entry.ticker)}
                  >
                    Redeem
                  </ContextMenuItem>
                  {}
                </ContextMenu>
              );
            }}
          />
        </div>
        <div>
          <DataView
            status={ready() ? "default" : "loading"}
            fields={["key", "value", ""]}
            entries={(() => {
              if (!ready()) {
                return [];
              }
              let arr = [
                {
                  key: "Status",
                  value: isClosed
                    ? "Closed"
                    : isFinalized
                    ? "Finalized"
                    : isFinalized === false
                    ? "Managed"
                    : "",
                },
              ];
              if (![assetName, assetSymbol, assetAddress].includes(null)) {
                arr.splice(0, 0, {
                  key: "BPT",
                  value: {
                    name: assetName,
                    symbol: assetSymbol,
                    address: assetAddress,
                  },
                });
              }
              if (![fundName, fundSymbol, xTokenAddress].includes(null)) {
                arr.splice(0, 0, {
                  key: "Fund",
                  value: {
                    name: fundName,
                    symbol: fundSymbol,
                    address: xTokenAddress,
                  },
                });
              }

              if (isFinalized === false && manager) {
                arr.push({
                  key: "Manager",
                  value: manager,
                });
              }
              /* if (!isClosed && !negateElig) {
                arr.push({
                  key: "Requests",
                  value: flipElig
                    ? "Required"
                    : allowMintReqs
                    ? "Allowed"
                    : allowMintReqs === false
                    ? "Not allowed"
                    : "",
                });
              }
              if ((pending && pending.length > 0) || allowMintReqs) {
                arr.push({
                  key: "Pending",
                  value:
                    !pending || pending.length === 0
                      ? "<empty>"
                      : pending.join(", "),
                });
              } else if (pending === null || allowMintReqs === null) {
                arr.push({
                  key: "Pending",
                  value: "Loading...",
                });
              }
              if (holdings) {
                arr.push({
                  key: "Holdings",
                  value:
                    holdings.length === 0 ? "<empty>" : holdings.join(", "),
                });
              } else {
                arr.push({
                  key: "Holdings",
                  value: "Loading...",
                });
              }
              if (eligibilities && negateElig !== null) {
                arr.push({
                  key: negateElig ? "Denylist" : "Allowlist",
                  value:
                    eligibilities.length === 0
                      ? "<empty>"
                      : eligibilities.join(", "),
                });
              } else {
                arr.push({
                  key:
                    negateElig === null
                      ? "Eligibilities"
                      : negateElig
                      ? "Denylist"
                      : "Allowlist",
                  value: "Loading...",
                });
              } */
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
                  ) : ["Fund", "BPT"].includes(key) ? (
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

export default D2FundView;
