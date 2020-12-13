import React from "react";
import { ButtonBase, GU, useTheme, textStyle } from "@aragon/ui";

function FavoritesMenuItemButton({ disabled, ...props }) {
  const theme = useTheme();
  return (
    <ButtonBase
      css={`
        display: flex;
        align-items: center;
        height: ${7 * GU}px;
        padding: 0 ${1.5 * GU}px;
        background: ${theme.surface};
        ${textStyle("body2")}
        color: ${theme.tagIdentifierContent};
        border-radius: 0;
        ${disabled ? "cursor: default;" : ""}
        &:active {
          ${disabled ? "" : `background: ${theme.surfacePressed};`}
        }
      `}
      {...props}
    />
  );
}

export default FavoritesMenuItemButton;
