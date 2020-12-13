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
import erc20 from "../../contracts/XToken.json";
import Loader from "react-loader-spinner";
import HashField from "../HashField/HashField";
import addresses from "../../addresses/mainnet.json";

function CreateErc20Panel({ onContinue }) {
  const { account } = useWallet();

  const { current: web3 } = useRef(new Web3(window.ethereum));

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  const [txStatus, setTxStatus] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  const handleDeploy = () => {
    const tokenContract = new web3.eth.Contract(erc20.abi);
    tokenContract
      .deploy({
        data: erc20.bytecode,
        arguments: [name, symbol, addresses.nftxProxy],
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
      });
  };

  if (!txHash) {
    return (
      <div>
        <div
          css={`
            margin-top: 20px;
            margin-bottom: 10px;
          `}
        >
          Deploy an ERC20 fund token
        </div>
        <TextInput
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name (e.g. Punk-Basic)"
          wide={true}
          css={`
            margin-bottom: 10px;
          `}
        />
        <TextInput
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          placeholder="Symbol (e.g. PUNK-BASIC)"
          wide={true}
          css={`
            margin-bottom: 15px;
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
          label="Continue"
          wide={true}
          onClick={() => onContinue(txReceipt.contractAddress, symbol)}
        />
      </div>
    );
  }
}

export default CreateErc20Panel;
