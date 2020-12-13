import React, { useState, useEffect } from "react";
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
import CreateNftPanel from "../InnerPanels/CreateNftPanel";
import MintNftPanel from "../InnerPanels/MintNftPanel";
import TransferNftPanel from "../InnerPanels/TransferNftPanel";

function NftList() {
  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const [tableEntries, setTableEntries] = useState([]);

  const {
    favoriteNFTs,
    isAddressFavorited,
    removeFavoriteByAddress,
    addFavorite,
  } = useFavoriteNFTs();

  const entries = [
    {
      name: "CryptoPunks",
      address: "0xcC495748Df37dCfb0C1041a6FDfA257D350aFD60",
    },
    {
      name: "Autoglyphs",
      address: "0x476895959C3E2a775a433B0DFA7744Ec9726b6bc",
    },
    {
      name: "CryptoKitties",
      address: "0xc860383974FB0D4b1FCD988024c3632C23b506f7",
    },
    { name: "Axie", address: "0xCf4CeD73Cdc2725cbE8DCd837CE2F46716D5b6D3" },
    { name: "Avastar", address: "0xD8f9c5A7d228b99e7307FA37872A339359ED111B" },
    { name: "JOYWORLD", address: "0x50BBddbF12A97B2BfbCC7B728Eb08Dc40d123FAd" },
  ];

  useEffect(() => {
    fetchTableEntries();
  }, []);

  const fetchTableEntries = () => {
    setTableEntries(
      favoriteNFTs.concat(
        entries.filter(
          (e) => !favoriteNFTs.find((f) => f.address === e.address)
        )
      )
    );
  };

  const handleClickCreate = () => {
    setPanelTitle("Create NFT");
    setInnerPanel(
      <CreateNftPanel
        onContinue={() => {
          window.location.reload();
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
        onContinue={() => {
          fetchTableEntries();
          setPanelOpened(false);
        }}
      />
    );
    setPanelOpened(true);
  };

  const handleTransfer = (address, name) => {
    setPanelTitle(`${name} ▸ Transfer`);
    setInnerPanel(
      <TransferNftPanel
        contractAddress={address}
        onContinue={() => {
          fetchTableEntries();
          setPanelOpened(false);
        }}
      />
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
        status="loading"
        fields={["Name", "Contract Address", ""]}
        entries={tableEntries}
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
                onClick={() => handleMint(entry.address, entry.name)}
              >
                Mint
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => handleTransfer(entry.address, entry.name)}
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
