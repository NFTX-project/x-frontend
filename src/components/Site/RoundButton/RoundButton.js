import React from "react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useTheme, Tag } from "@aragon/ui";

function RoundButton({ text, link }) {
  const location = useLocation();

  const theme = useTheme();
  const button = (
    <Tag
      mode="new"
      css={`
        margin: 0 26px;
        transform: scale(1.5);
        color: white;
        background-color: ${theme.surface};
        font-size: 10px;
        color: ${theme.tagIdentifierContent} !important;
        border: ${location.pathname === link
          ? `0.8px solid ${theme.tagIdentifierContent}`
          : "none"};
      `}
    >
      {text}
    </Tag>
  );
  if (link) {
    return <Link to={link}>{button}</Link>;
  } else {
    return button;
  }
}

RoundButton.propTypes = {
  text: PropTypes.string,
  link: PropTypes.string,
};

export default RoundButton;
