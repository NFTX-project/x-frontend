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
