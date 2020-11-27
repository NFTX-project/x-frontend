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
} from "@aragon/ui";

import CreateNftPanel from "./CreateNftPanel/CreateNftPanel";

function NftList() {
  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const entries = [
    {
      name: "CryptoPunks",
      supply: "0",
      address: "0xa10234D171fb300A741F1981b550c8CA391EA74f",
    },
  ];

  const handleMint = () => console.log("clicked");

  const handleClickCreate = () => {
    setPanelTitle("Create NFT");
    setInnerPanel(<CreateNftPanel />);
    setPanelOpened(true);
  };

  return (
    <div>
      <Header
        primary="NFT List"
        secondary={<Button label="Create NFT" onClick={handleClickCreate} />}
      />
      <DataView
        fields={["Name", "Supply", "Address", ""]}
        entries={entries}
        renderEntry={({ name, supply, address }) => {
          return [
            <div>{name}</div>,
            <div>{supply}</div>,
            <AddressField address={address} autofocus={false} />,
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
