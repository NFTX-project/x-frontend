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
import addresses from "../../addresses/mainnet.json";

function CreateFundPanel({ tokenAddress, onContinue }) {
  const { account } = useWallet();

  const { current: web3 } = useRef(new Web3(window.ethereum));

  const [nftAddress, setNftAddress] = useState("");

  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  const handleCreate = () => {
    const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);
    // window.nftx = nftx;
    nftx.methods
      .createVault(tokenAddress, nftAddress, false)
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
            margin-bottom: 15px;
          `}
        />

        <Button
          label={"Create Fund"}
          wide={true}
          disabled={!nftAddress || !account}
          onClick={handleCreate}
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
          Fund created succesfully
          <IconCheck
            css={`
              transform: translate(5px, 5px) scale(1.2);
              color: #5ac994;
            `}
          />
        </div>
        <Button
          label="View Fund"
          wide={true}
          onClick={() =>
            onContinue(txReceipt.events.NewVault.returnValues.vaultId)
          }
        />
      </div>
    );
  }
}

export default CreateFundPanel;
