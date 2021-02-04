import React, { useRef, useState, useEffect } from "react";
import { DataView } from "@aragon/ui";
import Web3 from "web3";
import { useWallet } from "use-wallet";
import HashField from "../HashField/HashField";
import XStore from "../../contracts/XStore.json";
import addresses from "../../addresses/mainnet.json";

function XStoreEvents() {
  const { account } = useWallet();
  const injected = window.ethereum;
  const provider =
    injected && injected.chainId === "0x1"
      ? injected
      : `wss://eth-mainnet.ws.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`;

  const { current: web3 } = useRef(new Web3(provider));
  const xStore = new web3.eth.Contract(XStore.abi, addresses.xStore);

  const [events, setEvents] = useState([]);
  // const [eventTimes, setEventTimes] = useState([]);

  useEffect(() => {
    xStore
      .getPastEvents("allEvents", { fromBlock: 7664346, toBlock: "latest" })
      .then((result) => {
        if (result.length > 25) {
          const _events = result
            .slice(result.length - 25, result.length)
            .reverse();
          setEvents(_events);
        } else {
          const _events = result
            .reverse()
            .slice(0, Math.min(25, result.length));
          setEvents(_events);
        }
      });
  }, []);

  return (
    <div>
      <DataView
        status="loading"
        fields={["Name", "Tx Hash", "Block #", ""]}
        entries={events}
        entriesPerPage={5}
        renderEntry={({ event, blockNumber, transactionHash }) => {
          return [
            <div>{event}</div>,
            <HashField hash={transactionHash} />,
            <div>{blockNumber}</div>,
          ];
        }}
      />
    </div>
  );
}

export default XStoreEvents;
