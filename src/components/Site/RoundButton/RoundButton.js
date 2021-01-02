import React from "react";
import { useLocation, Link } from "react-router-dom";
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
          ${location.pathname === link ||
          (link === "/" && location.pathname.includes(`/fund/`))
            ? theme.tagIdentifierContent
            : "rgba(0,0,0,0)"};
        padding: 4px 15px;
        border-radius: 20px;
        box-sizing: content-box;
        pointer-events: none;
        min-width: 68px;
        display: flex;
        justify-content: center;
      `}
    >
      <div
        css={`
          transform: translateY(1px);
        `}
      >
        {" "}
        {text}
      </div>
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

export default RoundButton;
