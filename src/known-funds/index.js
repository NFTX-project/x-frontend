import blankDaoImage from "./images/blankdao.svg";
import mainnetFunds from "../data/mainnetD1Funds.json";

const TEMPLATE_D1 = "D1 Fund";

export const KnownFunds = {
  main: new Map(
    mainnetFunds
      .map((entry) => {
        entry.name = entry.ticker;
        entry.recommended = true;
        entry.template = TEMPLATE_D1;
        return entry;
      })
      .map((fund) => [fund.address.toLowerCase(), fund])
  ),
};

// Get the organizations that might appear in the suggestions,
// using the format `{ address, name }` where name is the ENS domain.
export const getRecommendedFunds = (networkType, max = -1) => {
  if (!KnownFunds[networkType]) {
    return [];
  }

  const recommended = [];
  for (const [address, fund] of KnownFunds[networkType]) {
    if (fund.recommended) {
      recommended.push({ address, ticker: fund.ticker, vaultId: fund.vaultId });
      if (recommended.length === max) {
        break;
      }
    }
  }

  return recommended;
};

export const getKnownFunds = (networkType, address) => {
  if (!KnownFunds[networkType]) return null;
  return KnownFunds[networkType].get(address) || null;
};
