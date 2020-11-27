import Web3 from "web3";
import { InvalidNetworkType, InvalidURI, NoConnection } from "./errors";

// Cache web3 instances used in the app
const web3Cache = new WeakMap();

// Filter the value we get from getBalance() before passing it to BN.js.
// This is because passing some values to BN.js can lead to an infinite loop
// when .toString() is called. Returns "-1" when the value is invalid.
//
// See https://github.com/indutny/bn.js/issues/186
export function filterBalanceValue(value) {
  if (value === null) {
    return "-1";
  }
  if (typeof value === "object") {
    value = String(value);
  }
  if (typeof value === "string") {
    return /^[0-9]+$/.test(value) ? value : "-1";
  }
  return "-1";
}

/**
 * Check address equality without checksums
 * @param {string} first First address
 * @param {string} second Second address
 * @returns {boolean} Address equality
 */
export function addressesEqual(first, second) {
  first = first && first.toLowerCase();
  second = second && second.toLowerCase();
  return first === second;
}

const websocketRegex = /^wss?:\/\/.+/;

/**
 * Check if the ETH node at the given URI is compatible for the current environment
 * @param {string} uri URI of the ETH node.
 * @param {string} expectedNetworkType The expected network type of the ETH node.
 * @returns {Promise} Resolves if the ETH node is compatible, otherwise throws:
 *    - InvalidURI: URI given is not compatible (e.g. must be WebSockets)
 *    - InvalidNetworkType: ETH node connected to wrong network
 *    - NoConnection: Couldn't connect to URI
 */
export async function checkValidEthNode(uri, expectedNetworkType) {
  // Must be websocket connection
  if (!websocketRegex.test(uri)) {
    throw new InvalidURI("The URI must use the WebSocket protocol");
  }

  try {
    const web3 = new Web3(uri);
    const connectedNetworkType = await web3.eth.net.getNetworkType();
    if (web3.currentProvider.disconnect) {
      web3.currentProvider.disconnect();
    } else {
      // Older versions of web3's providers didn't expose a generic interface for disconnecting
      web3.currentProvider.connection.close();
    }

    if (connectedNetworkType !== expectedNetworkType) {
      throw new InvalidNetworkType();
    }
  } catch (err) {
    if (err instanceof InvalidNetworkType) {
      throw err;
    }
    throw new NoConnection();
  }

  return true;
}

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
