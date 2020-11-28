import React, { useState, useRef } from "react";
import { DropDown, TextInput, Button } from "@aragon/ui";
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

  if (txHash && !txReceipt) {
    return (
      <div>
        <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={3000} //3 secs
        />
      </div>
    );
  } else {
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
  }
}

export default CreateNftPanel;
