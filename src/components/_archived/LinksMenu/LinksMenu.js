import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@aragon/ui";
import LinksMenuItem from "./LinksMenuItem";

function LinksMenu({ items, onActivate }) {
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
          key={item.id}
          css={`
            & + & {
              border-top: 1px solid ${theme.border};
            }
          `}
        >
          <LinksMenuItem
            id={item.id}
            image={item.image}
            name={item.name}
            onActivate={onActivate}
            secondary={item.secondary}
          />
        </li>
      ))}
    </ul>
  );
}

LinksMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      image: PropTypes.node,
      name: PropTypes.node,
      secondary: PropTypes.node,
    }).isRequired
  ),
  // when the item itself gets clicked
  onActivate: PropTypes.func.isRequired,
};

export default LinksMenu;
