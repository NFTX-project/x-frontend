import React from "react";
import PropTypes from "prop-types";
import { GU, EthIdenticon } from "@aragon/ui";

function PageIcon({ networkId, size }) {
  return (
    <div
      css={`
        overflow: hidden;
        width: ${size}px;
        height: ${size}px;
        flex-shrink: 0;
        flex-grow: 0;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <EthIdenticon
        address={`0x${networkId}${"0".repeat(
          40 - networkId.toString().length
        )}`}
        css={`
          border-radius: 50%;
        `}
      />
    </div>
  );
}
PageIcon.propTypes = {
  networkId: PropTypes.number.isRequired,
  size: PropTypes.number,
};
PageIcon.defaultProps = {
  size: 3 * GU,
};

export default PageIcon;
