import React, { useRef, useState, useEffect } from "react";
import { DataView } from "@aragon/ui";
import Web3 from "web3";
import { useWallet } from "use-wallet";
import HashField from "../HashField/HashField";
import Nftx from "../../contracts/NFTX.json";
import addresses from "../../addresses/rinkeby.json";

function NftxEvents() {
  const { account } = useWallet();

  const { current: web3 } = useRef(new Web3(window.ethereum));
  const nftx = new web3.eth.Contract(Nftx.abi, addresses.nftxProxy);

  const [events, setEvents] = useState([]);
  // const [eventTimes, setEventTimes] = useState([]);

  useEffect(() => {
    nftx
      .getPastEvents("allEvents", { fromBlock: 7664346, toBlock: "latest" })
      .then((result) => {
        const _events = result.reverse().slice(0, Math.min(25, result.length));
        console.log("events", _events);
        setEvents(_events);
      });
  }, []);

  /* useEffect(() => {
    const acc = [];
    let count = { num: 0 };
    console.log("AAAAAAAAA");
    for (let i = 0; i < events.length; i++) {
      console.log("BBBB", i);
      const event = events[i];
      const prevAnswer = acc.find(
        (elem) => elem.blockNumber == event.blockNumber
      );
      web3.eth.getBlock(7664378).then(({ timestamp }) => {
        console.log("CCCCCC");
        acc[i] = timestamp + "000";
        count.num = count.num + 1;
        if (count.num === events.length) {
          setEventTimes(acc);
        }
      });
    }
  }, [events]); */

  return (
    <div>
      <DataView
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

export default NftxEvents;
