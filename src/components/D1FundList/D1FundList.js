import React, { useState, useRef, useEffect } from "react";
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
} from "@aragon/ui";
import { useFavoriteFunds } from "../../contexts/FavoriteFundsContext";
import MintNftPanel from "./Panels/MintFundPanel";
import TransferNftPanel from "./Panels/BurnFundPanel";
import CreateErc20Panel from "../InnerPanels/CreateErc20Panel";
import CreateFundPanel from "../InnerPanels/CreateFundPanel";
import ManageFundPanel from "../InnerPanels/ManageFundPanel";
import Web3 from "web3";
import Nftx from "../../contracts/NFTX.json";
import XStore from "../../contracts/XStore.json";
import XToken from "../../contracts/XToken.json";
import addresses from "../../addresses/rinkeby.json";

function D1FundList() {
  const { account } = useWallet();
  const { current: web3 } = useRef(new Web3(window.ethereum));
  const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);
  const xStore = new web3.eth.Contract(XStore.abi, addresses.xStore);

  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const [chainData, setChainData] = useState({});
  const [tableEntries, setTableEntries] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const allDone = () => {
        return resRemaining === 0;
      };
      const data = {};
      let resRemaining = 0;
      const update = (data) => {
        setChainData(data);
        setTableEntries(getAllEntries());
      };
      getAllEntries().forEach((entry) => {
        const fundToken = new web3.eth.Contract(XToken.abi, entry.address);
        data[entry.address] = {};
        resRemaining += 1;
        xStore.methods
          .isFinalized(entry.vaultId)
          .call({ from: account })
          .then((retVal) => {
            data[entry.address].isFinalized = retVal.toString();
            resRemaining -= 1;
            allDone() && update(data);
          });
        resRemaining += 1;
        fundToken.methods
          .totalSupply()
          .call({ from: account })
          .then((retVal) => {
            data[entry.address].totalSupply = retVal;
            resRemaining -= 1;
            allDone() && update(data);
          });
      });
    }, 500);
  }, []);

  const {
    favoriteFunds,
    isAddressFavorited,
    removeFavoriteByAddress,
    addFavorite,
  } = useFavoriteFunds();

  const entries = [
    {
      ticker: "PUNK-BASIC",
      address: "0xC88F0D30E1D738Ed5B74b777eca03a9A613F7B29",
      vaultId: 0,
    },
    {
      ticker: "PUNK-ATTR-4",
      address: "0x5b56285416374065CB60FB46F9FfCa4dE92a6D67",
      vaultId: 1,
    },
    {
      ticker: "PUNK-ATTR-5",
      address: "0xa4059D5773FC1451CC29269958537DAF18672BBb",
      vaultId: 2,
    },
    {
      ticker: "PUNK-ZOMBIE",
      address: "0x464eFf1c8066800102EcDcb4bA9fE897a29D17Ee",
      vaultId: 3,
    },

    {
      ticker: "KITTY-GEN-0",
      address: "0x0c31B027ae697810eb0655327cE49f02C1AaFf07",
      vaultId: 4,
    },
    {
      ticker: "KITTY-GEN-0-F",
      address: "0x4190217cBd75EA52a6Bb2d6F2e94AB0d7a07c613",
      vaultId: 5,
    },
    {
      ticker: "KITTY-FANCY",
      address: "0xCa5A75D49E0d3B27D415c67891d6755aD1b5Bdfe",
      vaultId: 6,
    },
    {
      ticker: "KITTY-FOUNDER",
      address: "0x5E11E15F8437593da2403EbC679C19a62066DA06",
      vaultId: 7,
    },
    {
      ticker: "AXIE-ORIGIN",
      address: "0x536E8ffC58473450E0B9E785E9052Ae02EA04c87",
      vaultId: 8,
    },
    {
      ticker: "AXIE-MYSTIC-1",
      address: "0x4f4aEcb0455f2977CcB7758366C212f94840c14d",
      vaultId: 9,
    },
    {
      ticker: "AXIE-MYSTIC-2",
      address: "0x7056d1f97E94DA343D97C65709cdd51c178b1F06",
      vaultId: 10,
    },

    {
      ticker: "AVASTR-RANK-25",
      address: "0x8d7751860957d8dd448E2d0921279e028c178DE1",
      vaultId: 11,
    },
    {
      ticker: "AVASTR-RANK-50",
      address: "0xA2dA2C6Eaa1B3eD098Caf11bd75c2a79542036e7",
      vaultId: 12,
    },
    {
      ticker: "AVASTR-RANK-75",
      address: "0xb33b7Bc97cd1e3ABD51c9fEA60528e2B74CF5d26",
      vaultId: 13,
    },
    {
      ticker: "GLYPH",
      address: "0xae046E463cca3a3FbEFA6f93adB02714f359c97C",
      vaultId: 14,
    },
    {
      ticker: "JOY",
      address: "0xe9d6516Fb6E7Db555E6194CC131dC82B8056C8CB",
      vaultId: 15,
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

  const handleMint = (address, name) => {
    setPanelTitle(`${name} ▸ Mint`);
    setInnerPanel(
      <MintNftPanel
        contractAddress={address}
        closePanel={() => setPanelOpened(false)}
      />
    );
    setPanelOpened(true);
  };

  const handleRedeem = (vaultId, name) => {
    setPanelTitle(`${name} ▸ Transfer`);
    setInnerPanel(
      <TransferNftPanel closePanel={() => setPanelOpened(false)} />
    );
    setPanelOpened(true);
  };

  const handleManage = (vaultId, name) => {
    setPanelTitle(`Manage ${name}`);
    setInnerPanel(
      <ManageFundPanel
        vaultId={vaultId}
        closePanel={() => setPanelOpened(false)}
      />
    );
    setPanelOpened(true);
  };

  return (
    <div>
      <Header
        primary="D1 Funds"
        secondary={
          <Button label="Create D1 Fund" onClick={handleClickCreate} />
        }
      />
      <DataView
        status="loading"
        fields={["Ticker", "Token Address", "Finalized", "Supply", ""]}
        entries={tableEntries}
        entriesPerPage={20}
        renderEntry={(entry) => {
          const { ticker, address, vaultId } = entry;
          return [
            <div>{ticker}</div>,
            <AddressField address={address} autofocus={false} />,
            <div>
              {chainData[address] &&
              chainData[address].isFinalized === "true" ? (
                <IconCircleCheck />
              ) : (
                <IconCircleMinus />
              )}
            </div>,
            <div>{chainData[address] && chainData[address].totalSupply}</div>,
            <div
              css={`
                & > svg {
                }
                cursor: pointer;
                padding: 5px;
              `}
              onClick={() =>
                isAddressFavorited(address)
                  ? removeFavoriteByAddress(address)
                  : addFavorite(entry)
              }
            >
              {isAddressFavorited(address) ? <IconStarFilled /> : <IconStar />}
            </div>,
          ];
        }}
        renderEntryActions={(entry, index) => {
          // const entryOwner =
          return (
            <ContextMenu>
              <ContextMenuItem
                onClick={() => handleMint(entry.address, entry.ticker)}
              >
                Mint
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => handleRedeem(entry.address, entry.ticker)}
              >
                Redeem
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => handleManage(entry.vaultId, entry.ticker)}
              >
                Manage...
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
