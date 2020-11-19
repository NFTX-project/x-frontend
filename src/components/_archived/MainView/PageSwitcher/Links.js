import React from "react";
import PropTypes from "prop-types";
import { IconPlus, GU, RADIUS, useTheme } from "@aragon/ui";
import LinksMenu from "../../LinksMenu/LinksMenu";
import LinksMenuItemButton from "../../LinksMenu/LinksMenuItemButton";
import PageIcon from "../../LinkIcon/LinkIcon";

function Links({ networkOptions, currentNetwork }) {
  const theme = useTheme();

  const handleGoHome = () => {
    window.location.hash = "";
  };

  const handleClickItem = (number) => {
    const network = [currentNetwork, ...networkOptions].find(
      (network) => network.number === number
    );
    window.location.hash = `/${(network && network.name) || ""}`;
  };

  const optionsWithImages = networkOptions.map((network) => ({
    ...network,
    image: <PageIcon networkId={network.id} />,
  }));

  // console.log("\n\n---", options);

  return (
    <section
      aria-label="Networks"
      css={`
        width: ${42 * GU}px;
      `}
    >
      <LinksMenu items={optionsWithImages} onActivate={handleClickItem} />
      <LinksMenuItemButton
        onClick={handleGoHome}
        css={`
          width: 100%;
          padding: 0 ${2 * GU}px;
          border-top: 1px solid ${theme.border};
        `}
      >
        <span
          css={`
            display: flex;
            align-items: center;
            margin-right: ${1 * GU}px;
            color: ${theme.accentContent};
            background: ${theme.accent};
            border-radius: ${RADIUS}px;
          `}
        >
          <IconPlus />
        </span>
        <span>Open another organization</span>
      </LinksMenuItemButton>
    </section>
  );
}

export default Links;
