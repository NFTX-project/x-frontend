import React from "react";
import { GU, textStyle } from "@aragon/ui";
import { DaoItemType } from "../../../../prop-types";

import PageIcon from "../../LinkIcon/LinkIcon";

function PageItem({ network, ...props }) {
  return (
    <div
      css={`
        flex-grow: 1;
        display: flex;
        align-items: center;
        ${textStyle("body2")}
      `}
      {...props}
    >
      <PageIcon networkId={network.id} />
      <span
        css={`
          padding-left: ${1 * GU}px;
          overflow: hidden;
          text-align: left;
          text-overflow: ellipsis;
          white-space: nowrap;
        `}
      >
        {network.name}
      </span>
    </div>
  );
}

export default PageItem;
