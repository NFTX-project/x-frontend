import { useMemo } from "react";
import { useFavoriteFunds } from "./contexts/FavoriteFundsContext";
import { getRecommendedFunds } from "./known-funds";
import { network } from "./environment";

const RECOMMENDED_FUNDS = getRecommendedFunds(network.type);

export function useSuggestedFunds(maxSuggestions = 6) {
  const { favoriteFunds } = useFavoriteFunds();

  const suggestedFunds = useMemo(() => {
    const funds = new Map(
      [...favoriteFunds].map((org) => [org.address.toLowerCase(), org])
    );

    // Keep filling with recommended orgs until we reach the max
    RECOMMENDED_FUNDS.forEach((fund) => {
      const fundAddress = fund.address.toLowerCase();
      if (funds.size < maxSuggestions && !funds.has(fundAddress)) {
        funds.set(fundAddress, fund);
      }
    });

    return [...funds.values()].sort((org, org2) => {
      const { address, name = "" } = org;
      const { address: address2, name: name2 = "" } = org2;
      return name.localeCompare(name2) || address > address2 ? 1 : -1;
    });
  }, [favoriteFunds, maxSuggestions]);

  return suggestedFunds;
}
