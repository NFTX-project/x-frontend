import PropTypes from "prop-types";

import {
  SITE_STATUS_ERROR,
  SITE_STATUS_READY,
  SITE_STATUS_LOADING,
  SITE_STATUS_UNLOADED,
} from "./symbols";
import { isAddress } from "web3-utils";

const validatorCreator = (nonRequiredFunction) => {
  const validator = nonRequiredFunction;

  validator.isRequired = (props, propName, componentName) => {
    const value = props[propName];

    if (value === null || value === undefined || value === "") {
      return new Error(
        `Property ${propName} is required on ${componentName}, but ${value} was given.`
      );
    }

    return nonRequiredFunction(props, propName, componentName);
  };

  return validator;
};

const ethereumAddressValidator = (props, propName, componentName) => {
  const value = props[propName];

  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (!isAddress(value)) {
    const valueType = typeof value;
    let nonAddress = null;

    if (valueType !== "object") {
      nonAddress = value.toString();
    }

    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. The provided value is not a valid ethereum address.${
        nonAddress && ` You provided "${nonAddress}"`
      }`
    );
  }
};

export const EthereumAddressType = validatorCreator(ethereumAddressValidator);

export const SiteStatusType = PropTypes.oneOf([
  SITE_STATUS_ERROR,
  SITE_STATUS_READY,
  SITE_STATUS_LOADING,
  SITE_STATUS_UNLOADED,
]);

export const NetworkItemType = PropTypes.shape({
  name: PropTypes.string,
  number: PropTypes.number,
});

// see ethereum-providers/
export const EthereumProviderType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  strings: PropTypes.object.isRequired,
});
