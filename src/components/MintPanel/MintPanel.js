import React, { useState } from "react";
import { TextInput, Button } from "@aragon/ui";

function MintPanel({ ticker }) {
  const [values, setValues] = useState([""]);
  const getAmount = () =>
    values.reduce((acc, val, i) => {
      if (isNaN(parseInt(val))) {
        return acc;
      }
      if (values.slice(0, i).includes(val)) {
        return acc;
      }
      return acc + 1;
    }, 0);
  return (
    <div
      css={`
        margin-top: 25px;
      `}
    >
      {values.map((v, i) => (
        <div
          key={i}
          css={`
            margin-bottom: 20px;
          `}
        >
          <TextInput
            value={v}
            onChange={(event) => {
              const newValues = JSON.parse(JSON.stringify(values));
              newValues[i] = event.target.value;
              setValues(newValues);
            }}
            placeholder="NFT tokenID"
          />
          {i === values.length - 1 ? (
            <Button
              css={`
                margin-left: 15px;
              `}
              label="+"
              onClick={() => {
                const newValues = JSON.parse(JSON.stringify(values));
                newValues.push("");
                setValues(newValues);
              }}
            />
          ) : (
            <Button
              css={`
                margin-left: 15px;
              `}
              label="-"
              onClick={() => {
                const newValues = values.filter((_v, _i) => _i !== i);
                setValues(newValues);
              }}
            />
          )}
        </div>
      ))}
      <Button
        label={`Mint ${getAmount()} ${ticker}`}
        wide={true}
        disabled={getAmount() === 0}
      />
    </div>
  );
}

export default MintPanel;
