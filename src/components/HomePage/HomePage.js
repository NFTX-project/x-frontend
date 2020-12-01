import React, { useMemo, useState, useCallback } from "react";
import { Split, DropDown, SidePanel, Info } from "@aragon/ui";
import { network } from "../../environment";
import WelcomeAction from "../WelcomeAction/WelcomeAction";
import Suggestions from "./Suggestions/Suggestions";
import { useSuggestedFunds } from "../../suggested-funds";
import CreateD1PanelA from "../CreateD1Panel/CreateD1PanelA";
import CreateD2Panel from "../CreateD2Panel/CreateD2Panel";

import actionCreate from "./assets/action-create.png";
import actionOpen from "./assets/action-open.png";

function HomePage({ selectorNetworks }) {
  const selectorNetworksSorted = useMemo(() => {
    return selectorNetworks
      .map(([type, name, url]) => ({ type, name, url }))
      .sort((a, b) => {
        if (b.type === network.type) return 1;
        if (a.type === network.type) return -1;
        return 0;
      });
  }, [selectorNetworks]);

  const [createError, setCreateError] = useState([null]);

  const suggestedFunds = useSuggestedFunds();

  const [panelTitle, setPanelTitle] = useState("");
  const [panelOpened, setPanelOpened] = useState(false);
  const [innerPanel, setInnerPanel] = useState(<div></div>);

  const handleCreate = useCallback(
    (degree) => {
      /* // reset the creation state
    saveTemplateState({}) */
      /* const requirementsError = validateCreationRequirements(
      account,
      balance,
      isContractAccount
    )
    setRequirementsError(requirementsError)

    // Account not connected
    if (requirementsError[0] === 'no-account') {
      setConnectIntent('create')
      setConnectModalOpened(true)
      return
    }

    // No error, we can go to create straight away
    if (requirementsError[0] === null) {
      goToCreate()
    } */
      setPanelTitle(
        degree === 1 ? "Create a D1 Fund (Step 1/3)" : "Create a D2 Fund"
      );
      setInnerPanel(degree === 1 ? <CreateD1PanelA /> : <CreateD2Panel />);
      setPanelOpened(true);
    },
    [
      /* account, balance, goToCreate, isContractAccount */
    ]
  );

  return (
    <div
      css={`
        margin-top: 25px;
      `}
    >
      <Split
        primary={
          <div>
            <DropDown
              items={selectorNetworksSorted.map((network) => network.name)}
              placeholder={selectorNetworksSorted[0].name}
              onChange={() => console.log("changed")}
              wide
            />
            <WelcomeAction
              title="Create a simple NFT fund"
              subtitle={"Deploy a 1:1 NFT-backed ERC20 token"}
              illustration={actionCreate}
              onActivate={() => handleCreate(1)}
              hasError={
                createError[0] !== null && createError[0] !== "no-account"
              }
            />
            <WelcomeAction
              title="Create a complex NFT fund"
              subtitle={"Make a Balancer pool comprised of simple funds"}
              illustration={actionOpen}
              onActivate={() => handleCreate(2)}
              hasError={
                createError[0] !== null && createError[0] !== "no-account"
              }
            />
          </div>
        }
        secondary={<Suggestions suggestedFunds={suggestedFunds} />}
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

export default HomePage;
