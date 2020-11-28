import React, { useState, useRef } from "react";
import { DropDown, TextInput, Button, AddressField } from "@aragon/ui";
import Web3 from "web3";
import { useWallet } from "use-wallet";
import erc721 from "../../../contracts/ERC721.json";
import Loader from "react-loader-spinner";

function CreateNftPanel() {
  const { account } = useWallet();

  const { current: web3 } = useRef(new Web3(window.ethereum));

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  const [txStatus, setTxStatus] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  console.log("account", account);

  const handleDeploy = () => {
    const nftContract = new web3.eth.Contract(erc721.abi);
    nftContract
      .deploy({
        data: erc721.bytecode,
        arguments: [name, symbol],
      })
      .send(
        {
          from: account,
        },
        (error, txHash) => {}
      )
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => setTxReceipt(receipt));
  };

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
      <div
        css={`
          position: relative;
          & > div > div:first-child {
          }
        `}
      >
        <div
          css={`
            position: absolute;
            z-index: 100;
            top: 2px;
            left: 11px;
            color: #201143;
            font-size: 28px;
            font-weight: 200;
          `}
        >
          #
        </div>

        <AddressField
          address="0xec81be6cb447f1b7a66fd4574fd4dfa87813ce39f51c04886c12dd2a8ecd7f24"
          autofocus={false}
        />
      </div>
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

  /* if (!txHash) {
    return (
      <div>
        <DropDown
          items={["Anyone can mint", "Only owner can mint"]}
          placeholder={"Anyone can mint"}
          onChange={() => console.log("changed")}
          wide
          css={`
            margin: 20px 0 15px;
          `}
        />
        <TextInput
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name (e.g. CryptoGems)"
          wide={true}
          css={`
            margin-bottom: 10px;
          `}
        />
        <TextInput
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          placeholder="Symbol (e.g. GEMS)"
          wide={true}
          css={`
            margin-bottom: 20px;
          `}
        />
        <Button
          label={"Deploy ERC20"}
          wide={true}
          disabled={!name || !symbol || !account}
          onClick={handleDeploy}
        />
      </div>
    );
  } else if (txHash && !txReceipt) {
    return (
      <div>
        <Loader type="Puff" color="#A9416E" height={100} width={100} />
      </div>
    );
  } else {
    return <div>DONE</div>;
  } */
}

export default CreateNftPanel;
