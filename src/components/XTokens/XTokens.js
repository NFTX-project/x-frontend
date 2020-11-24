import React from "react";
import PropTypes from "prop-types";
import { DataView, ContextMenu, ContextMenuItem, Header } from "@aragon/ui";

function XTokens({ title, entries }) {
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
        fields={["ERC20", "Price", "Supply", ""]}
        entries={entries}
        renderEntry={({ ticker, supply }) => {
          return [
            <div>{ticker}</div>,
            <div>N/A</div>,
            <div>{supply}</div>,
          ];
        }}
        renderEntryActions={(entry, index) => {
          return (
            <ContextMenu>
              <ContextMenuItem>Mint</ContextMenuItem>
              <ContextMenuItem>Redeem</ContextMenuItem>
              <ContextMenuItem>Manage</ContextMenuItem>
            </ContextMenu>
          );
        }}
      />
    </div>
  );
}

export const BountyType = PropTypes.shape({
  ticker: PropTypes.string.isRequired,
  maxReward: PropTypes.string.isRequired,
  filled: PropTypes.string.isRequired,
  remaining: PropTypes.string.isRequired,
});

XTokens.propTypes = {
  title: PropTypes.string,
  entries: PropTypes.arrayOf(BountyType),
};

export default XTokens;
