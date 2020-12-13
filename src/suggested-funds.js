import { useMemo } from "react";
import { useFavoriteFunds } from "./contexts/FavoriteFundsContext";
import { getRecommendedFunds } from "./known-funds";
import { network } from "./environment";

const RECOMMENDED_FUNDS = getRecommendedFunds(network.type);

export function useSuggestedFunds(maxSuggestions = 6) {
  const { favoriteFunds } = useFavoriteFunds();

  const suggestedFunds = useMemo(() => {
    const funds = new Map(
      [...favoriteFunds].map((fund) => [fund.vaultId, fund])
    );

    // Keep filling with recommended orgs until we reach the max
    RECOMMENDED_FUNDS.forEach((fund) => {
      const { vaultId } = fund;
      if (funds.size < maxSuggestions && !funds.has(vaultId)) {
        funds.set(vaultId, fund);
      }
    });
    return [...funds.values()].sort((fund, fund2) => {
      const { vaultId } = fund;
      const { vaultId: vaultId2 } = fund2;
      return vaultId > vaultId2 ? 1 : -1;
    });
  }, [favoriteFunds, maxSuggestions]);

  return suggestedFunds;
}
