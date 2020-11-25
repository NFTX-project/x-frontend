import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { Link, DropDown, GU, Layout, Split, useTheme } from "@aragon/ui";
import Header from "../Header/Header";

const Welcome = React.memo(function Welcome() {
  const theme = useTheme();

  return (
    <Layout
      breakpoints={{
        medium: 84 * GU,
        large: 112 * GU,
      }}
      css={`
        & > header {
          margin-top: 10px;
        }
      `}
    >
      <Header
        title="Welcome to NFTX"
        subtitle="A community-owned protocol for NFT index funds on Ethereum"
      />
    </Layout>
  );
});

export default Welcome;
