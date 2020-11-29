import React, { useContext } from "react";
import uniqby from "lodash.uniqby";
import PropTypes from "prop-types";
import { network } from "../environment";
import StoredList from "../StoredList";
import { addressesEqual } from "../web3-utils";

const FavoriteNFTsContext = React.createContext();

const storedList = new StoredList(`favorite-nfts:${network.type}`);

const filterFavoritesNFTs = (nfts) =>
  uniqby(
    nfts
      .filter((nft) => nft && nft.address)
      .map((nft) => ({
        name: nft.name || "",
        address: nft.address,
      })),
    (nft) => nft.address.toLowerCase()
  );

class FavoriteNFTsProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    favoriteNFTs: filterFavoritesNFTs(storedList.loadItems()),
  };

  add = (nft) => {
    this.setState({
      favoriteNFTs: storedList.add(nft),
    });
  };

  remove = (index) => {
    this.setState({
      favoriteNFTs: storedList.remove(index),
    });
  };

  isAddressFavorited = (address) => {
    return (
      this.state.favoriteNFTs.findIndex((nft) =>
        addressesEqual(nft.address, address)
      ) > -1
    );
  };

  addFavorite = (nft) => {
    const nftIndex = this.state.favoriteNFTs.findIndex(({ address }) =>
      addressesEqual(address, nft.address)
    );
    if (nftIndex === -1) {
      this.setState({
        favoriteNFTs: storedList.add({
          name: nft.name,
          address: nft.address,
        }),
      });
    }
  };

  removeFavoriteByAddress = (addr) => {
    const nftIndex = this.state.favoriteNFTs.findIndex(({ address }) =>
      addressesEqual(address, addr)
    );
    if (nftIndex > -1) {
      const favs = storedList.remove(nftIndex);
      this.setState({
        favoriteNFTs: favs,
      });
    }
  };

  updateFavoriteNFTs = (favoriteNFTs) => {
    this.setState({
      favoriteNFTs: storedList.update(favoriteNFTs),
    });
  };

  render() {
    const { children } = this.props;
    const { favoriteNFTs } = this.state;
    return (
      <FavoriteNFTsContext.Provider
        value={{
          favoriteNFTs,
          addFavorite: this.addFavorite,
          isAddressFavorited: this.isAddressFavorited,
          removeFavoriteByAddress: this.removeFavoriteByAddress,
          updateFavoriteNFTs: this.updateFavoriteNFTs,
        }}
      >
        {children}
      </FavoriteNFTsContext.Provider>
    );
  }
}

function useFavoriteNFTs() {
  return useContext(FavoriteNFTsContext);
}

const FavoriteNFTsConsumer = FavoriteNFTsContext.Consumer;

export { FavoriteNFTsProvider, FavoriteNFTsConsumer, useFavoriteNFTs };
