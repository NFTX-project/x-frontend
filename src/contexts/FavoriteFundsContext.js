import React, { useContext } from "react";
import uniqby from "lodash.uniqby";
import PropTypes from "prop-types";
import { network } from "../environment";
import StoredList from "../StoredList";
import { addressesEqual } from "../web3-utils";

const FavoriteFundsContext = React.createContext();

const storedList = new StoredList(`favorite-funds:${network.type}`);

const filterFavoritesFunds = (funds) =>
  uniqby(
    funds
      .filter((fund) => fund && fund.vaultId)
      .map((fund) => ({
        ticker: fund.ticker,
        address: fund.address,
        vaultId: fund.vaultId,
      })),
    (fund) => fund.vaultId
  );

class FavoriteFundsProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    favoriteFunds: filterFavoritesFunds(storedList.loadItems()),
  };

  add = (fund) => {
    this.setState({
      favoriteFunds: storedList.add(fund),
    });
  };

  remove = (index) => {
    this.setState({
      favoriteFunds: storedList.remove(index),
    });
  };

  isAddressFavorited = (address) => {
    return (
      this.state.favoriteFunds.findIndex((fund) =>
        addressesEqual(fund.address, address)
      ) > -1
    );
  };

  isVaultIdFavorited = (vaultId) => {
    return (
      this.state.favoriteFunds.findIndex((fund) =>
        addressesEqual(fund.vaultId, vaultId)
      ) > -1
    );
  };

  addFavorite = ({ vaultId, address, ticker }) => {
    console.log("addFavorite", vaultId, address, ticker);
    const fundIndex = this.state.favoriteFunds.findIndex(
      ({ _vaultId }) => vaultId === _vaultId
    );
    if (fundIndex >= 0) {
      console.log("..already favorite");
    } else {
      console.log("not fav yet, all good..");
    }

    console.log("adding new favorite...", {
      ticker: ticker,
      address: address,
      vaultId: vaultId,
    });
    if (fundIndex === -1) {
      this.setState({
        favoriteFunds: storedList.add({
          ticker: ticker,
          address: address,
          vaultId: vaultId,
        }),
      });
    }
  };

  removeFavoriteByVaultId = (_vaultId) => {
    console.log("removeFavoriteByVaultId(..)", _vaultId);
    console.log("_vaultId", _vaultId);
    console.log("this.state.favoriteFunds", this.state.favoriteFunds);
    const fundIndex = this.state.favoriteFunds.findIndex(
      ({ vaultId }) => vaultId === _vaultId
    );
    console.log("fundIndex", fundIndex);
    if (fundIndex > -1) {
      const favs = storedList.remove(fundIndex);
      this.setState({
        favoriteFunds: favs,
      });
    }
  };

  updateFavoriteFunds = (favoriteFunds) => {
    this.setState({
      favoriteFunds: storedList.update(favoriteFunds),
    });
  };

  render() {
    const { children } = this.props;
    const { favoriteFunds } = this.state;
    return (
      <FavoriteFundsContext.Provider
        value={{
          favoriteFunds,
          addFavorite: this.addFavorite,
          isAddressFavorited: this.isAddressFavorited,
          removeFavoriteByVaultId: this.removeFavoriteByVaultId,
          updateFavoriteFunds: this.updateFavoriteFunds,
        }}
      >
        {children}
      </FavoriteFundsContext.Provider>
    );
  }
}

function useFavoriteFunds() {
  return useContext(FavoriteFundsContext);
}

const FavoriteFundsConsumer = FavoriteFundsContext.Consumer;

export { FavoriteFundsProvider, FavoriteFundsConsumer, useFavoriteFunds };
