import React from "react";
import { DataView } from "@aragon/ui";

function Bounties() {
  return (
    <div
      className="xtokens-wrapper"
      css={`
        max-width: 1000px;
        margin: auto;
      `}
    >
      <DataView
        fields={["XToken", "Offer"]}
        entries={[
          { ticker: "PUNK-BASIC", offer: "480" },
          { ticker: "PUNK-ATTR-4", offer: "610" },
          { ticker: "PUNK-ATTR-5", offer: "1150" },
          { ticker: "PUNK-ZOMBIE", offer: "4640" },
        ]}
        renderEntry={({ ticker, offer }) => {
          return [<div>{ticker}</div>, <div>{offer}</div>];
        }}
      />
    </div>
  );
}

export default Bounties;
