import React, { useState } from "react";
import { TextInput, Button, Header, textStyle, DropDown } from "@aragon/ui";

function CreateD1PanelA() {
  const [value, setValue] = useState("");

  return (
    <div css={``}>
      <div
        css={`
          margin-bottom: 20px;
        `}
      >
        <DropDown
          items={["Deploy an ERC20", "Link to existing ERC20"]}
          placeholder={"Deploy an ERC20"}
          onChange={() => console.log("changed")}
          wide
          css={`
            margin: 20px 0 15px;
          `}
        />

        <TextInput
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Name (e.g. Punk-Basic)"
          wide={true}
          css={`
            margin-bottom: 15px;
          `}
        />
        <TextInput
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Symbol (e.g. PUNK-BASIC)"
          wide={true}
        />
      </div>
      <Button
        label={"Deploy ERC20"}
        wide={true}
        disabled={isNaN(parseInt(value)) || parseInt(value) === 0}
      />
    </div>
  );
}

export default CreateD1PanelA;
