import React, { useState, useRef, useEffect } from "react";
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
import IErc721 from "../../contracts/IERC721.json";
import Loader from "react-loader-spinner";
import HashField from "../HashField/HashField";
import { useFavoriteNFTs } from "../../contexts/FavoriteNFTsContext";
import addresses from "../../addresses/mainnet.json";

function ApproveNftsPanel({ vaultId, ticker, closePanel }) {
  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : "wss://eth-mainnet.ws.alchemyapi.io/v2/fL1uiXELcu8QeuLAxoCNmnbf_XuVlHBD";

  const { current: web3 } = useRef(new Web3(provider));

  const [tokenId, setTokenId] = useState("");

  const [txStatus, setTxStatus] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  const [nftAddress, setNftAddress] = useState("");

  const xStore = new web3.eth.Contract(XStore.abi, addresses.xStore);

  useEffect(() => {
    xStore.methods
      .nftAddress(vaultId)
      .call({ from: account })
      .then((retVal) => {
        setNftAddress(retVal);
      });
  }, []);

  const handleApproveAll = () => {
    const nft = new web3.eth.Contract(IErc721.abi, nftAddress);
    nft.methods
      .setApprovalForAll(addresses.nftxProxy, true)
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
      });
  };

  const handleApproveIndividual = () => {
    const nft = new web3.eth.Contract(IErc721.abi, nftAddress);
    nft.methods
      .approve(addresses.nftxProxy, tokenId)
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
      });
  };

  const handleViewNFT = () => {
    closePanel();
  };

  if (!txHash) {
    return (
      <div
        css={`
          margin-top: 20px;
        `}
      >
        <TextInput
          value={tokenId}
          onChange={(event) => setTokenId(event.target.value)}
          placeholder="Token ID (e.g. 42)"
          wide={true}
          css={`
            margin-bottom: 10px;
          `}
        />

        <Button
          label={"Approve Individual NFT"}
          wide={true}
          disabled={!tokenId || !account}
          onClick={handleApproveIndividual}
        />

        <Button
          label={"Approve All NFTs"}
          wide={true}
          disabled={!tokenId || !account}
          onClick={handleApproveAll}
          css={`
            margin-top: 40px;
          `}
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
  } else {
    return (
      <div>
        <div
          css={`
            margin-top: 28px;
            margin-bottom: 20px;
          `}
        >
          Fund minted succesfully
          <IconCheck
            css={`
              transform: translate(5px, 5px) scale(1.2);
              color: #5ac994;
            `}
          />
        </div>
        <Button label="Return to List" wide={true} onClick={handleViewNFT} />
      </div>
    );
  }
}

export default ApproveNftsPanel;
