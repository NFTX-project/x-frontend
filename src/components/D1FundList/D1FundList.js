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
} from "@aragon/ui";
import { useFavoriteFunds } from "../../contexts/FavoriteFundsContext";

import CreateErc20Panel from "../InnerPanels/CreateErc20Panel";
import CreateFundPanel from "../InnerPanels/CreateFundPanel";

import Web3 from "web3";

import FundsList from "../FundsList/FundsList";

function D1FundList({ fundsData, balances }) {
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
      : "wss://eth-mainnet.ws.alchemyapi.io/v2/fL1uiXELcu8QeuLAxoCNmnbf_XuVlHBD";

  const { current: web3 } = useRef(new Web3(provider));

  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const handleClickCreate = () => {
    setPanelTitle("Create a D1 Fund (Step 1/2)");
    setInnerPanel(
      <CreateErc20Panel
        onContinue={(tokenAddress, tokenSymbol) => {
          setPanelOpened(false);
          setTimeout(() => {
            setPanelTitle("Create a D1 Fund (Step 2/2)");
            setInnerPanel(
              <CreateFundPanel
                tokenAddress={tokenAddress}
                onContinue={(vaultId) => {
                  addFavorite({
                    ticker: tokenSymbol,
                    address: tokenAddress,
                    vaultId: vaultId,
                  });
                  setPanelOpened(false);
                  setTimeout(() => {
                    window.location.hash = `/fund/${vaultId}`;
                  }, 400);
                }}
              />
            );
            setPanelOpened(true);
          }, 500);
        }}
      />
    );
    setPanelOpened(true);
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
          <Button label="Create D1 Fund" onClick={handleClickCreate} />
        }
      />
      <FundsList
        fundsListData={(fundsData || []).filter(
          (elem) =>
            !elem.isD2Vault &&
            (elem.verified || isVaultIdFavorited(elem.vaultId))
        )}
        balances={balances}
      />
      <SidePanel
        title={panelTitle}
        opened={panelOpened}
        onClose={() => setPanelOpened(false)}
      >
        {innerPanel}
      </SidePanel>
    </div>
  );
}

export default D1FundList;
