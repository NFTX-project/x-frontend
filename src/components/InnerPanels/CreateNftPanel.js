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
import erc721 from "../../contracts/ERC721Public.json";
import Loader from "react-loader-spinner";
import HashField from "../HashField/HashField";
import { useFavoriteNFTs } from "../../contexts/FavoriteNFTsContext";

function CreateNftPanel({ closePanel }) {
  const { account } = useWallet();

  const { addFavorite } = useFavoriteNFTs();

  const { current: web3 } = useRef(new Web3(window.ethereum));

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [minTokenId, setMinTokenId] = useState("");
  const [maxTokenId, setMaxTokenId] = useState("");

  const [txStatus, setTxStatus] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  const handleDeploy = () => {
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

  const handleViewNFT = () => {
    addFavorite({ name: name, address: txReceipt.contractAddress });
    closePanel();
  };

  if (!txHash) {
    return (
      <div>
        <TextInput
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name (e.g. CryptoGems)"
          wide={true}
          css={`
            margin-top: 20px;
            margin-bottom: 10px;
          `}
        />
        <TextInput
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          placeholder="Symbol (e.g. GEMS)"
          wide={true}
          css={`
            margin-bottom: 10px;
          `}
        />
        <TextInput
          value={minTokenId}
          onChange={(event) => setMinTokenId(event.target.value)}
          placeholder="Minimum token ID (e.g. 0)"
          wide={true}
          css={`
            margin-bottom: 10px;
          `}
        />
        <TextInput
          value={maxTokenId}
          onChange={(event) => setMaxTokenId(event.target.value)}
          placeholder="Maximum token ID (e.g. 9999)"
          wide={true}
          css={`
            margin-bottom: 20px;
          `}
        />
        <Button
          label={"Deploy ERC721"}
          wide={true}
          disabled={!name || !symbol || !account}
          onClick={handleDeploy}
        />
      </div>
    );
  } else if (txHash && !txReceipt) {
    return (
      <div>
        <div
          css={`
            margin-top: 28px;
            margin-bottom: 20px;
          `}
        >
          Transaction in progress...
        </div>
        <HashField hash={txHash} />
        <Loader
          type="ThreeDots"
          color="#201143"
          width={150}
          css={`
            margin-top: 50px;
            display: flex;
            justify-content: center;
          `}
        />
      </div>
    );
  } else if (txError) {
    return (
      <div>
        <div
          css={`
            margin-top: 28px;
            margin-bottom: 20px;
          `}
        >
          Error occured. Check console.
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div
          css={`
            margin-top: 28px;
            margin-bottom: 20px;
          `}
        >
          Contract deployed succesfully
          <IconCheck
            css={`
              transform: translate(5px, 5px) scale(1.2);
              color: #5ac994;
            `}
          />
        </div>
        <Button
          label="View Updated NFT List"
          wide={true}
          onClick={handleViewNFT}
        />
      </div>
    );
  }
}

export default CreateNftPanel;
