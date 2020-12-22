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
import XBounties from "../../contracts/XBounties.json";
import XToken from "../../contracts/XToken.json";

const zeroAddress = "0x0000000000000000000000000000000000000000";

function FillBountyPanel({
  bountyId,
  ticker,
  address,
  rewardRate,
  payoutCap,
  paidOut,
  onContinue,
  maxPayout,
}) {
  console.log("address", address);
  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : "wss://mainnet.infura.io/ws/v3/b35e1df04241408281a8e7a4e3cd555c";

  const { current: web3 } = useRef(new Web3(provider));
  const xStore = new web3.eth.Contract(XStore.abi, addresses.xStore);
  const xBounties = new web3.eth.Contract(XBounties.abi, addresses.bounties);
  const xToken = new web3.eth.Contract(XToken.abi, address);

  const [amount, setAmount] = useState("");

  const [willGive, setWillGive] = useState("");
  const [willReceive, setWillReceive] = useState("");

  const [allowance, setAllowance] = useState(null);
  const [doneRedeeming, setDoneRedeeming] = useState(false);
  const [amountReceived, setAmountReceived] = useState(null);

  const [txIsApproval, setTxIsApproval] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  useEffect(() => {
    fetchAllowance();
  }, [account]);

  useEffect(() => {
    const _rewardRate = web3.utils.fromWei(rewardRate);
    const _payoutCap = web3.utils.fromWei(payoutCap);
    const _paidOut = web3.utils.fromWei(paidOut);
    const _maxPayout = web3.utils.fromWei(maxPayout);
    const _amount = parseFloat(amount);
    const requestedNftx = _amount * parseFloat(_rewardRate);
    const remainingNftx = parseFloat(_payoutCap) - parseFloat(_paidOut);
    const _willReceive = Math.min(
      requestedNftx,
      remainingNftx,
      parseFloat(_maxPayout)
    );
    console.log("_willReceive", _willReceive);
    const _willGive =
      requestedNftx === 0
        ? 0
        : cleanNum((_willReceive / requestedNftx) * _amount, 5);
    console.log("_willGive", _willGive);
    setWillReceive(_willReceive);
    setWillGive(_willGive);
  }, [amount]);

  const fetchAllowance = () => {
    if (account)
      xToken.methods
        .allowance(account, addresses.bounties)
        .call({ from: account })
        .then((retVal) => setAllowance(retVal));
  };

  const cleanNum = (num, exp = 1) => {
    return Math.trunc(parseFloat(num) * Math.pow(10, exp)) / Math.pow(10, exp);
  };

  const handleFill = () => {
    setTxIsApproval(false);
    setTxHash(null);
    setTxReceipt(null);
    const _willGive = web3.utils.toWei(willGive.toString());
    const sendObj = { from: account };
    if (isEth()) {
      sendObj.value = _willGive;
    }
    xBounties.methods
      .fillBounty(bountyId, _willGive)
      .send(sendObj, (error, txHash) => {})
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        receipt.events["BountyFilled"] &&
          setAmountReceived(
            receipt.events["BountyFilled"].returnValues.nftxAmount
          );
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
      .approve(addresses.bounties, web3.utils.toWei(amount))
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

  const isEth = () => {
    return address === zeroAddress;
  };

  const isApproved = () => {
    return (
      isEth() ||
      (allowance &&
        !isNaN(parseFloat(willGive)) &&
        parseFloat(willGive) <= web3.utils.fromWei(allowance))
    );
  };

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
            margin-top: 2px;
            margin-bottom: 12px;
            & > div {
              background: rgba(53, 43, 78, 0.7);
              padding: 6px 8px 3px;
              border-radius: 3px;
              margin-bottom: 8px;
            }
          `}
        >
          <div>Will give: {!isNaN(willGive) && `${willGive} ${ticker}`}</div>
          <div>
            Will receive:{" "}
            {!isNaN(willReceive) && `${cleanNum(willReceive, 5)} NFTX`}
          </div>
        </div>
        <div
          css={`
            margin-top: 5px;
            margin-bottom: 10px;
          `}
        >
          {!isEth() &&
            (() =>
              isApproved() ? (
                <Button label={`Approved`} wide={true} disabled={true} />
              ) : (
                <Button
                  label={`Approve ${
                    !isNaN(parseFloat(willGive)) ? parseFloat(willGive) : ""
                  } ${ticker}`}
                  wide={true}
                  disabled={!willGive || !account}
                  onClick={handleApprove}
                />
              ))()}
        </div>

        <Button
          label={`Send ${
            !isNaN(parseFloat(willGive)) ? parseFloat(willGive) : ""
          } ${ticker}`}
          wide={true}
          disabled={!willGive || !account || !isApproved()}
          onClick={handleFill}
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
          {txIsApproval ? "Approval" : "Transaction"} in progress...
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
          Bounty filled successfully
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
          Received: {cleanNum(web3.utils.fromWei(amountReceived), 5)} NFTX
        </div>

        <a
          href={
            `https://client.aragon.org/#/nftx/` +
            `0x5566b3e5fc300a1b28c214b49a5950c34d00eb33` +
            `/vesting/${account}/`
          }
          target="_blank"
          css={`
            text-decoration: none;
          `}
        >
          <Button label="View Tokens" wide={true} />
        </a>
      </div>
    );
  }
}

export default FillBountyPanel;
