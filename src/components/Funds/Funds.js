import React from "react";
import PropTypes from "prop-types";
import { DataView, ContextMenu, ContextMenuItem, Header } from "@aragon/ui";

function Funds({ title, entries, handleMint, handleRedeem }) {
  return (
    <div>
      {title && <Header primary={title} />}
      <DataView
        fields={["Ticker", "Price", "Supply", "TVL", "Volume", ""]}
        entries={entries}
        renderEntry={({ ticker, supply }) => {
          return [
            <div>{ticker}</div>,
            <div>N/A</div>,
            <div>{supply}</div>,
            <div>N/A</div>,
            <div>N/A</div>,
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
                onClick={() => handleRedeem(entry.vaultId, entry.ticker)}
              >
                Redeem
              </ContextMenuItem>
            </ContextMenu>
          );
        }}
      />
    </div>
  );
}

export const FundType = PropTypes.shape({
  ticker: PropTypes.string,
  supply: PropTypes.string,
  vaultId: PropTypes.string,
});

Funds.propTypes = {
  title: PropTypes.string,
  entries: PropTypes.arrayOf(FundType),
  handleMint: PropTypes.func,
  handleRedeem: PropTypes.func,
};

export default Funds;
