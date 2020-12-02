import React, { useState, useRef } from "react";
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
} from "@aragon/ui";
import { useFavoriteFunds } from "../../contexts/FavoriteFundsContext";
import MintNftPanel from "./Panels/MintFundPanel";
import TransferNftPanel from "./Panels/BurnFundPanel";
import CreateErc20Panel from "../InnerPanels/CreateErc20Panel";
import CreateFundPanel from "../InnerPanels/CreateFundPanel";
import ManageFundPanel from "../InnerPanels/ManageFundPanel";
import Web3 from "web3";
import Nftx from "../../contracts/NFTX.json";
import addresses from "../../addresses/rinkeby.json";

function D1FundList() {
  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const {
    favoriteFunds,
    isAddressFavorited,
    removeFavoriteByAddress,
    addFavorite,
  } = useFavoriteFunds();

  const entries = [
    {
      ticker: "PUNK-BASIC",
      address: "0x73BF4793785A75a59863e8578794129b844C4Dc6",
      vaultId: 1,
    },
  ];

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
        fields={["Ticker", "Token Address", "vid", ""]}
        entries={favoriteFunds.concat(
          entries.filter(
            (e) => !favoriteFunds.find((f) => f.address === e.address)
          )
        )}
        renderEntry={(entry) => {
          const { ticker, address, vaultId } = entry;
          return [
            <div>{ticker}</div>,
            <AddressField address={address} autofocus={false} />,
            <div>{vaultId}</div>,
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
