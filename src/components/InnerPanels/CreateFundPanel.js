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
import erc721Pub from "../../contracts/ERC721Public.json";
import Loader from "react-loader-spinner";
import HashField from "../HashField/HashField";
import { useFavoriteNFTs } from "../../contexts/FavoriteNFTsContext";

function CreateFundPanel({ tokenAddress, onContinue }) {
  const { account } = useWallet();

  const { current: web3 } = useRef(new Web3(window.ethereum));

  const [nftAddress, setNftAddress] = useState("");

  const [txStatus, setTxStatus] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  const handleCreate = () => {
    const nftContract = new web3.eth.Contract(erc721.abi);
    nftContract
      .deploy({
        data: erc721.bytecode,
        arguments: [name, symbol, minTokenId, maxTokenId],
      })
      .send(
        {
          from: account,
        },
        (error, txHash) => {}
      )
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        setTxReceipt(receipt);
        console.log(receipt);
      });
  };

  return (
    <div
      css={`
        margin-top: 20px;
      `}
    >
      <TextInput
        value={nftAddress}
        onChange={(event) => setNftAddress(event.target.value)}
        placeholder="NFT contract address (e.g. 0x0bf7...D63a)"
        wide={true}
        css={`
          margin-bottom: 10px;
        `}
      />

      <Button
        label={"Create Fund"}
        wide={true}
        disabled={!nftAddress || !account}
        onClick={() => console.log("TODO")}
      />
    </div>
  );
}

export default CreateFundPanel;
