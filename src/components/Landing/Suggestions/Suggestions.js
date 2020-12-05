import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Box } from "@aragon/ui";
import FavoritesMenu from "../../FavoritesMenu/FavoritesMenu";
import FundIcon from "../../FundIcon/FundIcon";
import { useFavoriteFunds } from "../../../contexts/FavoriteFundsContext";
import { network } from "../../../environment";
import { getKnownFunds } from "../../../known-funds";
import { addressesEqual } from "../../../web3-utils";

function Suggestions({ suggestedFunds }) {
  const {
    isAddressFavorited,
    removeFavoriteByAddress,
    addFavorite,
  } = useFavoriteFunds();

  const updateFavorite = useCallback(
    (address, favorite) => {
      const org = suggestedFunds.find((org) =>
        addressesEqual(org.address, address)
      );

      // Can’t find the org
      if (!org) {
        return;
      }

      if (favorite) {
        addFavorite(org);
      } else {
        removeFavoriteByAddress(org.address);
      }
    },
    [addFavorite, removeFavoriteByAddress, suggestedFunds]
  );

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
            id: fund.address,
            image: <FundIcon fundAddress={fund.address} />,
            name: knownOrg ? knownOrg.name : fund.name || fund.address,
            secondary: knownOrg ? knownOrg.template : "",
          };
        })}
        onActivate={openOrg}
        onFavoriteUpdate={updateFavorite}
      />
    </Box>
  );
}

Suggestions.propTypes = {
  suggestedOrgs: PropTypes.array.isRequired,
};

export default Suggestions;
