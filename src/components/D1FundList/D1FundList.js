import React, { useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useWallet } from "use-wallet";
import PropTypes from "prop-types";
import {
  DataView,
  ContextMenu,
  ContextMenuItem,
  Header,
  Button,
  AddressField,
  SidePanel,
  IconStarFilled,
  IconStar,
  IconCircleCheck,
  IconCircleMinus,
  FloatIndicator,
  Info,
} from "@aragon/ui";
import { useFavoriteFunds } from "../../contexts/FavoriteFundsContext";
import MintFundPanel from "../InnerPanels/MintFundPanel";
import MintRequestPanel from "../InnerPanels/MintRequestPanel";
import RedeemFundPanel from "../InnerPanels/RedeemFundPanel";
import CreateErc20Panel from "../InnerPanels/CreateErc20Panel";
import CreateFundPanel from "../InnerPanels/CreateFundPanel";
import ManageFundPanel from "../InnerPanels/ManageFundPanel";
import Web3 from "web3";
import Nftx from "../../contracts/NFTX.json";
import XStore from "../../contracts/XStore.json";
import XToken from "../../contracts/XToken.json";
import addresses from "../../addresses/mainnet.json";
import ApproveNftsPanel from "../InnerPanels/ApproveNftsPanel";
import Web3Utils from "web3-utils";

