import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
// import styled from "styled-components";
import {
  ButtonIcon,
  GU,
  IconMenu,
  springs,
  useTheme,
  useViewport,
} from "@aragon/ui";
import { SiteStatusType } from "../../../prop-types";
import { SITE_STATUS_LOADING } from "../../../symbols";
import { iOS, isSafari } from "../../../utils";
import { MENU_PANEL_WIDTH } from "../MenuPanel/MenuPanel";
import PageSwitcher from "./PageSwitcher/PageSwitcher";

// Remaining viewport width after the menu panel is factored in
const AppWidthContext = React.createContext(0);

function MainView({ siteStatus, visible, web3 }) {
  const theme = useTheme();
  const { width, below } = useViewport();
  const autoClosingPanel = below("medium");

  const [menuPanelOpen, setMenuPanelOpen] = useState(!autoClosingPanel);

  const toggleMenuPanel = useCallback(
    () => setMenuPanelOpen((opened) => !opened),
    []
  );

  return (
    <div
      className="main-view-wrapper"
      css={`
        display: ${visible ? "flex" : "none"};
        flex-direction: column;
        position: relative;
        z-index: 0;
        height: 100vh;
        min-width: ${45 * GU}px;
      `}
    >
      <AppWidthContext.Provider
        value={autoClosingPanel ? width : width - MENU_PANEL_WIDTH}
      >
        <div
          css={`
            display: flex;
            flex-direction: column;
            position: relative;
            height: 100%;
            width: 100%;
            background: ${theme.background};
          `}
        >
          <div
            css={`
              flex-shrink: 0;
              position: relative;
              z-index: 2;
              height: ${8 * GU}px;
              display: flex;
              justify-content: space-between;
              background: ${theme.surface};
              box-shadow: 0 2px 3px rgba(0, 0, 0, 0.05);

              ${menuPanelOpen && iOS
                ? `
            /* behaviour only in iOS:
             * with the nested div->div->div structure
             * the 3rd div has positioned absolute
             * Chrome, Firefox and Safari uch div gets rendered
             * aboe the rest of the content (up the tree till a
             * position relative is found) but in iOS it gets
             * rendered below the sibling of the element with
             * position relative (and z-index did not work)
             * this fix gives the element an absolute (z-index
             * layers are then respected);
             * this also adds the appropriate value to recover the
             * elements height
             * */
            position: absolute;
            width: 100%;
            z-index: 0;
          `
                : ""}
            `}
          >
            {autoClosingPanel ? (
              <ButtonIcon
                label="Open menu"
                onClick={toggleMenuPanel}
                css={`
                  position: relative;
                  top: ${2 * GU}px;
                  left: ${2 * GU}px;
                `}
              >
                <IconMenu />
              </ButtonIcon>
            ) : (
              <div>
                <PageSwitcher networkId={4} loading={false} />
              </div>
            )}
          </div>
        </div>
      </AppWidthContext.Provider>
    </div>
  );
}

MainView.propTypes = {
  siteStatus: SiteStatusType,
  visible: PropTypes.bool.isRequired,
  web3: PropTypes.object,
};

export default MainView;
