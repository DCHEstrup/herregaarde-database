import { getSelectedValues } from "./multiselectV2.js";
import { getCurrentFilters } from "../filtersState.js";

let activeTab = "personRegister";

export function initDatabaseTabs({
    onOpenComparison
} = {}) {
    const personTab =
        document.getElementById(
            "personRegisterTab"
        );

    const compareTab =
        document.getElementById(
            "compareEstatesTab"
        );

    const personPanel =
        document.getElementById(
            "personRegisterPanel"
        );

    const comparePanel =
        document.getElementById(
            "compareEstatesPanel"
        );

    if (
        !personTab ||
        !compareTab ||
        !personPanel ||
        !comparePanel
    ) {
        return;
    }

    function openPersonRegister() {
        activeTab = "personRegister";

        setActiveTab({
            activeButton: personTab,
            inactiveButton: compareTab,
            activePanel: personPanel,
            inactivePanel: comparePanel
        });
    }

 async function openComparison() {
    const selectedEstates =
        getSelectedValues(
            "herregaard"
        );

    if (selectedEstates.length !== 2) {
        return;
    }

    activeTab = "comparison";

    setActiveTab({
        activeButton: compareTab,
        inactiveButton: personTab,
        activePanel: comparePanel,
        inactivePanel: personPanel
    });

    if (onOpenComparison) {
        await onOpenComparison(
            getCurrentFilters()
        );
    }
}

    function updateCompareAvailability() {
        const selectedEstates =
            getSelectedValues(
                "herregaard"
            );

        const canCompare =
            selectedEstates.length === 2;

        compareTab.disabled =
            !canCompare;

        compareTab.title =
            canCompare
                ? `Sammenlign ${selectedEstates[0]} og ${selectedEstates[1]}`
                : "Vælg præcis to herregårde for at aktivere sammenligningen";

        /*
         * Hvis sammenligningsfanen er åben,
         * men brugeren ikke længere har valgt
         * præcis to herregårde, går vi tilbage
         * til personregisteret.
         */
        if (
            !canCompare &&
            activeTab === "comparison"
        ) {
            openPersonRegister();
        }
    }

    personTab.addEventListener(
        "click",
        openPersonRegister
    );

    compareTab.addEventListener(
        "click",
        openComparison
    );

    document.addEventListener(
        "filtersChanged",
        updateCompareAvailability
    );

    updateCompareAvailability();
}

function setActiveTab({
    activeButton,
    inactiveButton,
    activePanel,
    inactivePanel
}) {
    activeButton.classList.add(
        "active"
    );

    activeButton.setAttribute(
        "aria-selected",
        "true"
    );

    inactiveButton.classList.remove(
        "active"
    );

    inactiveButton.setAttribute(
        "aria-selected",
        "false"
    );

    activePanel.hidden = false;
    activePanel.classList.add(
        "active"
    );

    inactivePanel.hidden = true;
    inactivePanel.classList.remove(
        "active"
    );
}
