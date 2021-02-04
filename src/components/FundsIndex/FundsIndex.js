import React, { useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useWallet } from "use-wallet";
import PropTypes from "prop-types";
import {
  DataView,
  ContextMenu,
  ContextMenuItem,
  Header,
  Button,
  AddressField,
  SidePanel,
  IconStarFilled,
  IconStar,
  IconCircleCheck,
  IconCircleMinus,
  FloatIndicator,
  Info,
  DropDown,
} from "@aragon/ui";
import { useFavoriteFunds } from "../../contexts/FavoriteFundsContext";

import CreateErc20Panel from "../InnerPanels/CreateErc20Panel";
import CreateFundPanel from "../InnerPanels/CreateFundPanel";

import Web3 from "web3";

import FundsList from "../FundsList/FundsList";

function FundsIndex({ fundsData, balances, getSelection, setSelection }) {
  const {
    isVaultIdFavorited,
    removeFavoriteByVaultId,
    addFavorite,
  } = useFavoriteFunds();
  const history = useHistory();
  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : `wss://eth-mainnet.ws.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`;

  const { current: web3 } = useRef(new Web3(provider));

  const featuredVaultIds = [16];

  const getVisibleFundsData = () => {
    if (!fundsData) return null;
    const _visibleFunds = fundsData
      .filter((elem) => {
        let visible1;
        let visible2;
        if (getSelection(0) === 0) {
          visible1 = featuredVaultIds.includes(elem.vaultId);
        } else if (getSelection(0) === 1) {
          visible1 = !featuredVaultIds.includes(elem.vaultId);
        } else {
          visible1 = true;
        }
        if (getSelection(1) === 0) {
          visible2 = !elem.isD2Vault;
        } else if (getSelection(1) === 1) {
          visible2 = elem.isD2Vault;
        } else {
          visible2 = true;
        }
        return visible1 && visible2;
      })
      .filter(
        (elem) =>
          /* (elem.verified && elem.isFinalized) || */
          elem.verified || isVaultIdFavorited(elem.vaultId)
      );
    return _visibleFunds;
  };

  return (
    <div
      css={`
        padding-bottom: 10px;
      `}
    >
      <Header
        primary="Funds"
        secondary={
          <div
            css={`
              button {
                border-color: #241246;
              }
            `}
          >
            <DropDown
              items={["Featured", "Not Featured", "Any"]}
              selected={getSelection(0)}
              onChange={(newIndex) => setSelection(0, newIndex)}
            />
            <DropDown
              items={["D1 Funds", "D2 Funds", "Any"]}
              selected={getSelection(1)}
              onChange={(newIndex) => setSelection(1, newIndex)}
              css={`
                margin-left: 15px;
              `}
            />
          </div>
        }
      />
      <FundsList fundsListData={getVisibleFundsData()} balances={balances} />
    </div>
  );
}

export default FundsIndex;
