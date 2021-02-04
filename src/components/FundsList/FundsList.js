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
  Help,
} from "@aragon/ui";
import { useFavoriteFunds } from "../../contexts/FavoriteFundsContext";
import MintD1FundPanel from "../InnerPanels/MintD1FundPanel";
import MintD2FundPanel from "../InnerPanels/MintD2FundPanel";
import MintRequestPanel from "../InnerPanels/MintRequestPanel";
import RedeemD1FundPanel from "../InnerPanels/RedeemD1FundPanel";
import RedeemD2FundPanel from "../InnerPanels/RedeemD2FundPanel";
import CreateErc20Panel from "../InnerPanels/CreateErc20Panel";
import CreateFundPanel from "../InnerPanels/CreateFundPanel";
import ManageFundPanel from "../InnerPanels/ManageFundPanel";
import Web3 from "web3";
import Nftx from "../../contracts/NFTX.json";
import XStore from "../../contracts/XStore.json";
import XToken from "../../contracts/XToken.json";
import addresses from "../../addresses/mainnet.json";
import ApproveNftsPanel from "../InnerPanels/ApproveNftsPanel";
import Web3Utils from "web3-utils";
import fundInfo from "../../data/fundInfo.json";

function FundsList({ fundsListData, balances, hideInspectButton }) {
  console.log("balances3", balances);
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

  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const truncateDecimal = (inputStr) => {
    if (!inputStr.includes(".")) {
      return inputStr;
    } else {
      const arr = inputStr.split(".");
      if (arr[1].length > 2) {
        const shortStr = arr[1].substring(0, 2);
        if (shortStr === "00" && arr[0] === "0") {
          arr[1] = arr[1].substring(0, 3);
        } else {
          arr[1] = shortStr;
        }
      }
      return arr.join(".");
    }
  };

  const fundData = (vaultId) =>
    fundsListData.find((fund) => fund.vaultId === vaultId);

  const handleMint = (vaultId, ticker) => {
    if (!fundData(vaultId)) return;

    setPanelTitle(`${ticker} ▸ Mint`);
    if (fundData(vaultId).isD2Vault) {
      setInnerPanel(
        <MintD2FundPanel
          fundData={fundData(vaultId)}
          balances={balances}
          onContinue={() => {
            setPanelOpened(false);
          }}
        />
      );
    } else {
      setInnerPanel(
        <MintD1FundPanel
          fundData={fundData(vaultId)}
          balances={balances}
          onContinue={() => {
            setPanelOpened(false);
          }}
          allowMintRequests={fundData(vaultId).allowMintRequests}
          onMakeRequest={() => {
            setPanelOpened(false);
            setTimeout(() => {
              handleMintRequest(vaultId, ticker);
            }, 500);
          }}
        />
      );
    }

    setPanelOpened(true);
  };

  const handleMintRequest = (vaultId, ticker) => {
    if (!fundData(vaultId)) return;
    setPanelTitle(`${ticker} ▸ Request`);
    setInnerPanel(
      <MintRequestPanel
        fundData={fundData(vaultId)}
        onContinue={() => {
          setPanelOpened(false);
        }}
        onMintNow={() => {
          setPanelOpened(false);
          setTimeout(() => {
            handleMint(vaultId, ticker);
          }, 500);
        }}
      />
    );
    setPanelOpened(true);
  };

  const handleRedeem = (vaultId) => {
    const _fundData = fundData(vaultId);
    setPanelTitle(`${_fundData.fundToken.symbol} ▸ Redeem`);
    setInnerPanel();
    setInnerPanel(
      fundData(vaultId).isD2Vault ? (
        <RedeemD2FundPanel
          fundData={_fundData}
          balances={balances}
          onContinue={() => {
            setPanelOpened(false);
          }}
        />
      ) : (
        <RedeemD1FundPanel
          fundData={_fundData}
          balances={balances}
          onContinue={() => {
            setPanelOpened(false);
          }}
        />
      )
    );
    setPanelOpened(true);
  };

  const getFundInfo = (vaultId) => {
    return fundInfo.find((elem) => elem.vaultId === vaultId);
  };

  return (
    <div>
      <DataView
        status={fundsListData === null ? "loading" : "default"}
        fields={(() => {
          const fields = [
            "Ticker",
            "Price",
            "Supply",
            "Type",
            <div>
              <div
                css={`
                  display: inline-block;
                  position: relative;
                  cursor: default;
                `}
              >
                {"Fin / Ver / AMM"}
                <div
                  css={`
                    position: absolute;
                    top: 0;
                    right: -22px;
                }
                  `}
                >
                  <Help hint="What are Ethereum addresses made of?">
                    <p>FIN = Finalized</p>
                    <p>VER = Verified</p>
                    <p>AMM = Swappable via an AMM</p>
                  </Help>
                </div>
              </div>
            </div>,
            "",
          ];
          if (account && balances) {
            fields.splice(5, 0, "Bal");
          }
          return fields;
        })()}
        entries={fundsListData || []}
        entriesPerPage={20}
        renderEntry={(entry) => {
          const { vaultId, fundToken, isFinalized } = entry;
          const fundSymbol = fundToken.symbol;
          const fundAddress = entry.fundToken.address;
          const cells = [
            hideInspectButton ? (
              <div>{fundSymbol}</div>
            ) : (
              <Link
                css={`
                  text-decoration: none;
                `}
                to={`fund/${vaultId}`}
              >
                {fundSymbol}
              </Link>
            ),
            <div>TBD</div>,
            <div>
              {truncateDecimal(web3.utils.fromWei(fundToken.totalSupply))}
            </div>,
            <div>{entry.isD2Vault ? "D2" : "D1"}</div>,
            <div>
              <div
                css={`
                  transform: translateX(-4px);
                  & > svg {
                    margin: 0 2px;
                  }
                `}
              >
                {isFinalized ? <IconCircleCheck /> : <IconCircleMinus />}{" "}
                {getFundInfo(vaultId).verified ? (
                  <IconCircleCheck />
                ) : (
                  <IconCircleMinus />
                )}{" "}
                {getFundInfo(vaultId).amm ? (
                  <IconCircleCheck />
                ) : (
                  <IconCircleMinus />
                )}{" "}
              </div>
            </div>,
            <div
              css={`
                & > svg {
                }
                cursor: pointer;
                padding: 5px;
              `}
              onClick={() =>
                isVaultIdFavorited(vaultId)
                  ? removeFavoriteByVaultId(vaultId)
                  : addFavorite({
                      vaultId: vaultId,
                      ticker: fundSymbol,
                      address: fundAddress,
                    })
              }
            >
              {isVaultIdFavorited(vaultId) ? <IconStarFilled /> : <IconStar />}
            </div>,
          ];
          if (account && balances) {
            let _balance = balances.find(
              (elem) =>
                elem.contract_address.toLowerCase() ===
                entry.fundToken.address.toLowerCase()
            );

            cells.splice(
              5,
              0,
              <div>
                {_balance
                  ? truncateDecimal(web3.utils.fromWei(_balance.balance))
                  : "0"}
              </div>
            );
          }
          return cells;
        }}
        renderEntryActions={(entry, index) => {
          const {
            vaultId,
            fundToken,
            flipEligOnRedeem,
            allowMintRequests,
          } = entry;
          const fundSymbol = fundToken.symbol;
          const fundAddress = entry.fundToken.address;
          return (
            <ContextMenu>
              <ContextMenuItem
                onClick={() => {
                  if (flipEligOnRedeem) {
                    handleMintRequest(vaultId, fundSymbol);
                  } else {
                    handleMint(vaultId, fundSymbol);
                  }
                }}
                css={account ? `` : `cursor: default; opacity: 0.3;`}
              >
                {(flipEligOnRedeem
                  ? "Mint Request"
                  : allowMintRequests
                  ? "Mint / Request"
                  : "") || "Mint"}
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => handleRedeem(vaultId, fundSymbol, fundAddress)}
                css={account ? `` : `cursor: default; opacity: 0.3;`}
              >
                Redeem
              </ContextMenuItem>
              {!hideInspectButton && (
                <ContextMenuItem
                  onClick={() => history.push(`/fund/${vaultId}`)}
                >
                  Inspect...
                </ContextMenuItem>
              )}
            </ContextMenu>
          );
        }}
      />
      <SidePanel
        title={panelTitle}
        opened={panelOpened}
        onClose={() => setPanelOpened(false)}
      >
        {account ? (
          innerPanel
        ) : (
          <div
            css={`
              margin-top: 15px;
            `}
          >
            <Info mode="error">You must connect your wallet first</Info>
            <Button
              label={"Return to page"}
              wide={true}
              onClick={() => setPanelOpened(false)}
              css={`
                margin-top: 10px;
              `}
            />
          </div>
        )}
      </SidePanel>
    </div>
  );
}

export const NftType = PropTypes.shape({
  name: PropTypes.string,
  supply: PropTypes.string,
  address: PropTypes.string,
});

FundsList.propTypes = {
  title: PropTypes.string,
  entries: PropTypes.arrayOf(NftType),
  handleMint: PropTypes.func,
};

export default FundsList;