function D1FundList() {
  const history = useHistory();
  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : "wss://mainnet.infura.io/ws/v3/b35e1df04241408281a8e7a4e3cd555c";

  const { current: web3 } = useRef(new Web3(provider));
  const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);
  const xStore = new web3.eth.Contract(XStore.abi, addresses.xStore);

  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const [chainData, setChainData] = useState({});
  const [eligPrefsArr, setEligPrefsArr] = useState([]);
  const [tableEntries, setTableEntries] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      fetchData();
      fetchEligPrefs();
    }, 500);
  }, [account]);

  const fetchData = () => {
    const allDone = () => {
      return resRemaining === 0;
    };
    const data = { hasBalances: false };
    let resRemaining = 0;
    const update = (data) => {
      setChainData(data);
      setTableEntries(getAllEntries());
    };
    getAllEntries().forEach((entry) => {
      const fundToken = new web3.eth.Contract(XToken.abi, entry.address);
      data[entry.vaultId] = {};
      resRemaining += 1;
      xStore.methods
        .isFinalized(entry.vaultId)
        .call({ from: account })
        .then((retVal) => {
          data[entry.vaultId].isFinalized = retVal.toString();
          resRemaining -= 1;
          allDone() && update(data);
        });
      resRemaining += 1;
      fundToken.methods
        .totalSupply()
        .call({ from: account })
        .then((retVal) => {
          data[entry.vaultId].totalSupply = Web3Utils.fromWei(retVal);
          resRemaining -= 1;
          allDone() && update(data);
        });
      if (account) {
        resRemaining += 1;
        fundToken.methods
          .balanceOf(account)
          .call({ from: account })
          .then((retVal) => {
            data.hasBalances = true;
            data[entry.vaultId].myBalance = Web3Utils.fromWei(retVal);
            resRemaining -= 1;
            allDone() && update(data);
          });
      }
    });
  };

  const fetchEligPrefs = () => {
    const data = [];
    let count = 0;
    const allEntries = getAllEntries();
    const finish = () => {
      count += 1;
      if (count === allEntries.length * 2) {
        setEligPrefsArr(data);
      }
    };
    allEntries.forEach(({ vaultId }) => {
      data[vaultId] = {};
      xStore.methods
        .allowMintRequests(vaultId)
        .call({ from: account })
        .then((retVal) => {
          data[vaultId].allowMintRequests = retVal;
          finish();
        });
      xStore.methods
        .flipEligOnRedeem(vaultId)
        .call({ from: account })
        .then((retVal) => {
          data[vaultId].flipEligOnRedeem = retVal;
          finish();
        });
    });
  };

  const {
    favoriteFunds,
    isAddressFavorited,
    removeFavoriteByVaultId,
    addFavorite,
  } = useFavoriteFunds();

  const entries = [
    {
      ticker: "PUNK-BASIC",
      address: "0x69BbE2FA02b4D90A944fF328663667DC32786385",
      vaultId: 0,
    },
    {
      ticker: "PUNK-FEMALE",
      address: "0x27Ffed7E5926Fb2795fC85aAab558243F280A8a2",
      vaultId: 15,
    },
    {
      ticker: "PUNK-ATTR-4",
      address: "0x49706a576bb823cdE3180C930F9947d59e2deD4D",
      vaultId: 1,
    },
    {
      ticker: "PUNK-ATTR-5",
      address: "0xAB9c92A9337A1494C6D545E48187Fa37144403c8",
      vaultId: 2,
    },
    {
      ticker: "PUNK-ZOMBIE",
      address: "0xF18ade29a225fAa555e475eE01F9Eb66eb4a3a74",
      vaultId: 3,
    },
    {
      ticker: "AXIE-ORIGIN",
      address: "0x5b9F63F256FAC333bC2Bc73c7867BA4865a49729",
      vaultId: 4,
    },
    {
      ticker: "AXIE-MYSTIC-1",
      address: "0xb10d6A165ed1ff64C02557213B2e060FDCb6244A",
      vaultId: 5,
    },
    {
      ticker: "AXIE-MYSTIC-2",
      address: "0x6030021c45D4365A296c9e16A3901b4957061c21",
      vaultId: 6,
    },

    {
      ticker: "KITTY-GEN-0",
      address: "0x8712A5580995a1b0E10856e8C3E26B14C1CDF7b6",
      vaultId: 7,
    },
    {
      ticker: "KITTY-GEN-0-F",
      address: "0xc4bf60B93ac60dB9A45AD232368d50de0A354849",
      vaultId: 8,
    },
    {
      ticker: "KITTY-FOUNDER",
      address: "0x77ECd352D737eBB9A7E7F35172f56da36D91e895",
      vaultId: 9,
    },

    {
      ticker: "AVASTR-BASIC",
      address: "0xb5A0931b1B7F21C2F557fd4FDdCcb504e71AE32D",
      vaultId: 10,
    },
    {
      ticker: "AVASTR-RANK-30",
      address: "0x59a82F0FF8E88804a34Dd467b7061F1986Fe1769",
      vaultId: 11,
    },
    {
      ticker: "AVASTR-RANK-60",
      address: "0xabA49Db7E374cc6954401DC0A886E0B02670536e",
      vaultId: 12,
    },
    {
      ticker: "GLYPH",
      address: "0xc8AA432112814B9CAB53811D4340Ed45482CB2b5",
      vaultId: 13,
    },
    {
      ticker: "JOY",
      address: "0x4acC9c89F47f5330b2f4F412ef157E3016333f58",
      vaultId: 14,
    },
  ];

  const getAllEntries = () =>
    favoriteFunds.concat(
      entries.filter((e) => !favoriteFunds.find((f) => f.address === e.address))
    );

  const handleClickCreate = () => {
    setPanelTitle("Create a D1 Fund (Step 1/2)");
    setInnerPanel(
      <CreateErc20Panel
        onContinue={(tokenAddress, tokenSymbol) => {
          setPanelOpened(false);
          setTimeout(() => {
            setPanelTitle("Create a D1 Fund (Step 2/2)");
            setInnerPanel(
              <CreateFundPanel
                tokenAddress={tokenAddress}
                onContinue={(vaultId) => {
                  addFavorite({
                    ticker: tokenSymbol,
                    address: tokenAddress,
                    vaultId: vaultId,
                  });
                  setPanelOpened(false);
                  setTimeout(() => {
                    window.location.hash = `/fund/${vaultId}`;
                  }, 400);
                }}
              />
            );
            setPanelOpened(true);
          }, 500);
        }}
      />
    );
    setPanelOpened(true);
  };

  const closeAndOpenMintPanel = () => {};

  const closeAndOpenRequestPanel = () => {};

  const handleMint = (vaultId, ticker) => {
    setPanelTitle(`${ticker} ▸ Mint`);
    setInnerPanel(
      <MintFundPanel
        vaultId={vaultId}
        ticker={ticker}
        onContinue={() => {
          setTableEntries([]);
          fetchData();
          setPanelOpened(false);
        }}
        allowMintRequests={
          eligPrefsArr[vaultId] && eligPrefsArr[vaultId].allowMintRequests
        }
        onMakeRequest={() => {
          setPanelOpened(false);
          setTimeout(() => {
            handleMintRequest(vaultId, ticker);
          }, 500);
        }}
      />
    );
    setPanelOpened(true);
  };

  const handleMintRequest = (vaultId, ticker) => {
    setPanelTitle(`${ticker} ▸ Request`);
    setInnerPanel(
      <MintRequestPanel
        vaultId={vaultId}
        ticker={ticker}
        onContinue={() => {
          setTableEntries([]);
          fetchData();
          setPanelOpened(false);
        }}
        onMintNow={() => {
          setPanelOpened(false);
          setTimeout(() => {
            handleMint(vaultId, ticker);
          }, 500);
        }}
      />
    );
    setPanelOpened(true);
  };

  const handleRedeem = (vaultId, ticker, address) => {
    setPanelTitle(`${ticker} ▸ Redeem`);
    setInnerPanel();
    setInnerPanel(
      <RedeemFundPanel
        vaultId={vaultId}
        address={address}
        ticker={ticker}
        onContinue={() => {
          setTableEntries([]);
          fetchData();
          setPanelOpened(false);
        }}
      />
    );
    setPanelOpened(true);
  };

  /* const handleManage = (vaultId, ticker) => {
    setPanelTitle(`Manage ${ticker}`);
    setInnerPanel(
      <ManageFundPanel
        vaultId={vaultId}
        closePanel={() => setPanelOpened(false)}
      />
    );
    setPanelOpened(true);
  }; */

  const cleanNum = (num, exp = 1) => {
    return Math.trunc(parseFloat(num) * Math.pow(10, exp)) / Math.pow(10, exp);
  };

  return (
    <div
      css={`
        padding-bottom: 10px;
      `}
    >
      <Header
        primary="D1 Funds"
        secondary={
          <Button label="Create D1 Fund" onClick={handleClickCreate} />
        }
      />
      <DataView
        status="loading"
        fields={(() => {
          const fields = [
            "Ticker",
            "Price",
            "Volume",
            "Supply",
            "TVL",
            "Final",
            "",
          ];
          if (account && chainData.hasBalances) {
            fields.splice(6, 0, "Bal");
          }
          return fields;
        })()}
        entries={tableEntries}
        entriesPerPage={20}
        renderEntry={(entry) => {
          const { ticker, address, vaultId } = entry;
          const cells = [
            <Link
              css={`
                text-decoration: none;
              `}
              to={`fund/${vaultId}`}
            >
              {ticker}
            </Link>,
            <div>TBD</div>,
            <div>TBD</div>,
            <div>{chainData[vaultId] && chainData[vaultId].totalSupply}</div>,
            <div>TBD</div>,
            <div>
              {chainData[vaultId] &&
              chainData[vaultId].isFinalized === "true" ? (
                <IconCircleCheck />
              ) : (
                <IconCircleMinus />
              )}
            </div>,
            <div
              css={`
                & > svg {
                }
                cursor: pointer;
                padding: 5px;
              `}
              onClick={() =>
                isAddressFavorited(address)
                  ? removeFavoriteByVaultId(vaultId)
                  : addFavorite(entry)
              }
            >
              {isAddressFavorited(address) ? <IconStarFilled /> : <IconStar />}
            </div>,
          ];
          if (account && chainData.hasBalances) {
            cells.splice(
              6,
              0,
              <div>
                {chainData[vaultId] &&
                  cleanNum(chainData[vaultId].myBalance, 2)}
              </div>
            );
          }
          return cells;
        }}
        renderEntryActions={({ vaultId, ticker, address }, index) => {
          return (
            <ContextMenu>
              <ContextMenuItem
                onClick={() => {
                  if (
                    eligPrefsArr[vaultId] &&
                    eligPrefsArr[vaultId].flipEligOnRedeem
                  ) {
                    handleMintRequest(vaultId, ticker);
                  } else {
                    handleMint(vaultId, ticker);
                  }
                }}
              >
                {(eligPrefsArr[vaultId] &&
                  (eligPrefsArr[vaultId].flipEligOnRedeem
                    ? "Mint Request"
                    : eligPrefsArr[vaultId].allowMintRequests
                    ? "Mint / Request"
                    : "")) ||
                  "Mint"}
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => handleRedeem(vaultId, ticker, address)}
              >
                Redeem
              </ContextMenuItem>
              <ContextMenuItem onClick={() => history.push(`/fund/${vaultId}`)}>
                Inspect...
              </ContextMenuItem>
              {}
            </ContextMenu>
          );
        }}
      />
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

export const NftType = PropTypes.shape({
  name: PropTypes.string,
  supply: PropTypes.string,
  address: PropTypes.string,
});

D1FundList.propTypes = {
  title: PropTypes.string,
  entries: PropTypes.arrayOf(NftType),
  handleMint: PropTypes.func,
};

export default D1FundList;
