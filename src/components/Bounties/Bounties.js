import React from "react";
import { DataView, ContextMenu, ContextMenuItem } from "@aragon/ui";

function Bounties() {
  return (
    <div
      className="xtokens-wrapper"
      css={`
        max-width: 950px;
        width: 80%;
        margin: auto;
      `}
    >
      <DataView
        fields={["XToken", "Reward", "Reward", "Filled","Remaining", ""]}
        entries={[
          { ticker: "PUNK-BASIC", maxReward: "3", remaining: "50" },
          { ticker: "PUNK-ATTR-4", maxReward: "4", remaining: "20" },
          { ticker: "PUNK-ATTR-5", maxReward: "10", remaining: "6" },
          { ticker: "PUNK-ZOMBIE", maxReward: "30", remaining: "3" },
        ]}
        renderEntry={({ ticker, maxReward, remaining }) => {
          return [<div>{ticker}</div>, <div>{maxReward/2}</div>,<div>{maxReward}</div>, <div>{remaining-2}</div>,<div>{remaining}</div>];
        }}
        renderEntryActions={(entry, index) => {
          return <ContextMenu>
          <ContextMenuItem>Some Action</ContextMenuItem>
          <ContextMenuItem>Another Action</ContextMenuItem>
        </ContextMenu>
        }}
      />
    </div>
  );
}

export default Bounties;
