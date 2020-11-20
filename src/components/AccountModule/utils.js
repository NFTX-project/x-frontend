import { getNetworkByChainId } from "../../network-config";

export const MAX_PROVIDER_SYNC_DELAY = 30;
export const MILD_PROVIDER_SYNC_DELAY = 5;
export const OK_PROVIDER_SYNC_DELAY = 3;

export function normalizeNetworkName(chainId) {
  return getNetworkByChainId(chainId).settings.shortName;
}
