// List of configurable settings
const APP_LOCATOR = "APP_LOCATOR";
const CLIENT_THEME = "THEME";
const DEFAULT_ETH_NODE = "DEFAULT_ETH_NODE";
const ENS_REGISTRY_ADDRESS = "ENS_REGISTRY_ADDRESS";
const ETH_NETWORK_TYPE = "ETH_NETWORK_TYPE";
const ETH_SUBSCRIPTION_EVENT_DELAY = "ETH_SUBSCRIPTION_EVENT_DELAY";
const IPFS_GATEWAY = "IPFS_GATEWAY";
const LOCAL_CHAIN_ID = "LOCAL_CHAIN_ID";
const PACKAGE_VERSION = "PACKAGE_VERSION";
const SELECTED_CURRENCY = "SELECTED_CURRENCY";
const SENTRY_DSN = "SENTRY_DSN";
const PORTIS_DAPP_ID = "PORTIS_DAPP_ID";
const FORTMATIC_API_KEY = "FORTMATIC_API_KEY";

// Parcel requires env vars to be declared statically.
const CONFIGURATION_VARS = [
  [
    APP_LOCATOR,
    process.env.NFTX_APP_LOCATOR,
    process.env.REACT_APP_ASSET_BRIDGE,
  ],
  [
    DEFAULT_ETH_NODE,
    process.env.NFTX_DEFAULT_ETH_NODE,
    process.env.REACT_APP_DEFAULT_ETH_NODE,
  ],
  [
    ENS_REGISTRY_ADDRESS,
    process.env.NFTX_ENS_REGISTRY_ADDRESS,
    process.env.REACT_APP_ENS_REGISTRY_ADDRESS,
  ],
  [
    ETH_NETWORK_TYPE,
    process.env.NFTX_ETH_NETWORK_TYPE,
    process.env.REACT_APP_ETH_NETWORK_TYPE,
  ],
  [
    ETH_SUBSCRIPTION_EVENT_DELAY,
    process.env.NFTX_ETH_SUBSCRIPTION_EVENT_DELAY,
    process.env.REACT_APP_ETH_SUBSCRIPTION_EVENT_DELAY,
  ],
  [
    IPFS_GATEWAY,
    process.env.NFTX_IPFS_GATEWAY,
    process.env.REACT_APP_IPFS_GATEWAY,
  ],
  [
    SELECTED_CURRENCY,
    process.env.NFTX_SELECTED_CURRENCY,
    process.env.REACT_APP_SELECTED_CURRENCY,
  ],
  [SENTRY_DSN, process.env.NFTX_SENTRY_DSN, process.env.REACT_APP_SENTRY_DSN],
  [
    PACKAGE_VERSION,
    process.env.NFTX_PACKAGE_VERSION,
    process.env.REACT_APP_PACKAGE_VERSION,
  ],
  [CLIENT_THEME, process.env.NFTX_CLIENT_THEME],
  [LOCAL_CHAIN_ID, process.env.LOCAL_CHAIN_ID],
  [FORTMATIC_API_KEY, process.env.NFTX_FORTMATIC_API_KEY],
  [PORTIS_DAPP_ID, process.env.NFTX_PORTIS_DAPP_ID],
].reduce(
  (acc, [option, envValue, envValueCompat]) => ({
    ...acc,
    [option]: {
      storageKey: `${option}_KEY`,
      envValue: envValue || envValueCompat || null,
    },
  }),
  {}
);

// Get a setting from localStorage
function getLocalStorageSetting(confKey) {
  return window.localStorage.getItem(CONFIGURATION_VARS[confKey].storageKey);
}

// Get a setting from the env vars
function getEnvSetting(confKey) {
  return CONFIGURATION_VARS[confKey].envValue;
}

// Get a local setting: from the local storage if available, or the env vars.
function getLocalSetting(confKey) {
  return getLocalStorageSetting(confKey) || getEnvSetting(confKey);
}

export function getLocalChainId() {
  // Default to 1337 as used by most local development environments.
  return getLocalSetting(LOCAL_CHAIN_ID) || 1337;
}

export function getDefaultEthNode() {
  // Let the network configuration handle node defaults
  return getLocalSetting(DEFAULT_ETH_NODE) || "";
}

export function getEnsRegistryAddress() {
  // Let the network configuration handle contract address defaults
  return getLocalSetting(ENS_REGISTRY_ADDRESS) || "";
}

export function getEthNetworkType() {
  return getLocalSetting(ETH_NETWORK_TYPE) || "main";
}

export function getIpfsGateway() {
  return (
    getLocalSetting(IPFS_GATEWAY) || "https://ipfs.eth.aragon.network/ipfs"
  );
}

export function getPortisDappId() {
  return getLocalSetting(PORTIS_DAPP_ID) || "";
}

export function getFortmaticApiKey() {
  return getLocalSetting(FORTMATIC_API_KEY) || "";
}
