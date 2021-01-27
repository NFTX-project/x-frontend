import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Box } from "@aragon/ui";
import FavoritesMenu from "./FavoritesMenu/FavoritesMenu";
import FundIcon from "../../FundIcon/FundIcon";
import { useFavoriteFunds } from "../../../contexts/FavoriteFundsContext";
import { network } from "../../../environment";
import { getKnownFunds } from "../../../known-funds";
import { addressesEqual } from "../../../web3-utils";

function Suggestions({ suggestedFunds }) {
  const {
    isAddressFavorited,
    removeFavoriteByVaultId,
    addFavorite,
  } = useFavoriteFunds();

  const updateFavorite = useCallback(
    (vaultId, address, ticker, favorite) => {
      if (favorite) {
        addFavorite({ vaultId, address, ticker });
      } else {
        removeFavoriteByVaultId(vaultId);
      }
    },
    [addFavorite, removeFavoriteByVaultId, suggestedFunds]
  );

  const goToFund = (vaultId) => {
    window.location.hash = `/fund/${vaultId}`;
  };

  const openOrg = useCallback(
    (address) => {
      const org = suggestedFunds.find((org) =>
        addressesEqual(org.address, address)
      );
      window.location.hash = `/${(org && org.name) || address}`;
    },
    [suggestedFunds]
  );

  if (suggestedFunds.length === 0) {
    return null;
  }

  return (
    <Box heading="Popular Funds" padding={0}>
      <FavoritesMenu
        items={suggestedFunds.map((fund) => {
          const knownOrg = getKnownFunds(network.type, fund.address);
          return {
            favorited: isAddressFavorited(fund.address),
            vaultId: fund.vaultId,
            image: <FundIcon fundAddress={fund.address} />,
            name: knownOrg ? knownOrg.ticker : fund.name || fund.address,
            secondary: knownOrg ? knownOrg.template : "",
            ticker: fund.ticker,
            address: fund.address,
          };
        })}
        onActivate={goToFund}
        onFavoriteUpdate={updateFavorite}
        disabled={false}
      />
    </Box>
  );
}

Suggestions.propTypes = {
  suggestedFunds: PropTypes.array.isRequired,
};

export default Suggestions;
