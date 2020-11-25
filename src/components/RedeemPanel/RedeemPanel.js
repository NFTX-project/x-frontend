import React, { useState } from "react";
import { TextInput, Button } from "@aragon/ui";

function RedeemPanel({ ticker }) {
  const [value, setValue] = useState("");

  return (
    <div
      css={`
        margin-top: 25px;
      `}
    >
      <div
        css={`
          margin-bottom: 20px;
        `}
      >
        <TextInput
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="NFT tokenID"
        />
        <Button
          css={`
            margin-left: 15px;
          `}
          label="max"
          onClick={() => console.log("clicked")}
        />
      </div>
      <Button
        label={`Redeem ${
          !isNaN(parseInt(value)) ? parseInt(value) : 0
        } ${ticker}`}
        wide={true}
        disabled={isNaN(parseInt(value)) || parseInt(value) === 0}
      />
    </div>
  );
}

export default RedeemPanel;
