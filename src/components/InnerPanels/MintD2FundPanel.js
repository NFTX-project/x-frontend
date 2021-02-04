import React, { useState, useRef, useEffect } from "react";
import {
  DropDown,
  TextInput,
  Button,
  AddressField,
  IconCheck,
  IconCircleCheck,
  IconExternal,
  Info,
} from "@aragon/ui";
import Web3 from "web3";
import { useWallet } from "use-wallet";
import Nftx from "../../contracts/NFTX.json";
import XStore from "../../contracts/XStore.json";
import KittyCore from "../../contracts/KittyCore.json";
import IErc721 from "../../contracts/IERC721.json";
import IErc20 from "../../contracts/IERC20.json";
import Loader from "react-loader-spinner";
import HashField from "../HashField/HashField";
import { useFavoriteNFTs } from "../../contexts/FavoriteNFTsContext";
import addresses from "../../addresses/mainnet.json";
import balancerPools from "../../addresses/balancePools.json";
import bn from "bn.js";

function MintD2FundPanel({ fundData, balances, onContinue }) {
  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : `wss://eth-mainnet.ws.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`;

  const { current: web3 } = useRef(new Web3(provider));
  const xStore = new web3.eth.Contract(XStore.abi, addresses.xStore);
  const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);
  const bpt = new web3.eth.Contract(IErc20.abi, fundData.asset.address);

  // const [tokenIds, setTokenIds] = useState("");
  // const [tokenIdsArr, setTokenIdsArr] = useState([]);
  const [amount, setAmount] = useState("");

  // const [nftAddress, setNftAddress] = useState("");
  // const [isApprovedForAll, setIsApprovedForAll] = useState(false);

  // const [nftData, setNftData] = useState([]);
  // const [nftEligData, setNftEligData] = useState([]);
  // const [negateElig, setNegateElig] = useState(null);

  const [txIsApproval, setTxIsApproval] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  const [allowance, setAllowance] = useState(null);
  const [doneMinting, setDoneMinting] = useState(false);

  /* const truncateDecimal = (inputStr, maxLength = 6) => {
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
  }; */

  /* const isKittyAddr = (address) => {
    const kittyAddr = "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d";
    return address.toLowerCase() === kittyAddr.toLowerCase();
  };

  useEffect(() => {
    xStore.methods
      .nftAddress(vaultId)
      .call({ from: account })
      .then((retVal) => {
        setNftAddress(retVal);
        xStore.methods
          .negateEligibility(vaultId)
          .call({ from: account })
          .then((retVal) => setNegateElig(retVal));
      });
  }, []); */

  useEffect(() => {
    fetchAllowance();
  }, [account]);

  const fetchAllowance = () => {
    if (account)
      bpt.methods
        .allowance(account, addresses.nftxProxy)
        .call({ from: account })
        .then((retVal) => setAllowance(retVal));
  };

  const handleMint = () => {
    setTxIsApproval(false);
    setTxHash(null);
    setTxReceipt(null);
    window._bn = bn;
    window._amount = amount;
    const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);
    const numerator = new bn(web3.utils.toWei(amount));
    const denominator = new bn(1000);
    const _amountToMint = numerator.div(denominator).toString();
    console.log("_amountToMint", _amountToMint);
    nftx.methods
      .mint(fundData.vaultId, [], _amountToMint)
      .send(
        {
          from: account,
        },
        (error, txHash) => {}
      )
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        setDoneMinting(true);
        setTxReceipt(receipt);
        console.log(receipt);
      });
  };

  const handleApprove = () => {
    setTxHash(null);
    setTxReceipt(null);
    setTxIsApproval(true);
    const nft = new web3.eth.Contract(IErc721.abi, fundData.asset.address);
    nft.methods
      .approve(addresses.nftxProxy, web3.utils.toWei(amount))
      .send({ from: account }, (error, txHash) => {})
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        fetchAllowance();
        setTxReceipt(receipt);
        console.log(receipt);
      });
  };

  const isApproved = () => {
    return (
      allowance &&
      !isNaN(parseInt(amount)) &&
      parseInt(amount) <= web3.utils.fromWei(allowance)
    );
  };

  if (!doneMinting && (!txHash || (txIsApproval && txReceipt))) {
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
          {`Every 1 ${fundData.fundToken.symbol} requires 1000 `}
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
          /* placeholder="Token IDs (e.g. [7,42,88])" */
          placeholder="Amount of PUNK-CORE to send (e.g. 210.4)"
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
                    fundData.asset.address.toLowerCase()
                  );
                });
                const _balance = (balanceData && balanceData.balance) || "0";
                setAmount(web3.utils.fromWei(_balance));
                console.log("_balance", _balance);
                console.log(
                  "web3.utils.fromWei(_balance)",
                  web3.utils.fromWei(_balance)
                );
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
                } ${fundData.asset.symbol}`}
                wide={true}
                disabled={!amount || !account}
                onClick={handleApprove}
              />
            ))()}
        </div>
        <Button
          label={`Mint ${
            isNaN(parseFloat(amount)) ? "" : parseFloat(amount) / 1000 + " "
          }${fundData.fundToken.symbol}`}
          wide={true}
          disabled={isNaN(amount) || amount === "" || parseFloat(amount) === 0}
          onClick={handleMint}
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
          {txIsApproval ? "Approval" : "Minting"} in progress...
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
      <div
        css={`
          height: 100%;
          position: relative;
        `}
      >
        <div
          css={`
            margin-top: 28px;
            margin-bottom: 20px;
          `}
        >
          {txIsApproval
            ? "Unapproval was successful"
            : `${fundData.fundToken.symbol} minted successfully`}

          <IconCheck
            css={`
              transform: translate(5px, 5px) scale(1.2);
              color: #5ac994;
            `}
          />
        </div>
        <Button label="Return to Page" wide={true} onClick={onContinue} />
      </div>
    );
  }
}

export default MintD2FundPanel;
