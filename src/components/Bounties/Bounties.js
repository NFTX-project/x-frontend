import React from "react";
import PropTypes from "prop-types";
import { DataView, ContextMenu, ContextMenuItem, Header } from "@aragon/ui";

function Bounties({ title, entries }) {
  return (
    <div
      className="xtokens-wrapper"
      css={`
        max-width: 950px;
        width: 80%;
        margin: auto;
      `}
    >
      {title && <Header primary={title} />}
      <DataView
        fields={["XToken", "Reward", "Max Reward", "Filled", "Remaining", ""]}
        entries={entries}
        renderEntry={({ ticker, maxRewardEth, remaining }) => {
          const maxReward = maxRewardEth * 150;
          return [
            <div>{ticker}</div>,
            <div>{maxReward / 2}</div>,
            <div>{maxReward}</div>,
            <div>{remaining - 2}</div>,
            <div>{remaining}</div>,
          ];
        }}
        renderEntryActions={(entry, index) => {
          return (
            <ContextMenu>
              <ContextMenuItem>Some Action</ContextMenuItem>
              <ContextMenuItem>Another Action</ContextMenuItem>
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

Bounties.propTypes = {
  title: PropTypes.string,
  entries: PropTypes.arrayOf(BountyType),
};

export default Bounties;
