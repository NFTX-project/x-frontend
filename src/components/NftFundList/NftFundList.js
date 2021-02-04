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
  Checkbox,
} from "@aragon/ui";
import { useFavoriteFunds } from "../../contexts/FavoriteFundsContext";
import MintD1FundPanel from "../InnerPanels/MintD1FundPanel";
import MintRequestPanel from "../InnerPanels/MintRequestPanel";
import RedeemD1FundPanel from "../InnerPanels/RedeemD1FundPanel";
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

function NftFundList() {
  const history = useHistory();
  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : `wss://eth-mainnet.ws.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`;

  const { current: web3 } = useRef(new Web3(provider));
  const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);
  const xStore = new web3.eth.Contract(XStore.abi, addresses.xStore);

  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const [chainData, setChainData] = useState({});
  const [eligPrefsArr, setEligPrefsArr] = useState([]);
  const [tableEntries, setTableEntries] = useState([]);

  const [showAllIsChecked, setShowAllIsChecked] = useState(false);

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
      ticker: "PUNK",
      address: "0x9cea2eD9e47059260C97d697f82b8A14EfA61EA5",
      vaultId: 16,
      degree: 2,
      feature: true,
    },
  ];

  const getAllEntries = () =>
    favoriteFunds.concat(
      entries.filter((e) => !favoriteFunds.find((f) => f.address === e.address))
    );

  const handleMint = (vaultId, ticker) => {
    setPanelTitle(`${ticker} ▸ Mint`);
    setInnerPanel(
      <MintD1FundPanel
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
      <RedeemD1FundPanel
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
        primary="NFT Funds"
        secondary={
          <div
            css={`
              cursor: pointer;
              & > label {
                cursor: pointer;
              }
            `}
          >
            <label>
              <Checkbox
                checked={showAllIsChecked}
                onChange={(checked) => setShowAllIsChecked(checked)}
              />
              <span
                css={`
                  display: inline-block;
                  transform: translateY(-2px);
                  padding: 0 4px;
                  user-select: none;
                  cursor: pointer;
                `}
              >
                Show all
              </span>
            </label>
          </div>
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
            "Deg",
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
          const { ticker, address, vaultId, degree } = entry;
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
            <div>{`D${degree}`}</div>,
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

NftFundList.propTypes = {
  title: PropTypes.string,
  entries: PropTypes.arrayOf(NftType),
  handleMint: PropTypes.func,
};

export default NftFundList;
