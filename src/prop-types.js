import PropTypes from "prop-types";

import {
  SITE_STATUS_ERROR,
  SITE_STATUS_READY,
  SITE_STATUS_LOADING,
  SITE_STATUS_UNLOADED,
} from "./symbols";

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
