import Web3 from "web3";

// Cache web3 instances used in the app
const web3Cache = new WeakMap();

/**
 * Get cached web3 instance
 * @param {Web3.Provider} provider Web3 provider
 * @returns {Web3} The web3 instance
 */
export function getWeb3(provider) {
  if (web3Cache.has(provider)) {
    return web3Cache.get(provider);
  }
  const web3 = new Web3(provider);
  web3Cache.set(provider, web3);
  return web3;
}

export async function getLatestBlockTimestamp(web3) {
  const { timestamp } = (await web3.eth.getBlock("latest")) || {};
  if (!timestamp) {
    throw new Error("Could not fetch the latest block timestamp");
  }
  return new Date(timestamp * 1000);
}

/**
 * Shorten an Ethereum address. `charsLength` allows to change the number of
 * characters on both sides of the ellipsis.
 *
 * Examples:
 *   shortenAddress('0x19731977931271')    // 0x1973…1271
 *   shortenAddress('0x19731977931271', 2) // 0x19…71
 *   shortenAddress('0x197319')            // 0x197319 (already short enough)
 *
 * @param {string} address The address to shorten
 * @param {number} [charsLength=4] The number of characters to change on both sides of the ellipsis
 * @returns {string} The shortened address
 */
export function shortenAddress(address, charsLength = 4) {
  const prefixLength = 2; // "0x"
  if (!address) {
    return "";
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address;
  }
  return (
    address.slice(0, charsLength + prefixLength) +
    "…" +
    address.slice(-charsLength)
  );
}
