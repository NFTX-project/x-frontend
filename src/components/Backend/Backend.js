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
  IconCircleCheck,
  IconCircleMinus,
  Info,
} from "@aragon/ui";
import Web3 from "web3";
import { useWallet } from "use-wallet";
import { useFavoriteNFTs } from "../../contexts/FavoriteNFTsContext";
import CreateNftPanel from "../InnerPanels/CreateNftPanel";
import MintNftPanel from "../InnerPanels/MintNftPanel";
import TransferNftPanel from "../InnerPanels/TransferNftPanel";
import NftxReadPanel from "./NftxReadPanel";
import NftxWritePanel from "./NftxWritePanel";
import XStoreReadPanel from "./XStoreReadPanel";
import NftxEvents from "./NftxEvents";
import XStoreEvents from "./XStoreEvents";

import addresses from "../../addresses/mainnet.json";

function Backend() {
  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const [nftxEvents, setNFTXEvents] = useState([]);

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
      <div
        css={`
          th:nth-of-type(1) {
            min-width: 8%;
          }
          th:nth-of-type(2) {
            min-width: 12%;
          }
        `}
      >
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
          renderEntryExpansion={(entry, index) => {
            return entry.name === "NFTX" ? (
              <div
                css={`
                  padding: 15px 0;
                `}
              >
                Implementation address:{" "}
                <span
                  css={`
                    margin-left: 10px;
                    font-size: 14px;
                    font-family: aragon-ui-monospace, monospace;
                  `}
                >
                  0x3A2f04fAa1d39AcB088BecE5C2D6B00E81AFe868
                </span>
              </div>
            ) : null;
          }}
        />
      </div>
      <SidePanel
        title={panelTitle}
        opened={panelOpened}
        onClose={() => setPanelOpened(false)}
      >
        {innerPanel}
      </SidePanel>
      <Header
        primary="NFTX Events"
        css={`
          margin-top: 20px;
        `}
      />
      <div
        css={`
          th:first-of-type {
            min-width: 20%;
          }
        `}
      >
        <NftxEvents />
      </div>
      <Header
        primary="XStore Events"
        css={`
          margin-top: 20px;
        `}
      />
      <div
        css={`
          th:first-of-type {
            min-width: 20%;
          }
        `}
      >
        <XStoreEvents />
      </div>
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
