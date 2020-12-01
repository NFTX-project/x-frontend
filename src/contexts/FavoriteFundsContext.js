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
      .filter((fund) => fund && fund.address)
      .map((fund) => ({
        ticker: fund.ticker || "",
        address: fund.address,
        vaultId: fund.vaultId,
      })),
    (fund) => fund.address.toLowerCase()
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

  addFavorite = (fund) => {
    const fundIndex = this.state.favoriteFunds.findIndex(({ address }) =>
      addressesEqual(address, fund.address)
    );
    if (fundIndex === -1) {
      this.setState({
        favoriteFunds: storedList.add({
          ticker: fund.ticker,
          address: fund.address,
          vaultId: fund.vaultId,
        }),
      });
    }
  };

  removeFavoriteByAddress = (addr) => {
    const fundIndex = this.state.favoriteFunds.findIndex(({ address }) =>
      addressesEqual(address, addr)
    );
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
          removeFavoriteByAddress: this.removeFavoriteByAddress,
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
