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
import IErc721Plus from "../../contracts/IERC721Plus.json";
import addresses from "../../addresses/mainnet.json";

import ManageFundPanel from "../InnerPanels/ManageFundPanel";
import MintFundPanel from "../InnerPanels/MintFundPanel";
import MintRequestPanel from "../InnerPanels/MintRequestPanel";
import RedeemFundPanel from "../InnerPanels/RedeemFundPanel";

const zeroAddress = "0x0000000000000000000000000000000000000000";

function D1FundView() {
  const location = useLocation();
  const [vaultId, setVaultId] = useState(null);
  const [invalidVid, setInvalidVid] = useState(false);

  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : "wss://mainnet.infura.io/ws/v3/b35e1df04241408281a8e7a4e3cd555c";

  const { current: web3 } = useRef(new Web3(provider));
  const xStore = new web3.eth.Contract(XStore.abi, addresses.xStore);
  const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);

  const [storeEvents, setStoreEvents] = useState(null);
  const [nftxEvents, setNftxEvents] = useState(null);

  const [isFinalized, setIsFinalized] = useState(null);
  const [manager, setManager] = useState(null);
  const [isClosed, setIsClosed] = useState(null);
  const [allowMintReqs, setAllowMintReqs] = useState(null);
  const [flipElig, setFlipElig] = useState(null);
  const [nftAddress, setNftAddress] = useState(null);
  const [xTokenAddress, setXTokenAddress] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [balance, setBalance] = useState(null);
  const [negateElig, setNegateElig] = useState(null);
  const [eligibilities, setEligibilities] = useState(null);
  const [holdings, setHoldings] = useState(null);
  const [pending, setPending] = useState(null);
  const [fundName, setFundName] = useState(null);
  const [fundSymbol, setFundSymbol] = useState(null);
  const [nftName, setNftName] = useState(null);
  const [nftSymbol, setNftSymbol] = useState(null);

  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const setAllToNull = () => {
    setIsFinalized(null);
    setManager(null);
    setIsClosed(null);
    setAllowMintReqs(null);
    setFlipElig(null);
    setTotalSupply(null);
    setBalance(null);
    setNegateElig(null);
    setEligibilities(null);
    setHoldings(null);
    setPending(null);
    setFundSymbol(null);
    setFundSymbol(null);
    setNftName(null);
    setNftSymbol(null);
  };

  const ready = () => {
    return ![
      isFinalized,
      manager,
      isClosed,
      allowMintReqs,
      flipElig,
      nftAddress,
      xTokenAddress,
      totalSupply,
      negateElig,
      /* eligibilities, */
      /* holdings, */
      /* pending, */
      fundName,
      fundSymbol,
      nftName,
      nftSymbol,
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
    fetchNftAddress();
    fetchIsFinalized();
    fetchManager();
    fetchIsClosed();
    fetchAllowMintReqs();
    fetchFlipElig();
    fetchNegateEligibility();
    fetchEvents();
  };

  useEffect(() => {
    if (storeEvents) {
      parseHoldings();
      parseEligibilities();
      parseRequests();
    }
  }, [storeEvents]);

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
    if (nftAddress) {
      const nft = new web3.eth.Contract(IErc721Plus.abi, nftAddress);
      nft.methods
        .name()
        .call({ from: account })
        .then((retVal) => setNftName(retVal));
      nft.methods
        .symbol()
        .call({ from: account })
        .then((retVal) => setNftSymbol(retVal));
    }
  }, [nftAddress]);

  const fetchNftAddress = () => {
    xStore.methods
      .nftAddress(vaultId)
      .call({ from: account })
      .then((retVal) => setNftAddress(retVal));
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

  const fetchAllowMintReqs = () => {
    xStore.methods
      .allowMintRequests(vaultId)
      .call({ from: account })
      .then((retVal) => setAllowMintReqs(retVal));
  };

  const fetchFlipElig = () => {
    xStore.methods
      .flipEligOnRedeem(vaultId)
      .call({ from: account })
      .then((retVal) => setFlipElig(retVal));
  };

  const fetchXTokenAddress = () => {
    xStore.methods
      .xTokenAddress(vaultId)
      .call({ from: account })
      .then((retVal) => setXTokenAddress(retVal));
  };

  const fetchNegateEligibility = () => {
    xStore.methods
      .negateEligibility(vaultId)
      .call({ from: account })
      .then((retVal) => setNegateElig(retVal));
  };

  const fetchEvents = () => {
    xStore
      .getPastEvents("allEvents", { fromBlock: 7664346, toBlock: "latest" })
      .then((events) => {
        setStoreEvents(
          events
            .filter((event) => event.returnValues.vaultId === vaultId)
            .map((event) => {
              event.contract = "XStore";
              return event;
            })
        );
      });
    nftx
      .getPastEvents("allEvents", { fromBlock: 7664346, toBlock: "latest" })
      .then((events) => {
        setNftxEvents(
          events
            .filter((event) => event.returnValues.vaultId === vaultId)
            .map((event) => {
              event.contract = "NFTX";
              return event;
            })
        );
      });
  };

  const parseHoldings = () => {
    const _holdings = {};
    storeEvents
      .filter(
        (event) =>
          event.event === "HoldingsAdded" || event.event === "HoldingsRemoved"
      )
      .forEach((event) => {
        const { blockNumber, returnValues } = event;
        const { id } = returnValues;
        if (!_holdings[id] || _holdings[id].blockNumber < blockNumber) {
          _holdings[id] = { blockNumber: blockNumber, name: event.event };
        } else if (_holdings[id].blockNumber === blockNumber) {
          _holdings[id].collision = true;
        }
      });
    let remainingCalls = 0;
    const finish = () => {
      if (remainingCalls === 0) {
        setHoldings(
          Object.keys(_holdings).filter(
            (key) => _holdings[key].name === "HoldingsAdded"
          )
        );
      }
    };
    Object.keys(_holdings).forEach((key) => {
      if (_holdings[key].collision) {
        remainingCalls += 1;
        xStore.methods
          .holdingsContains(vaultId, key)
          .call({ from: account })
          .then((retVal) => {
            _holdings[key].name = "HoldingsAdded";
            remainingCalls -= 1;
            finish();
          });
      }
    });
    finish();
  };

  const parseRequests = () => {
    const _pending = {};
    storeEvents
      .filter((event) => event.event === "RequesterSet")
      .forEach((event) => {
        const { blockNumber, returnValues } = event;
        const { id, requester } = returnValues;
        if (!_pending[id] || _pending[id].blockNumber < blockNumber) {
          _pending[id] = { blockNumber: blockNumber, requester: requester };
        } else if (
          _pending[id].blockNumber === blockNumber &&
          _pending[id].requester !== requester
        ) {
          _pending[id].collision = true;
        }
      });
    let remainingCalls = 0;
    const finish = () => {
      if (remainingCalls === 0) {
        setPending(
          Object.keys(_pending).filter(
            (key) => _pending[key].requester !== zeroAddress
          )
        );
      }
    };
    Object.keys(_pending).forEach((key) => {
      if (_pending[key].collision) {
        remainingCalls += 1;
        xStore.methods
          .requester(vaultId, key)
          .call({ from: account })
          .then((retVal) => {
            _pending[key].requester = retVal;
            remainingCalls -= 1;
            finish();
          });
      }
    });
    finish();
  };

  const parseEligibilities = () => {
    const _eligibilities = {};
    storeEvents
      .filter((event) => event.event === "IsEligibleSet")
      .forEach((event) => {
        const { blockNumber, returnValues } = event;
        const { id, _bool } = returnValues;
        if (
          !_eligibilities[id] ||
          _eligibilities[id].blockNumber < blockNumber
        ) {
          _eligibilities[id] = { blockNumber: blockNumber, bool: _bool };
        } else if (
          _eligibilities[id].blockNumber === blockNumber &&
          _eligibilities[id].bool !== _bool
        ) {
          _eligibilities[id].collision = true;
        }
      });
    let remainingCalls = 0;
    const finish = () => {
      if (remainingCalls === 0) {
        setEligibilities(
          Object.keys(_eligibilities).filter((key) => _eligibilities[key].bool)
        );
      }
    };
    Object.keys(_eligibilities).forEach((key) => {
      if (_eligibilities[key].collision) {
        remainingCalls += 1;
        xStore.methods
          .isEligible(vaultId, key)
          .call({ from: account })
          .then((retVal) => {
            _eligibilities[key].bool = retVal;
            remainingCalls -= 1;
            finish();
          });
      }
    });
    finish();
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
      <MintFundPanel
        vaultId={vaultId}
        ticker={fundSymbol}
        onContinue={() => {
          setAllToNull();
          makeFetchCalls();
          setPanelOpened(false);
        }}
        allowMintRequests={allowMintReqs}
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
      <RedeemFundPanel
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
                      if (flipElig) {
                        handleMintRequest(vaultId, fundSymbol);
                      } else {
                        handleMint(vaultId, fundSymbol);
                      }
                    }}
                  >
                    {flipElig
                      ? "Mint Request"
                      : allowMintReqs
                      ? "Mint / Request"
                      : "Mint"}
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
              if (![fundName, fundSymbol, xTokenAddress].includes(null)) {
                arr.splice(0, 0, {
                  key: "ERC20",
                  value: {
                    name: fundName,
                    symbol: fundSymbol,
                    address: xTokenAddress,
                  },
                });
              }
              if (![nftName, nftSymbol, nftAddress].includes(null)) {
                arr.splice(0, 0, {
                  key: "NFT",
                  value: {
                    name: nftName,
                    symbol: nftSymbol,
                    address: nftAddress,
                  },
                });
              }

              if (isFinalized === false && manager) {
                arr.push({
                  key: "Manager",
                  value: manager,
                });
              }
              if (!isClosed && !negateElig) {
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
                  value: pending.length === 0 ? "<empty>" : pending.join(", "),
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
