import React from "react";
import { DataView } from "@aragon/ui";

function FundEvents({ events }) {
  return (
    <DataView
      fields={["Name", "Vaules", "Date"]}
      entries={events}
      renderEntry={(entry) => [<div></div>, <div></div>, <div></div>]}
    />
  );
}
