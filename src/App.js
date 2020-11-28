import React, { useState, useEffect } from "react";
import { UseWalletProvider } from "use-wallet";
import { Spring, animated } from "react-spring";
import {
  SITE_STATUS_ERROR,
  SITE_STATUS_READY,
  SITE_STATUS_LOADING,
  SITE_STATUS_UNLOADED,
} from "./symbols";
import { getWeb3 } from "./web3-utils";
import { web3Providers } from "./environment";
import { Main, useTheme } from "@aragon/ui";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import { FavoriteFundsProvider } from "./contexts/FavoriteFundsContext";

// import MainView from "./components/_archived/MainView/MainView";
import Site from "./components/Site/Site";
import GlobalPreferences from "./components/GlobalPreferences/GlobalPreferences";

const SELECTOR_NETWORKS = [
  ["main", "Ethereum Mainnet", "https://client.aragon.org/"],
  [
    "rinkeby",
    "Ethereum Testnet (Rinkeby)",
    "https://rinkeby.client.aragon.org/",
  ],
];

function App() {
  const theme = useTheme();
  // const web3 = getWeb3(web3Providers.default);

  return (
    <Spring
      from={{ opacity: 0, scale: 0.98 }}
      to={{ opacity: 1, scale: 1 }}
      native
    >
      {({ opacity, scale }) => (
        <animated.div
          style={{
            opacity,
            background: theme.background,
          }}
        >
          <animated.div
            style={{
              transform: scale.interpolate((v) => `scale3d(${v}, ${v}, 1)`),
            }}
          >
            <FavoriteFundsProvider>
              <Site selectorNetworks={SELECTOR_NETWORKS} />
              <GlobalPreferences />
            </FavoriteFundsProvider>
          </animated.div>
        </animated.div>
      )}
    </Spring>
  );
}

export default function WrapAppWithProvider() {
  return (
    <Router>
      <UseWalletProvider chainId={4}>
        <div
          className="app-wrapper"
          css={`
            & > div:first-child > div:first-child > div:first-child {
              width: 100vw;
              padding-bottom: 0;
            }
          `}
        >
          <Main theme={nftxTheme}>
            <App />
          </Main>
        </div>
      </UseWalletProvider>
    </Router>
  );
}

const nftxTheme = {
  _name: "dark",
  _appearance: "dark",
  background: "#33284c",
  border: "#201143",
  overlay: "#33284c",
  content: "#FFFFFF",
  contentSecondary: "#967cd6",
  surface: "#41355e",
  surfaceContent: "#FFFFFF",
  surfaceContentSecondary: "#967cd6",
  surfaceIcon: "#967cd6",
  surfaceUnder: "#392d54",
  surfaceOpened: "#967cd6",
  surfaceSelected: "#3a2e55",
  surfaceHighlight: "#4e4071",
  surfacePressed: "#4d406e",
  surfaceInteractive: "#4e4071",
  feedbackSurface: "#5c4c82",
  feedbackSurfaceContent: "#242136",
  feedbackSurfaceContentSecondary: "#615f7e",
  warning: "#ffc010",
  warningSurface: "#5e5c60",
  warningSurfaceContent: "#ffc010",
  info: "#0091ff",
  infoSurface: "#414479",
  infoSurfaceContent: "#189afb",
  help: "#cb83ff",
  helpContent: "#FFFFFF",
  helpSurface: "#FFFFFF",
  helpSurfaceContent: "#242136",
  negative: "#ff7768",
  negativeContent: "#FFFFFF",
  negativeSurface: "#685c72",
  negativeSurfaceContent: "#ff6756",
  positive: "#2cc696",
  positiveContent: "#FFFFFF",
  positiveSurface: "#35585e",
  positiveSurfaceContent: "#2cc687",
  badge: "#524179",
  badgeContent: "#ffffff",
  badgePressed: "#5c4c82",
  tagIdentifier: "#874090",
  tagIdentifierContent: "#D1D0FF",
  tagNew: "#353f5e",
  tagNewContent: "#2da1c9",
  tagIndicator: "#524179",
  tagIndicatorContent: "#0092ff",
  tagActivity: "#0091ff",
  tagActivityContent: "#FFFFFF",
  hint: "#8266c3",
  link: "#0c68ff",
  focus: "#0c68ff",
  selected: "#0886e5",
  selectedContent: "#FFFFFF",
  selectedDisabled: "#242136",
  disabled: "#4d3f6f",
  disabledContent: "#9584bf",
  disabledIcon: "#8266c3",
  control: "#65578c",
  controlBorder: "#392c58",
  controlBorderPressed: "#73659a",
  controlDisabled: "#4d3f6f",
  controlSurface: "#faf9fc",
  controlUnder: "#f3f1f7",
  accent: "#b4496f",
  accentStart: "#f27070",
  accentEnd: "#0886e5",
  accentContent: "#FFFFFF",
  floating: "#1c2539",
  floatingContent: "#FFFFFF",
  green: "#7fc75a",
  yellow: "#F7D858",
  red: "#F08658",
  blue: "#3E7BF6",
  brown: "#876559",
  purple: "#7C80F2",
};
