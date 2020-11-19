import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { GU, textStyle, useTheme } from "@aragon/ui";
import LinksMenuItemButton from "./LinksMenuItemButton";

function LinksMenuItem({ id, image, name, secondary, onActivate }) {
  const theme = useTheme();

  const handleActivationClick = useCallback(() => {
    onActivate(id);
  }, [id, onActivate]);

  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <LinksMenuItemButton
        css={`
          display: flex;
          flex-grow: 1;
          padding: 0 ${2 * GU}px;
          min-width: 0;
        `}
        onClick={handleActivationClick}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            min-width: 0;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              margin-right: ${1 * GU}px;
            `}
          >
            {image}
          </div>
          <div
            css={`
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              min-width: 0;
              text-align: left;
            `}
          >
            <div
              css={`
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                color: ${theme.surfaceContent};
              `}
            >
              {name}
            </div>
            {secondary && (
              <div
                css={`
                  color: ${theme.surfaceContentSecondary};
                  ${textStyle("label2")}
                `}
              >
                {secondary}
              </div>
            )}
          </div>
        </div>
      </LinksMenuItemButton>
    </div>
  );
}

LinksMenuItem.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.node,
  name: PropTypes.string.isRequired,
  onActivate: PropTypes.func.isRequired,
  secondary: PropTypes.string,
};

export default LinksMenuItem;
