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
  
  
  // const [tokenId, setTokenId] = useState("");
  // const [recipient, setRecipient] = useState("");

  // const [txStatus, setTxStatus] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);
  const [txError, setTxError] = useState(null);

  const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);

  const getIsEligible = () => {
    
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
      </div>
      
    </div>
  );
}

export default ManageFundPanel;
