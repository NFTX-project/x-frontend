import React, { useState } from "react";
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
import { useFavoriteNFTs } from "../../contexts/FavoriteNFTsContext";
import CreateNftPanel from "./Panels/CreateNftPanel";
import MintNftPanel from "./Panels/MintNftPanel";
import TransferNftPanel from "./Panels/TransferNftPanel";

function NftList() {
  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const {
    favoriteNFTs,
    isAddressFavorited,
    removeFavoriteByAddress,
    addFavorite,
  } = useFavoriteNFTs();

  const entries = [
    {
      name: "CryptoPunks",
      address: "0xa10234D171fb300A741F1981b550c8CA391EA74f",
    },
    {
      name: "Autoglyphs",
      address: "0xa10214D17cfb300A741F1981b550c8CA391EA74f",
    },
    {
      name: "Avastars",
      address: "0xa10234D171fb30aA741F1981b553c8CA391EA74f",
    },
    {
      name: "Joyworld",
      address: "0xa10234D111fb310A741F1981b550c8CA391EA74f",
    },
  ];

  const handleClickCreate = () => {
    setPanelTitle("Create NFT");
    setInnerPanel(<CreateNftPanel closePanel={() => setPanelOpened(false)} />);
    setPanelOpened(true);
  };

  const handleMint = (vaultId, name) => {
    setPanelTitle(`Mint ${name}`);
    setInnerPanel(<MintNftPanel closePanel={() => setPanelOpened(false)} />);
    setPanelOpened(true);
  };

  const handleTransfer = (vaultId, name) => {
    setPanelTitle(`Transfer ${name}`);
    setInnerPanel(
      <TransferNftPanel closePanel={() => setPanelOpened(false)} />
    );
    setPanelOpened(true);
  };

  return (
    <div>
      <Header
        primary="NFT List"
        secondary={<Button label="Create NFT" onClick={handleClickCreate} />}
      />
      <DataView
        fields={["Name", "Contract Address", ""]}
        entries={favoriteNFTs.concat(
          entries.filter(
            (e) => !favoriteNFTs.find((f) => f.address === e.address)
          )
        )}
        renderEntry={({ name, supply, address }) => {
          return [
            <div>{name}</div>,
            <AddressField address={address} autofocus={false} />,
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
                  : addFavorite({ name, address })
              }
            >
              {isAddressFavorited(address) ? <IconStarFilled /> : <IconStar />}
            </div>,
          ];
        }}
        renderEntryActions={(entry, index) => {
          return (
            <ContextMenu>
              <ContextMenuItem
                onClick={() => handleMint(entry.vaultId, entry.ticker)}
              >
                Mint
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => handleTransfer(entry.vaultId, entry.ticker)}
              >
                Transfer
              </ContextMenuItem>
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

NftList.propTypes = {
  title: PropTypes.string,
  entries: PropTypes.arrayOf(NftType),
  handleMint: PropTypes.func,
};

export default NftList;
