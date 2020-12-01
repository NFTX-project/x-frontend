import React, { useState } from "react";
import { SidePanel } from "@aragon/ui";
import Funds from "../Funds/Funds";
import MintPanel from "../MintPanel/MintPanel";
import RedeemPanel from "../RedeemPanel/RedeemPanel";

function D1Funds() {
  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const handleMintClick = (vaultId, ticker) => {
    setPanelTitle(`Mint ${ticker}`);
    setPanelOpened(true);
    setInnerPanel(<MintPanel ticker={ticker} />);
  };

  const handleRedeemClick = (vaultId, ticker) => {
    setPanelTitle(`Redeem ${ticker}`);
    setPanelOpened(true);
    setInnerPanel(<RedeemPanel ticker={ticker} />);
  };

  return (
    <div>
      <Funds
        title="CryptoPunks"
        entries={[
          { ticker: "PUNK-BASIC", supply: "0", vaultId: "0" },
          { ticker: "PUNK-ATTR-4", supply: "0", vaultId: "1" },
          { ticker: "PUNK-ATTR-5", supply: "0", vaultId: "2" },
          { ticker: "PUNK-ZOMBIE", supply: "0", vaultId: "3" },
        ]}
        handleMint={handleMintClick}
        handleRedeem={handleRedeemClick}
      />

      <Funds
        title="CryptoKitties"
        entries={[
          { ticker: "KITTY-GEN-0", supply: "0", vaultId: "4" },
          { ticker: "KITTY-GEN-0-FAST", supply: "0", vaultId: "5" },
          { ticker: "KITTY-FANCY", supply: "0", vaultId: "6" },
          { ticker: "KITTY-FOUNDER", supply: "0", vaultId: "7" },
        ]}
        handleMint={handleMintClick}
        handleRedeem={handleRedeemClick}
      />

      <Funds
        title="Autoglyphs"
        entries={[{ ticker: "GLYPH", supply: "0", vaultId: "8" }]}
        handleMint={handleMintClick}
        handleRedeem={handleRedeemClick}
      />
      <Funds
        title="Axie Infinity"
        entries={[
          { ticker: "AXIE-MYSTIC-1", supply: "0", vaultId: "9" },
          { ticker: "AXIE-MYSTIC-2", supply: "0", vaultId: "10" },
        ]}
        handleMint={handleMintClick}
        handleRedeem={handleRedeemClick}
      />

      <Funds
        title="Avastars"
        entries={[
          { ticker: "AVASTAR-RANK-25", supply: "0", vaultId: "11" },
          { ticker: "AVASTAR-RANK-50", supply: "0", vaultId: "12" },
          { ticker: "AVASTAR-RANK-75", supply: "0", vaultId: "13" },
        ]}
        handleMint={handleMintClick}
        handleRedeem={handleRedeemClick}
      />
      <Funds
        title="Joyworld"
        entries={[{ ticker: "JOY", supply: "0", vaultId: "14" }]}
        handleMint={handleMintClick}
        handleRedeem={handleRedeemClick}
      />
      <SidePanel
        title={panelTitle}
        opened={panelOpened}
        onClose={() => setPanelOpened(false)}
      >
        {innerPanel}
      </SidePanel>
    </div>
  );
}

export default D1Funds;
