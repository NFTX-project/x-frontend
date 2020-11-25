import React from "react";
import PropTypes from "prop-types";
import { DataView, ContextMenu, ContextMenuItem, Header } from "@aragon/ui";

function XTokens({ title, entries, handleMint, handleRedeem }) {
  return (
    <div
      className="xtokens-wrapper"
      css={`
        max-width: 950px;
        width: 80%;
        margin: auto;
        margin-bottom: 25px;
      `}
    >
      {title && <Header primary={title} />}
      <DataView
        fields={["Ticker", "Price", "Supply", ""]}
        entries={entries}
        renderEntry={({ ticker, supply }) => {
          return [<div>{ticker}</div>, <div>N/A</div>, <div>{supply}</div>];
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

export const XTokenType = PropTypes.shape({
  ticker: PropTypes.string,
  supply: PropTypes.string,
  vaultId: PropTypes.string,
});

XTokens.propTypes = {
  title: PropTypes.string,
  entries: PropTypes.arrayOf(XTokenType),
  handleMint: PropTypes.func,
  handleRedeem: PropTypes.func,
};

export default XTokens;
