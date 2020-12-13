import React, { useState, useRef } from "react";
import {
  DropDown,
  TextInput,
  Button,
  AddressField,
  IconCheck,
} from "@aragon/ui";
import Web3 from "web3";
import { useWallet } from "use-wallet";
import XStore from "../../contracts/XStore.json";
import Loader from "react-loader-spinner";
import HashField from "../HashField/HashField";
import { useFavoriteNFTs } from "../../contexts/FavoriteNFTsContext";
import addresses from "../../addresses/mainnet.json";

function XStoreReadPanel() {
  const { account } = useWallet();

  // const { addFavorite } = useFavoriteNFTs();

  const { current: web3 } = useRef(new Web3(window.ethereum));

  const xStore = new web3.eth.Contract(XStore.abi, addresses.xStore);

  const [funcParams, setFuncParams] = useState(JSON.parse("[[]]"));
  const [returnVals, setReturnVals] = useState(JSON.parse("[[]]"));

  return (
    <div
      css={`
        & > div {
          margin-top: 25px;
          margin-bottom: 40px;
        }
      `}
    >
      {XStore.abi
        .filter(
          (item) =>
            item.type === "function" && item.stateMutability.includes("view")
        )
        .map((func, i) => (
          <div key={i}>
            {func.inputs.map((input, _i) => (
              <TextInput
                css={`
                  margin-bottom: 10px;
                `}
                key={_i}
                value={(funcParams[i] && funcParams[i][_i]) || ""}
                onChange={(event) => {
                  const newFuncParams = JSON.parse(JSON.stringify(funcParams));
                  if (!newFuncParams[i]) {
                    newFuncParams[i] = [];
                  }
                  newFuncParams[i][_i] = event.target.value;
                  setFuncParams(newFuncParams);
                }}
                placeholder={`${input.name} (${input.type})`}
                wide={true}
              />
            ))}
            <Button
              css={`
                margin-top: 5px;
                margin-bottom: 15px;
              `}
              label={func.name}
              wide={true}
              disabled={!account}
              onClick={() => {
                xStore.methods[func.name](...funcParams[i])
                  .call({ from: account })
                  .then((...retValues) => {
                    const newReturnVals = JSON.parse(
                      JSON.stringify(returnVals)
                    );
                    newReturnVals[i] = retValues[0];
                    setReturnVals(newReturnVals);
                  });
              }}
            />
            {func.outputs.map((output, _i) => (
              <TextInput
                css={`
                  margin-bottom: 10px;
                `}
                key={_i}
                value={(returnVals[i] && returnVals[i][_i]) || returnVals[i]}
                onChange={(event) => {
                  if (event.target.value === "") {
                    const newReturnVals = JSON.parse(
                      JSON.stringify(returnVals)
                    );
                    newReturnVals[i] = newReturnVals[i].map(() => "");
                    setReturnVals(newReturnVals);
                  }
                }}
                placeholder={`${output.name} (${output.type})`}
                wide={true}
              />
            ))}
          </div>
        ))}
    </div>
  );
}

export default XStoreReadPanel;
