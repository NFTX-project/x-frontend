import blankDaoImage from "./images/blankdao.svg";

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
    [
      {
        address: "0x67757a18eda83125270ef94dcec7658eb39bd8a5",
        domain: "",
        name: "PUNK-BASIC",
        image: null,
        recommended: true,
        template: TEMPLATE_D1,
      },
      {
        address: "0x62757a18eda83125270ef94dcec7651eb39bd8a5",
        domain: "",
        name: "PUNK-ZOMBIE",
        image: null,
        recommended: true,
        template: TEMPLATE_D1,
      },
      {
        address: "0x67752a18eda83125170ef94dcec7658eb39bd8a5",
        domain: "",
        name: "KITTY-GEN-0",
        image: null,
        recommended: true,
        template: TEMPLATE_D1,
      },
      {
        address: "0x67757a18eda83125270ef94dcec9658eb39bd8a5",
        domain: "",
        name: "AXIE-MYSTIC-1",
        image: null,
        recommended: true,
        template: TEMPLATE_D1,
      },
      {
        address: "0x67757a18eda83120270ef94dcec7658eb39bd8a5",
        domain: "",
        name: "AVASTAR-RANK-50",
        image: null,
        recommended: true,
        template: TEMPLATE_D1,
      },
      {
        address: "0x67757a18eda83120570ef94dcec7658eb39b78a5",
        domain: "",
        name: "GLYPH",
        image: null,
        recommended: true,
        template: TEMPLATE_D1,
      },
    ].map((fund) => [fund.address.toLowerCase(), fund])
  ),
};

// Get the organizations that might appear in the suggestions,
// using the format `{ address, name }` where name is the ENS domain.
export const getRecommendedFunds = (networkType, max = -1) => {
  if (!KnownFunds[networkType]) {
    return [];
  }

  const recommended = [];
  console.log(KnownFunds[networkType]);
  for (const [address, fund] of KnownFunds[networkType]) {
    if (fund.recommended) {
      recommended.push({ address, name: fund.domain });
      if (recommended.length === max) {
        break;
      }
    }
  }

  return recommended;
};

export const getKnownFunds = (networkType, address) => {
  if (!KnownFunds[networkType]) return null;
  return KnownFunds[networkType].get(address.toLowerCase()) || null;
};
