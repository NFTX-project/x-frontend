import React from "react";
import PropTypes from "prop-types";
import { GU, EthIdenticon } from "@aragon/ui";
import { network } from "../../environment";
import { getKnownFunds } from "../../known-funds";
import { EthereumAddressType } from "../../prop-types";

function FundIcon({ fundAddress, size }) {
  const knownOrg = getKnownFunds(network.type, fundAddress);
  const knownOrgImage = knownOrg && knownOrg.image;

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
      {knownOrgImage ? (
        <img
          src={knownOrgImage}
          width={size}
          height={size}
          alt=""
          css="object-fit: contain"
        />
      ) : (
        <EthIdenticon
          address={fundAddress}
          css={`
            border-radius: 50%;
          `}
        />
      )}
    </div>
  );
}
FundIcon.propTypes = {
  fundAddress: EthereumAddressType.isRequired,
  size: PropTypes.number,
};
FundIcon.defaultProps = {
  size: 3 * GU,
};

export default FundIcon;
