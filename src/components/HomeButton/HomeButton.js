import React from "react";
import PropTypes from "prop-types";
import { Button, IconHome, GU, RADIUS, useTheme } from "@aragon/ui";

function HomeButton({ onClick, ...props }) {
  const theme = useTheme();
  return (
    <div
      {...props}
      css={`
        position: absolute;
        top: ${1 * GU}px;
        left: ${1 * GU}px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: ${RADIUS}px;
      `}
    >
      <Button
        display="icon"
        icon={<IconHome />}
        label="Settings"
        size="medium"
        onClick={onClick}
        disabled={false}
      />
    </div>
  );
}

HomeButton.propTypes = {
  onClick: PropTypes.func,
};

HomeButton.defaultProps = {
  onClick: () => {
    window.location.hash = "/";
  },
};

export default HomeButton;
