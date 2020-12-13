import blankDaoImage from "./images/blankdao.svg";
import rinkebyFunds from "../data/rinkebyD1Funds.json";

const TEMPLATE_D1 = "D1 Fund";

export const KnownFunds = {
  main: new Map(
    [
      {
        address: "0x67757a18eda83125270ef94dcec7658eb39bd8a5",
        domain: "",
        name: "Rest-Main",
        image: blankDaoImage,
        recommended: true,
        template: TEMPLATE_D1,
      },
    ].map((fund) => [fund.address.toLowerCase(), fund])
  ),
  rinkeby: new Map(
    rinkebyFunds
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
