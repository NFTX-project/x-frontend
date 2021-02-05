import React, { useCallback, useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { BREAKPOINTS, useTheme, IconExternal } from "@aragon/ui";
import { useWallet } from "use-wallet";
import throttle from "lodash.throttle";
import axios from "axios";

import TopBar from "../TopBar/TopBar";
import Welcome from "../Welcome/Welcome";
import RoundButton from "./RoundButton/RoundButton";
import Landing from "../Landing/Landing";
import FundsIndex from "../FundsIndex/FundsIndex";
import D1FundList from "../D1FundList/D1FundList";
import Backend from "../Backend/Backend";
import FundView from "../FundView/FundView";
import Bounties from "../Bounties/Bounties";
import Tutorial from "../Tutorial/Tutorial";
import fundInfo from "../../data/fundInfo.json";

function Site({ selectorNetworks }) {
  const theme = useTheme();
  const { account } = useWallet();

  const [solidTopBar, setSolidTopBar] = useState(false);

  const updateSolidScrollBar = useCallback(
    throttle((solid) => {
      setSolidTopBar(solid);
    }, 50),
    []
  );

  const handleScroll = useCallback(
    (event) => {
      updateSolidScrollBar(event.target.scrollTop > 0);
    },
    [updateSolidScrollBar]
  );

  const [eventsCount, setEventsCount] = useState(null);
  const [fundsData, setFundsData] = useState(null);

  const [balances, setBalances] = useState(null);

  const [selections, setSelections] = useState([2, 2]);

  const getSelection = (index) => selections[index];

  const setSelection = (index, value) => {
    const _selections = JSON.parse(JSON.stringify(selections));
    _selections[index] = value;
    setSelections(_selections);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchBalances = async () => {
    // console.log("fetching balances...");
    if (account) {
      const response = await axios({
        url: `https://api.covalenthq.com/v1/1/address/${account}/balances_v2/`,
        method: "get",
        auth: {
          username: "ckey_61fb094bfc714946b98607c7d06",
        },
      });
      console.log("response.data.data.items", response.data.data.items);
      setBalances(response.data.data.items);
    }
  };

  const fetchFundsData = async () => {
    // console.log("fetching funds data...");
    const cleanFundsData = (inputData) => {
      console.log("inputDaata", inputData);
      const data = inputData.map((elem) => {
        const _fundInfo = fundInfo.find(
          (fund) => fund.vaultId === elem.vaultId
        );
        elem.verified = _fundInfo && _fundInfo.verified;
        return elem;
      });
      data.sort((a, b) => a.vaultId - b.vaultId);
      const punkFemale = data[15];
      data.splice(15, 1);
      data.splice(1, 0, punkFemale);
      const punk = data[16];
      data.splice(16, 1);
      data.splice(0, 0, punk);
      /* const mask = data[20];
      data.splice(20, 1);
      data.splice(19, 0, mask); */
      return data;
    };
    const response = await axios({
      url: "https://nftx.herokuapp.com/funds-data",
      method: "get",
    });
    const _fundsData = cleanFundsData(response.data);
    setFundsData(_fundsData);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkAndFetchNewData = async () => {
    console.log("checking for new data...");
    if (eventsCount === null) {
      fetchFundsData();
      axios({
        url: "https://nftx.herokuapp.com/events-count",
        method: "get",
      }).then((response) => setEventsCount(response.data));
    } else {
      const response = await axios({
        url: "https://nftx.herokuapp.com/events-count",
        method: "get",
      });
      if (response.data !== eventsCount) {
        setEventsCount(response.data);
        fetchFundsData();
        fetchBalances();
      }
    }
  };

  // get balances data from CovalentHQ
  useEffect(() => {
    fetchBalances();
    console.log("TODO: get balance updates using websocket");
    // https://www.covalenthq.com/docs/api/#post-/v1/{chainId}/address/{address}/register/
    const interval = setInterval(async () => {
      fetchBalances();
    }, 20000);
    return () => clearInterval(interval);
  }, [account]);

  // keep checking for new fund data
  useEffect(() => {
    checkAndFetchNewData();
    const interval = setInterval(async () => {
      checkAndFetchNewData();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // check for balances

  return (
    <div css="position: relative; z-index: 1">
      <TopBar solid={solidTopBar} />
      <div
        onScroll={handleScroll}
        css={`
          position: relative;
          z-index: 1;
          background: ${theme.background};
          height: 100vh;
          min-width: ${BREAKPOINTS.min}px;
          overflow-y: auto;
        `}
      >
        <div
          css={`
            position: relative;
            z-index: 1;
            min-height: calc(100vh - 10px);
          `}
        >
          <Welcome />
          <div
            css={`
              display: flex;
              justify-content: center;
              transform: translateY(-24px);
            `}
          >
            <RoundButton text="Homepage" link="/" />
            <RoundButton text="Tutorial" link="/tutorial" />
            <a
              href="https://nftx.gitbook.io/nftx/"
              target="_blank"
              css={`
                text-decoration: none;
                margin: 0 10px;
              `}
            >
              <RoundButton
                text={
                  <div
                    css={`
                      position: relative;
                      padding-left: 1px;
                      padding-right: 26px;
                    `}
                  >
                    DOCS
                    <div
                      css={`
                        display: inline-block;
                        position: absolute;
                        right: -5px;
                        bottom: -5px;
                      `}
                    >
                      <IconExternal />
                    </div>
                  </div>
                }
              />
            </a>
          </div>
          <div
            css={`
              max-width: 950px;
              width: 80%;
              margin: auto;
              margin-bottom: 25px;
            `}
          >
            <Route path="/dashboard">
              <Landing selectorNetworks={selectorNetworks} />
            </Route>

            <Route path="/" exact>
              <FundsIndex
                fundsData={fundsData}
                balances={balances}
                getSelection={getSelection}
                setSelection={setSelection}
              />
            </Route>
            <Route path="/backend">
              <Backend />
            </Route>
            <Route path="/fund">
              <FundView fundsData={fundsData} balances={balances} />
            </Route>
            <Route path="/tutorial">
              <Tutorial />
            </Route>
            <Route path="/bounties">
              <Bounties />
            </Route>
            <Route path="/bounties"></Route>
          </div>
          <div
            className="footer-filler"
            css={`
              width: 100%;
              text-align: center;
              line-height: 5;
              opacity: 0;
              pointer-events: none;
            `}
          >
            filler
          </div>
          <div
            className="footer"
            css={`
              position: absolute;
              bottom: 0;
              width: 100%;
              font-size: 18px;
              text-align: center;
              line-height: 3.5;
              & > a {
                display: inline-block;
                padding: 0 18px;
                color: #d0ceff;
                opacity: 0.65;
                cursor: pointer;
                text-decoration: none;
                &:hover {
                  opacity: 0.9;
                }
              }
            `}
          >
            <a
              href="https://twitter.com/NFTX_"
              target="_blank"
              rel="noreferrer"
            >
              Twitter
            </a>
            <a
              href="https://github.com/NFTX-project"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a href="https://blog.nftx.org/" target="_blank" rel="noreferrer">
              Blog
            </a>
            <a
              href="https://discord.gg/hytQVM5ZxR"
              target="_blank"
              rel="noreferrer"
            >
              Discord
            </a>
            <a
              href="https://client.aragon.org/#/nftx/"
              target="_blank"
              rel="noreferrer"
            >
              Aragon
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Site;
