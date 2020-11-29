import React from "react";
import { AddressField } from "@aragon/ui";

function HashField({ hash }) {
  return (
    <div
      css={`
        position: relative;
        & > div > div:first-child {
        }
      `}
    >
      <div
        css={`
          position: absolute;
          z-index: 100;
          top: 2px;
          left: 11px;
          color: #201143;
          font-size: 28px;
          font-weight: 200;
        `}
      >
        #
      </div>

      <AddressField address={hash} autofocus={false} />
    </div>
  );
}

export default HashField;
