import React, { useState, useRef, useEffect } from "react";
import {
  DropDown,
  TextInput,
  Button,
  AddressField,
  IconCheck,
  Info,
  IconExternal,
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
import balancerPools from "../../addresses/balancePools.json";

function RedeemD2FundPanel({ fundData, balances, onContinue }) {
  console.log("fundData", fundData);
  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : "wss://eth-mainnet.ws.alchemyapi.io/v2/fL1uiXELcu8QeuLAxoCNmnbf_XuVlHBD";

  const { current: web3 } = useRef(new Web3(provider));
  const xStore = new web3.eth.Contract(XStore.abi, addresses.xStore);
  const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);
  const xToken = new web3.eth.Contract(XToken.abi, fundData.fundToken.address);

  const [amount, setAmount] = useState("");

  const [allowance, setAllowance] = useState(null);
  const [doneRedeeming, setDoneRedeeming] = useState(false);
  const [amountRedeemed, setAmountRedeemed] = useState([]);
  // const [nftIdsArr, setNftIdsArr] = useState(null);

  const [txIsApproval, setTxIsApproval] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  const truncateDecimal = (inputStr, maxLength = 6) => {
    if (!inputStr.includes(".")) {
      return inputStr;
    } else {
      const arr = inputStr.split(".");
      if (arr[1].length > maxLength) {
        const shortStr = arr[1].substring(0, maxLength);
        arr[1] = shortStr;
      }
      return arr.join(".");
    }
  };

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
      .redeem(fundData.vaultId, web3.utils.toWei(amount))
      .send(
        {
          from: account,
        },
        (error, txHash) => {}
      )
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
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

  const isApproved = () => {
    return (
      allowance &&
      !isNaN(parseFloat(amount)) &&
      parseFloat(amount) <= web3.utils.fromWei(allowance)
    );
  };

  if (!doneRedeeming && (!txHash || (txIsApproval && txReceipt))) {
    return (
      <div
        css={`
          margin-top: 20px;
          height: 100%;
          position: relative;
        `}
      >
        <Info
          css={`
            margin-bottom: 15px;
          `}
        >
          {`Every 1 ${fundData.fundToken.symbol} can redeem 1000 `}
          {balancerPools[fundData.asset.address] ? (
            <a
              href={`https://pools.balancer.exchange/#/pool/${
                balancerPools[fundData.asset.address]
              }/`}
              target="_blank"
              css={`
                text-decoration: none;
                border-bottom: 1px solid;
              `}
            >
              {fundData.asset.symbol}{" "}
              <IconExternal
                css={`
                  position: absolute;
                  top: 12px;
                  transform: translateX(1px) scale(0.8);
                `}
              />
            </a>
          ) : (
            fundData.asset.symbol
          )}
        </Info>
        <TextInput
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Amount of PUNK to send (e.g. 0.24)"
          wide={true}
          css={`
            margin-bottom: 10px;
          `}
          adornment={
            <div
              css={`
                transform: translate(-8px, -3px);
                font-size: 14px;
                cursor: pointer;
              `}
              onClick={() => {
                const balanceData = balances.find((elem) => {
                  return (
                    elem.contract_address.toLowerCase() ===
                    fundData.fundToken.address.toLowerCase()
                  );
                });
                const _balance = (balanceData && balanceData.balance) || "0";
                setAmount(truncateDecimal(web3.utils.fromWei(_balance), 24));
              }}
            >
              MAX
            </div>
          }
          adornmentPosition="end"
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
                  !isNaN(parseFloat(amount)) ? parseFloat(amount) : ""
                } ${fundData.fundToken.symbol}`}
                wide={true}
                disabled={!amount || !account || parseFloat(amount) === 0}
                onClick={handleApprove}
              />
            ))()}
        </div>

        <Button
          label={`Redeem ${
            !isNaN(parseFloat(amount)) ? parseFloat(amount) * 1000 : ""
          } ${fundData.asset.symbol}`}
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
            margin-bottom: 25px;
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
        <Button label="Return To Page" wide={true} onClick={onContinue} />
      </div>
    );
  }
}

export default RedeemD2FundPanel;
