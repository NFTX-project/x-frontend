import React, { useState, useRef, useEffect } from "react";
import {
  DropDown,
  TextInput,
  Button,
  AddressField,
  IconCheck,
  IconCircleCheck,
} from "@aragon/ui";
import Web3 from "web3";
import { useWallet } from "use-wallet";
import Nftx from "../../contracts/NFTX.json";
import XStore from "../../contracts/XStore.json";
import KittyCore from "../../contracts/KittyCore.json";
import IErc721 from "../../contracts/IERC721.json";
import Loader from "react-loader-spinner";
import HashField from "../HashField/HashField";
import { useFavoriteNFTs } from "../../contexts/FavoriteNFTsContext";
import addresses from "../../addresses/mainnet.json";

function MintD2FundPanel({
  vaultId,
  ticker,
  onContinue,
  onMakeRequest,
  allowMintRequests,
}) {
  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : "wss://eth-mainnet.ws.alchemyapi.io/v2/fL1uiXELcu8QeuLAxoCNmnbf_XuVlHBD";

  const { current: web3 } = useRef(new Web3(provider));
  const xStore = new web3.eth.Contract(XStore.abi, addresses.xStore);
  const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);

  const [tokenIds, setTokenIds] = useState("");
  const [tokenIdsArr, setTokenIdsArr] = useState([]);

  const [nftAddress, setNftAddress] = useState("");
  const [isApprovedForAll, setIsApprovedForAll] = useState(false);

  const [nftData, setNftData] = useState([]);
  const [nftEligData, setNftEligData] = useState([]);
  const [negateElig, setNegateElig] = useState(null);

  const [txIsApproval, setTxIsApproval] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  const [doneMinting, setDoneMinting] = useState(false);

  const isKittyAddr = (address) => {
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
  }, []);

  useEffect(() => {
    if (nftAddress && account) {
      fetchIsApprovedAll();
    }
  }, [nftAddress, account]);

  useEffect(() => {
    let arr = [...tokenIds.matchAll(/\d+/g)];
    var uniq = [...new Set(arr.map((str) => parseInt(str)))];
    setTokenIdsArr(uniq);
  }, [tokenIds]);

  useEffect(() => {
    updateNftOwnerData();
    updateNftEligData();
  }, [tokenIdsArr]);

  const fetchIsApprovedAll = () => {
    if (!isKittyAddr(nftAddress)) {
      const nft = new web3.eth.Contract(IErc721.abi, nftAddress);
      nft.methods
        .isApprovedForAll(account, addresses.nftxProxy)
        .call({ from: account })
        .then((retVal) => {
          setIsApprovedForAll(retVal);
        });
    }
  };

  const updateNftOwnerData = () => {
    if (tokenIdsArr.length > 0) {
      const nft = new web3.eth.Contract(IErc721.abi, nftAddress);
      const nftExistenceArr = [];
      const nftOwnershipArr = [];
      let count = 0;
      tokenIdsArr.forEach((tokenId, index) => {
        const finish = (retVal) => {
          nftExistenceArr[index] = retVal !== "DNE";
          nftOwnershipArr[index] = retVal === account;
          count += 1;
          if (count === tokenIdsArr.length) {
            fetchApproval(nftExistenceArr, nftOwnershipArr).then(
              (nftApprovalArr) => {
                const _nftData = nftExistenceArr.map((elem, _index) => ({
                  tokenId: tokenId,
                  existence: elem,
                  ownership: nftOwnershipArr[_index],
                  approval: nftApprovalArr[_index],
                }));
                setNftData(_nftData);
              }
            );
          }
        };
        nft.methods
          .ownerOf(tokenId)
          .call({ from: account })
          .then((retVal) => finish(retVal))
          .catch((error) => finish("DNE"));
      });
    } else {
      setNftData([]);
    }
  };

  const updateNftEligData = () => {
    if (tokenIdsArr.length > 0) {
      const nftEligArr = [];
      let count = 0;
      tokenIdsArr.forEach((tokenId, index) => {
        xStore.methods
          .isEligible(vaultId, tokenId)
          .call({ from: account })
          .then((retVal) => {
            nftEligArr[index] = retVal;
            count += 1;
            if (count === tokenIdsArr.length) {
              setNftEligData(nftEligArr);
            }
          });
      });
    }
  };

  const fetchApproval = (nftExistenceArr, nftOwnershipArr) =>
    new Promise((resolve, reject) => {
      if (nftOwnershipArr.length > 0) {
        const abi = isKittyAddr(nftAddress) ? KittyCore.abi : IErc721.abi;
        const nft = new web3.eth.Contract(abi, nftAddress);
        const newNftApprovalArr = [];
        let count = 0;
        tokenIdsArr.forEach((tokenId, index) => {
          const finish = (retVal) => {
            newNftApprovalArr[index] = retVal === addresses.nftxProxy;
            count += 1;
            if (count === nftOwnershipArr.length) {
              resolve(newNftApprovalArr);
            }
          };
          if (!nftExistenceArr[index] || !nftOwnershipArr[index]) {
            finish(false);
          } else if (isApprovedForAll) {
            finish(true);
          } else {
            if (isKittyAddr(nftAddress)) {
              nft.methods
                .kittyIndexToApproved(tokenId)
                .call({ from: account })
                .then((retVal) => {
                  finish(retVal);
                })
                .catch((error) => {
                  console.log("error", error);
                  finish(false);
                });
            } else {
              nft.methods
                .getApproved(tokenId)
                .call({ from: account })
                .then((retVal) => {
                  finish(retVal);
                })
                .catch((error) => {
                  console.log("error", error);
                  finish(false);
                });
            }
          }
        });
      }
    });

  const handleMint = () => {
    setTxIsApproval(false);
    setTxHash(null);
    setTxReceipt(null);
    const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);
    nftx.methods
      .mint(vaultId, tokenIdsArr, "0")
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

  const handleViewNFT = () => {
    onContinue();
  };

  const handleApprove = (tokenId) => {
    setTxHash(null);
    setTxReceipt(null);
    setTxIsApproval(true);
    const nft = new web3.eth.Contract(IErc721.abi, nftAddress);
    nft.methods
      .approve(addresses.nftxProxy, tokenId)
      .send({ from: account }, (error, txHash) => {})
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        fetchIsApprovedAll();
        setNftData([]);
        setTxReceipt(receipt);
        updateNftOwnerData();
        console.log(receipt);
      });
  };

  const handleSetApproveAll = (isApproved) => {
    setTxHash(null);
    setTxReceipt(null);
    setTxIsApproval(true);
    const nft = new web3.eth.Contract(IErc721.abi, nftAddress);
    nft.methods
      .setApprovalForAll(addresses.nftxProxy, isApproved)
      .send(
        {
          from: account,
        },
        (error, txHash) => {}
      )
      .on("error", (error) => setTxError(error))
      .on("transactionHash", (txHash) => setTxHash(txHash))
      .on("receipt", (receipt) => {
        fetchIsApprovedAll();
        setNftData([]);
        setTxReceipt(receipt);
        updateNftOwnerData();
        console.log(receipt);
      });
  };

  const approveOrUnapproveAllBtn = (
    <Button
      label={isApprovedForAll ? "Unapprove All" : "Approve All"}
      wide={true}
      disabled={!account}
      onClick={() => handleSetApproveAll(!isApprovedForAll)}
      css={`
        margin-top: 15px;
        bottom: 0;
        ${isApprovedForAll ||
        nftData.filter((elem) => elem.ownership && !elem.approval).length < 2
          ? "position: absolute;"
          : ""}
      `}
    />
  );

  if (!doneMinting && (!txHash || (txIsApproval && txReceipt))) {
    return (
      <div
        css={`
          margin-top: 20px;
          height: 100%;
          position: relative;
        `}
      >
        <TextInput
          value={tokenIds}
          onChange={(event) => setTokenIds(event.target.value)}
          placeholder="Token IDs (e.g. [7,42,88])"
          wide={true}
          css={`
            margin-bottom: 10px;
          `}
        />
        <Button
          label={`Mint ${
            nftData.length > 0 ? nftData.length + " " : ""
          }${ticker}`}
          wide={true}
          disabled={
            nftData.length === 0 ||
            nftData.filter(
              (elem) =>
                !elem.existence ||
                !elem.ownership ||
                (!elem.approval && !isApprovedForAll)
            ).length > 0
          }
          onClick={handleMint}
        />
        <div
          css={`
            margin-top: 15px;
          `}
        >
          {tokenIdsArr.map((tokenId, index) => (
            <div
              key={tokenId}
              css={`
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 60px;
                position: relative;
              `}
            >
              <div
                css={`
                  padding: 0 5px;
                `}
              >
                ID #{tokenId}
              </div>
              <div
                css={`
                  padding: 0 5px;
                `}
              >
                {(() => {
                  if (!nftData[index]) {
                    return "";
                  } else if (!nftData[index].existence) {
                    return "DNE";
                  } else if (
                    (nftEligData[index] === false && !negateElig) ||
                    (nftEligData[index] && negateElig)
                  ) {
                    if (allowMintRequests) {
                      return (
                        <Button label="Request Mint" onClick={onMakeRequest} />
                      );
                    } else {
                      return "Not eligible";
                    }
                  } else if (!nftData[index].ownership) {
                    return "Not owner";
                  } else if (!nftData[index].approval && !isApprovedForAll) {
                    return (
                      <Button
                        label="Approve Transfer"
                        onClick={() => handleApprove(tokenId)}
                      />
                    );
                  } else {
                    return <IconCircleCheck />;
                  }
                })()}
              </div>
              <div
                className="line"
                css={`
                  position: absolute;
                  bottom: 0;
                  width: 96%;
                  border-bottom: 1px dotted white;
                  margin-left: 2%;
                  opacity: 0.4;
                `}
              ></div>
            </div>
          ))}
        </div>
        {nftAddress && !isKittyAddr(nftAddress) && approveOrUnapproveAllBtn}
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
            : `${ticker} minted successfully`}

          <IconCheck
            css={`
              transform: translate(5px, 5px) scale(1.2);
              color: #5ac994;
            `}
          />
        </div>
        <Button label="Return to Page" wide={true} onClick={handleViewNFT} />
        {isApprovedForAll && approveOrUnapproveAllBtn}
      </div>
    );
  }
}

export default MintD2FundPanel;
