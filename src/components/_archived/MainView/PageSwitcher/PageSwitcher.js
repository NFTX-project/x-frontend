import React, { useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  ButtonBase,
  LoadingRing,
  Popover,
  GU,
  textStyle,
  useTheme,
} from "@aragon/ui";
import PageItem from "./PageItem";
import Links from "./Links";

const PageSwitcher = React.memo(function PageSwitcher({ networkId, loading }) {
  const theme = useTheme();

  const buttonRef = useRef(null);
  const [menuOpened, setMenuOpened] = useState(false);

  const handleToggleMenu = useCallback(() => {
    setMenuOpened((opened) => !opened);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpened(false);
  }, []);

  const networks = [
    { name: "Mainnet", id: 1 },
    { name: "Rinkeby", id: 4 },
  ];

  const currentNetwork = networks.find((n) => n.id === networkId);

  const networkOptions = networks.filter((n) => n.id !== networkId);

  if (loading) {
    return (
      <div
        css={`
          display: flex;
          align-items: center;
          margin: ${2 * GU}px ${3 * GU}px;
        `}
      >
        <LoadingRing />
        <span
          css={`
            margin-left: ${1 * GU}px;
            ${textStyle("body1")}
          `}
        >
          Loading…
        </span>
      </div>
    );
  }

  if (!currentNetwork.name) {
    return null;
  }

  return (
    <div
      className="xxxx"
      css={`
        display: flex;
        align-items: center;
        position: relative;
      `}
    >
      <ButtonBase
        ref={buttonRef}
        onClick={handleToggleMenu}
        css={`
          flex-grow: 1;
          padding: ${2 * GU}px ${2 * GU}px ${2 * GU}px ${3 * GU}px;
          width: 100%;
          height: 100%;
          min-width: ${28 * GU}px;
          border-radius: 0;
          &:active {
            background: ${theme.surfacePressed};
          }
        `}
      >
        <PageItem
          network={currentNetwork}
          css={`
            ${textStyle("body1")}
          `}
        />
      </ButtonBase>
      <Popover
        onClose={closeMenu}
        visible={menuOpened}
        opener={buttonRef.current}
      >
        <Links
          currentNetwork={currentNetwork}
          networkOptions={networkOptions}
        />
      </Popover>
    </div>
  );
});

PageSwitcher.propTypes = {
  networkId: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default PageSwitcher;
