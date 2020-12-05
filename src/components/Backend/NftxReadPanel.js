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
import { useFavoriteNFTs } from "../../contexts/FavoriteNFTsContext";
import addresses from "../../addresses/rinkeby.json";

function ManageFundPanel() {
  const { account } = useWallet();

  // const { addFavorite } = useFavoriteNFTs();

  const { current: web3 } = useRef(new Web3(window.ethereum));

  const [vaultId, setVaultId] = useState("");
  const [nftId, setNftId] = useState("");
  const [isEligible, setIsEligible] = useState("");
  const [vaultId2, setVaultId2] = useState("");
  const [vaultSize, setVaultSize] = useState("");
  const [owner, setOwner] = useState("");
  const [store, setStore] = useState("");
  
  // const [tokenId, setTokenId] = useState("");
  // const [recipient, setRecipient] = useState("");

  // const [txStatus, setTxStatus] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);

  const getIsEligible = () => {
    nftx.methods
      .isEligible(vaultId, nftId)
      .call({from: account})
      .then(retVal => setIsEligible(retVal))
  };

  const getVaultSize = () => {
    nftx.methods
      .vaultSize(vaultId2)
      .call({from: account})
      .then(retVal => setVaultSize(retVal))
  };

  const getOwner = () => {
    nftx.methods
      .owner()
      .call({from: account})
      .then(retVal => setOwner(retVal))
  };

  const getStore = () => {
    nftx.methods
      .store()
      .call({from: account})
      .then(retVal => setStore(retVal))
  };

  

  return (
    <div
      css={`
        & > div {
          margin-top: 25px;
          margin-bottom: 10px;
        }
      `}
    >
      <div>
        <TextInput
          value={vaultId}
          onChange={(event) => setVaultId(event.target.value)}
          placeholder="vaultId (e.g. 6)"
          wide={true}
          css={`
            margin-bottom: 10px;
          `}
        />
        <TextInput
          value={nftId}
          onChange={(event) => setNftId(event.target.value)}
          placeholder="nftId (e.g. 42)"
          wide={true}
          css={`
            margin-bottom: 10px;
          `}
        />
        <Button
          label={"Get isEligibile"}
          wide={true}
          disabled={!account}
          onClick={getIsEligible}
          css={`
            margin-top: 5px;
            margin-bottom: 15px;
          `}
        />
        <TextInput
          value={isEligible}
          onChange={(event) => event.target.value === '' && setIsEligible('')}
          placeholder="isEligible (bool)"
          wide={true}
          css={`
            margin-bottom: 10px;
            cursor: not-allowed;
          `}
        />
      </div>
      <div>
        <TextInput
          value={vaultId2}
          onChange={(event) => setVaultId2(event.target.value)}
          placeholder="vaultId (e.g. 6)"
          wide={true}
          css={`
            margin-bottom: 10px;
          `}
        />
        <Button
          label={"Get vaultSize"}
          wide={true}
          disabled={!account}
          onClick={getVaultSize}
          css={`
            margin-top: 5px;
            margin-bottom: 15px;
          `}
        />
        <TextInput
          value={vaultSize}
          onChange={(event) => event.target.value === '' && setVaultSize('')}
          placeholder="vaultSize (uint256)"
          wide={true}
          css={`
            margin-bottom: 10px;
            cursor: not-allowed;
          `}
        />
      </div>
      <div>
        <Button
          label={"Get owner"}
          wide={true}
          disabled={!account}
          onClick={getOwner}
          css={`
            margin-bottom: 15px;
          `}
        />
        <TextInput
          value={owner}
          onChange={(event) => event.target.value === '' && setOwner('')}
          placeholder="owner (address)"
          wide={true}
          css={`
            margin-bottom: 10px;
            cursor: not-allowed;
          `}
        />
      </div>
      <div>
        <Button
          label={"Get store"}
          wide={true}
          disabled={!account}
          onClick={getStore}
          css={`
            margin-bottom: 15px;
          `}
        />
        <TextInput
          value={store}
          onChange={(event) => event.target.value === '' && setStore('')}
          placeholder="store (address)"
          wide={true}
          css={`
            margin-bottom: 10px;
            cursor: not-allowed;
          `}
        />
      </div>
    </div>
  );
}

export default ManageFundPanel;
