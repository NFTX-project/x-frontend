import React from "react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useTheme } from "@aragon/ui";

function RoundButton({ text, link }) {
  const location = useLocation();

  const theme = useTheme();
  const button = (
    <div
      css={`
        color: white;
        background-color: ${theme.surface};
        font-size: 15px;
        color: ${theme.tagIdentifierContent};
        text-transform: uppercase;
        border: 1px solid
          ${location.pathname === link
            ? theme.tagIdentifierContent
            : "rgba(0,0,0,0)"};
        padding: 4px 15px;
        border-radius: 20px;
        box-sizing: content-box;
        pointer-events: none;
      `}
    >
      {text}
    </div>
  );
  if (link) {
    return (
      <Link
        to={link}
        css={`
          margin: 0 10px;
          text-decoration: none;
          border-radius: 20px;
        `}
      >
        {button}
      </Link>
    );
  } else {
    return button;
  }
}

RoundButton.propTypes = {
  text: PropTypes.string,
  link: PropTypes.string,
};

export default RoundButton;
