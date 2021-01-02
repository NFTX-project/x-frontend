import React, { useRef, useState, useEffect } from "react";
import { useWallet } from "use-wallet";
import Web3 from "web3";
import XBounties from "../../contracts/XBounties.json";
import {
  DataView,
  ContextMenu,
  ContextMenuItem,
  Header,
  Button,
  IconCoin,
  IconLock,
  IconTime,
  SidePanel,
  Info,
} from "@aragon/ui";
import FillBountyPanel from "../InnerPanels/FillBountyPanel";
import addresses from "../../addresses/mainnet.json";

function Bounties() {
  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : "wss://eth-mainnet.ws.alchemyapi.io/v2/fL1uiXELcu8QeuLAxoCNmnbf_XuVlHBD";

  const { current: web3 } = useRef(new Web3(provider));

  const xBounties = new web3.eth.Contract(XBounties.abi, addresses.bounties);

  const tickers = [
    "ETH",
    "ETH",
    "ETH",
    "PUNK-BASIC",
    "PUNK-FEMALE",
    "PUNK-ATTR-4",
    "PUNK-ATTR-5",
    "PUNK-ZOMBIE",
    "AXIE-ORIGIN",
    "AXIE-MYSTIC-1",
    "AXIE-MYSTIC-2",
    "KITTY-GEN-0",
    "KITTY-GEN-0-F",
    "KITTY-FOUNDER",
    "AVASTR-BASIC",
    "AVASTR-RANK-30",
    "AVASTR-RANK-60",
    "GLYPH",
    "JOY",
  ];

  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const [maxPayout, setMaxPayout] = useState("0");
  const [entries, setEntries] = useState([]);

  const updateMaxPayout = () => {
    xBounties.methods
      .getMaxPayout()
      .call({ from: account })
      .then((retVal) => {
        setMaxPayout(retVal);
      });
  };

  const updateBounties = () => {
    let count = { num: 0 };
    const bounties = [];
    for (let i = 0; i < tickers.length; i++) {
      xBounties.methods
        .getBountyInfo(i)
        .call({ from: account })
        .then((retVal) => {
          bounties[i] = {
            bountyId: i,
            ticker: tickers[i],
            address: retVal[0],
            rewardRate: retVal[1],
            paidOut: retVal[2],
            payoutCap: retVal[3],
          };
          count.num = count.num + 1;
          if (count.num === tickers.length) {
            // console.log("bounties", );
            setEntries(bounties);
          }
        });
    }
  };

  useEffect(() => {
    updateMaxPayout();
    const interval = setInterval(() => {
      updateMaxPayout();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      updateBounties();
    }, 500);
    const interval = setInterval(() => {
      updateBounties();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleClickFill = ({
    bountyId,
    ticker,
    address,
    rewardRate,
    payoutCap,
    paidOut,
  }) => {
    setPanelTitle(`Fill Bounty`);
    setInnerPanel(
      <FillBountyPanel
        bountyId={bountyId}
        ticker={ticker}
        address={address}
        rewardRate={rewardRate}
        payoutCap={payoutCap}
        paidOut={paidOut}
        maxPayout={maxPayout}
        onContinue={() => setPanelOpened(false)}
      />
    );
    setPanelOpened(true);
  };

  const cleanNum = (num, exp = 1) => {
    return Math.trunc(parseFloat(num) * Math.pow(10, exp)) / Math.pow(10, exp);
  };

  return (
    <div className="xtokens-wrapper" css={``}>
      <Header
        primary={"Bounties"}
        secondary={
          <div
            css={`
              font-size: 20px;
              color: #d1d0ff;
              padding-top: 2px;
              padding-right: 5px;
            `}
          >
            Current Cap:{" "}
            <span
              css={`
                color: #d1d0ff;
                padding-left: 2px;
              `}
            >
              {cleanNum(web3.utils.fromWei(maxPayout), 2)} NFTX
            </span>
            <div
              css={`
                display: inline-block;
                transform: translate(4px, 4px);
              `}
            >
              {(() => {
                if (
                  parseFloat(web3.utils.fromWei(maxPayout)) > 0 &&
                  parseFloat(web3.utils.fromWei(maxPayout)) < 50000
                ) {
                  return <IconTime size="medium" />;
                } else {
                  return <IconLock size="medium" />;
                }
              })()}
            </div>
          </div>
        }
      />
      <DataView
        status={"loading"}
        fields={[
          "Ticker",
          "Reward Rate",
          "Payout Cap",
          "PaidOut",
          "Remaining",
          "",
        ]}
        entries={entries}
        entriesPerPage={20}
        renderEntry={({ ticker, rewardRate, payoutCap, paidOut }) => {
          return [
            <div>{ticker}</div>,
            <div>{cleanNum(web3.utils.fromWei(rewardRate))}</div>,
            <div>{cleanNum(web3.utils.fromWei(payoutCap))}</div>,
            <div>{cleanNum(web3.utils.fromWei(paidOut))}</div>,
            <div>
              {cleanNum(
                web3.utils.fromWei(payoutCap) - web3.utils.fromWei(paidOut)
              )}
            </div>,
          ];
        }}
        renderEntryActions={(entry, index) => {
          return (
            <Button
              label="Fill"
              icon={<IconCoin />}
              size="small"
              onClick={() => handleClickFill(entry)}
              disabled={!account}
            />
          );
        }}
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

export default Bounties;
