import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@aragon/ui";
import FavoritesMenuItem from "./FavoritesMenuItem";

function FavoritesMenu({ items, onActivate, onFavoriteUpdate, disabled }) {
  const theme = useTheme();
  return (
    <ul
      css={`
        margin: 0;
        padding: 0;
        list-style: none;
      `}
    >
      {items.map((item) => (
        <li
          key={item.vaultId}
          css={`
            & + & {
              border-top: 1px solid ${theme.border};
            }
          `}
        >
          <FavoritesMenuItem
            favorited={item.favorited}
            vaultId={item.vaultId}
            image={item.image}
            onActivate={onActivate}
            onFavoriteUpdate={onFavoriteUpdate}
            secondary={item.secondary}
            disabled={disabled}
            address={item.address}
            ticker={item.ticker}
          />
        </li>
      ))}
    </ul>
  );
}

FavoritesMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      favorited: PropTypes.bool,
      vaultId: PropTypes.number,
      image: PropTypes.node,
      secondary: PropTypes.node,
    }).isRequired
  ),

  // when the favorited status of an item changes
  onFavoriteUpdate: PropTypes.func.isRequired,

  // when the item itself gets clicked
  onActivate: PropTypes.func.isRequired,

  disabled: PropTypes.bool,
};

export default FavoritesMenu;
