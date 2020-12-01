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
import erc721Pub from "../../../contracts/ERC721Public.json";
import Loader from "react-loader-spinner";
import HashField from "../../HashField/HashField";
import { useFavoriteNFTs } from "../../../contexts/FavoriteNFTsContext";

function MintFundPanel({ contractAddress, closePanel }) {
  const { account } = useWallet();

  const { addFavorite } = useFavoriteNFTs();

  const { current: web3 } = useRef(new Web3(window.ethereum));

  const [tokenId, setTokenId] = useState("");
  const [recipient, setRecipient] = useState("");

  const [txStatus, setTxStatus] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  const handleMint = (tokenId, recipient) => {
    const nftContract = new web3.eth.Contract(erc721Pub.abi, contractAddress);
    nftContract.methods
      .mint(tokenId, recipient)
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
        <TextInput
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
          placeholder="Recipient (e.g. 0x0bf7...D63)"
          wide={true}
          css={`
            margin-bottom: 20px;
          `}
        />

        <Button
          label={"Mint NFT"}
          wide={true}
          disabled={!tokenId || !recipient || !account}
          onClick={() => handleMint(tokenId, recipient)}
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
          NFT minted succesfully
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

export default MintFundPanel;
