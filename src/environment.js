import Web3 from "web3";
import { getDefaultEthNode, getEthNetworkType, getIpfsGateway } from "./local-settings";
import { getNetworkConfig } from "./network-config";

const networkType = getEthNetworkType();

const networkConfig = getNetworkConfig(networkType);
export const network = networkConfig.settings;
export const providers = networkConfig.providers;

export const defaultEthNode =
  getDefaultEthNode() || networkConfig.nodes.defaultEth;

export const web3Providers = {
  default: new Web3.providers.WebsocketProvider(defaultEthNode),
};

export const ipfsDefaultConf = {
  gateway: getIpfsGateway(),
}