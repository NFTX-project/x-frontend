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
  IconCircleCheck,
  IconCircleMinus,
  Info,
} from "@aragon/ui";
import { useFavoriteNFTs } from "../../contexts/FavoriteNFTsContext";
import CreateNftPanel from "../InnerPanels/CreateNftPanel";
import MintNftPanel from "../InnerPanels/MintNftPanel";
import TransferNftPanel from "../InnerPanels/TransferNftPanel";
import NftxReadPanel from "./NftxReadPanel";
import NftxWritePanel from "./NftxWritePanel";
import XStoreReadPanel from "./XStoreReadPanel";

import addresses from "../../addresses/rinkeby.json";

function Backend() {
  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const handleReadNftx = () => {
    setPanelTitle(`NFTX ▸ Read`);
    setInnerPanel(<NftxReadPanel />);
    setPanelOpened(true);
  };

  const handleWriteNftx = () => {
    setPanelTitle(`NFTX ▸ Write`);
    setInnerPanel(<NftxWritePanel closePanel={() => setPanelOpened(false)} />);
    setPanelOpened(true);
  };

  const handleReadXStore = () => {
    setPanelTitle(`XStore ▸ Read`);
    setInnerPanel(<XStoreReadPanel />);
    setPanelOpened(true);
  };

  const handleWriteXStore = () => {
    setPanelTitle(`XStore ▸ Write`);
    setInnerPanel(
      <div
        css={`
          margin-top: 20px;
        `}
      >
        <Info>There are no callable write functions for XStore</Info>
      </div>
    );
    setPanelOpened(true);
  };

  return (
    <div>
      <Header primary="Contracts" />
      <DataView
        fields={["Name", "Address", "Proxy"]}
        entries={[
          {
            name: "NFTX",
            address: addresses.nftxProxy,
            proxy: true,
          },
          {
            name: "XStore",
            address: addresses.xStore,
          },
        ]}
        renderEntry={({ name, address, proxy }) => {
          return [
            <div>{name}</div>,
            <AddressField address={address} autofocus={false} />,
            <div>{proxy ? <IconCircleCheck /> : <IconCircleMinus />}</div>,
          ];
        }}
        renderEntryActions={(entry, index) => {
          return (
            <ContextMenu>
              <ContextMenuItem
                onClick={
                  entry.name === "NFTX" ? handleReadNftx : handleReadXStore
                }
              >
                Read...
              </ContextMenuItem>
              <ContextMenuItem
                onClick={
                  entry.name === "NFTX" ? handleWriteNftx : handleWriteXStore
                }
              >
                Write...
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

Backend.propTypes = {
  title: PropTypes.string,
  entries: PropTypes.arrayOf(NftType),
  handleMint: PropTypes.func,
};

export default Backend;
