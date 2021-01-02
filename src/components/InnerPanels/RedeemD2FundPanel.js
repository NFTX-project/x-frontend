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
import erc721 from "../../contracts/ERC721Public.json";
import Loader from "react-loader-spinner";
import HashField from "../HashField/HashField";
import { useFavoriteNFTs } from "../../contexts/FavoriteNFTsContext";
import addresses from "../../addresses/mainnet.json";
import XStore from "../../contracts/XStore.json";
import Nftx from "../../contracts/NFTX.json";
import XToken from "../../contracts/XToken.json";

function RedeemD2FundPanel({ vaultId, address, ticker, onContinue }) {
  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : "wss://eth-mainnet.ws.alchemyapi.io/v2/fL1uiXELcu8QeuLAxoCNmnbf_XuVlHBD";

  const { current: web3 } = useRef(new Web3(provider));
  const xStore = new web3.eth.Contract(XStore.abi, addresses.xStore);
  const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);
  const xToken = new web3.eth.Contract(XToken.abi, address);

  const [amount, setAmount] = useState("");

  const [allowance, setAllowance] = useState(null);
  const [doneRedeeming, setDoneRedeeming] = useState(false);
  const [nftIdsArr, setNftIdsArr] = useState(null);

  const [txIsApproval, setTxIsApproval] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  useEffect(() => {
    fetchAllowance();
  }, [account]);

  const fetchAllowance = () => {
    if (account)
      xToken.methods
        .allowance(account, addresses.nftxProxy)
        .call({ from: account })
        .then((retVal) => setAllowance(retVal));
  };

  const handleRedeem = () => {
    setTxIsApproval(false);
    setTxHash(null);
    setTxReceipt(null);
    nftx.methods
      .redeem(vaultId, amount)
      .send(
        {
          from: account,
        },
        (error, txHash) => {}
      )
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        receipt.events["Redeem"] &&
          setNftIdsArr(receipt.events["Redeem"].returnValues.nftIds);
        setDoneRedeeming(true);
        setTxReceipt(receipt);
        console.log(receipt);
      });
  };

  const handleApprove = () => {
    setTxHash(null);
    setTxReceipt(null);
    setTxIsApproval(true);
    xToken.methods
      .approve(addresses.nftxProxy, web3.utils.toWei(amount))
      .send(
        {
          from: account,
        },
        (error, txHash) => {}
      )
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        fetchAllowance();
        setTimeout(() => setTxReceipt(receipt), 1000);
        console.log(receipt);
      });
  };

  const isApproved = () =>
    allowance &&
    !isNaN(parseInt(amount)) &&
    parseInt(amount) <= web3.utils.fromWei(allowance);

  if (!doneRedeeming && (!txHash || (txIsApproval && txReceipt))) {
    return (
      <div
        css={`
          margin-top: 20px;
        `}
      >
        <TextInput
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Amount (e.g. 1)"
          wide={true}
          css={`
            margin-bottom: 10px;
          `}
        />
        <div
          css={`
            margin-top: 5px;
            margin-bottom: 10px;
          `}
        >
          {(() =>
            isApproved() ? (
              <Button label={`Approved`} wide={true} disabled={true} />
            ) : (
              <Button
                label={`Approve ${
                  !isNaN(parseInt(amount)) ? parseInt(amount) : ""
                } ${ticker}`}
                wide={true}
                disabled={!amount || !account}
                onClick={handleApprove}
              />
            ))()}
        </div>

        <Button
          label={`Redeem ${
            !isNaN(parseInt(amount)) ? parseInt(amount) : ""
          } ${ticker}`}
          wide={true}
          disabled={!amount || !account || !isApproved()}
          onClick={handleRedeem}
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
          {txIsApproval ? "Approval" : "Redemption"} in progress...
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
          Redemption was successful
          <IconCheck
            css={`
              transform: translate(5px, 5px) scale(1.2);
              color: #5ac994;
            `}
          />
        </div>
        <div
          css={`
            background: rgba(53, 43, 78, 0.7);
            padding: 6px 8px 3px;
            border-radius: 3px;
            margin-bottom: 15px;
          `}
        >
          {nftIdsArr.length === 0 ? "<empty>" : nftIdsArr.join(", ")}
        </div>
        <Button label="Return To Page" wide={true} onClick={onContinue} />
      </div>
    );
  }
}

export default RedeemD2FundPanel;
