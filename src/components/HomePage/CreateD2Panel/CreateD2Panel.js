import React, { useState } from "react";
import {
  TextInput,
  Button,
  Header,
  textStyle,
  DropDown,
  Info,
} from "@aragon/ui";

function CreateD2Panel() {
  const [value, setValue] = useState("");

  return (
    <div
      css={`
        margin-top: 20px;
      `}
    >
      <Info>This feature is coming soon.</Info>
    </div>
  );
}

export default CreateD2Panel;
