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
import Nftx from "../../contracts/NFTX.json";
import Loader from "react-loader-spinner";
import HashField from "../HashField/HashField";
import { useFavoriteNFTs } from "../../contexts/FavoriteNFTsContext";
import addresses from "../../addresses/rinkeby.json";

function ManageFundPanel() {
  const { account } = useWallet();

  // const { addFavorite } = useFavoriteNFTs();

  const { current: web3 } = useRef(new Web3(window.ethereum));

  const [vaultId, setVaultId] = useState("");
  const [nftId, setNftId] = useState("");

  const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);

  const [funcParams, setFuncParams] = useState(JSON.parse("[[]]"));
  const [returnVals, setReturnVals] = useState(JSON.parse("[[]]"));

  const getIsEligible = () => {};

  console.log(Nftx.abi);

  return (
    <div
      css={`
        & > div {
          margin-top: 25px;
          margin-bottom: 40px;
        }
      `}
    >
      {Nftx.abi
        .filter(
          (item) =>
            item.type === "function" && !item.stateMutability.includes("view")
        )
        .map((func, i) => (
          <div key={i}>
            {func.inputs.map((input, _i) => (
              <TextInput
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
                css={`
                  margin-bottom: 10px;
                `}
              />
            ))}
            <Button
              label={func.name}
              wide={true}
              disabled={!account}
              onClick={() => {
                console.log(func.name);
                nftx.methods[func.name](...funcParams[i])
                  .send({ from: account })
                  .then((receipt) => {
                    console.log("receipt", receipt);
                  });
              }}
              css={`
                margin-top: 5px;
                margin-bottom: 15px;
              `}
            />
          </div>
        ))}
    </div>
  );
}

export default ManageFundPanel;
