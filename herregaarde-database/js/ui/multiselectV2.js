const instances = new Map();

export function createMultiSelect(config) {

    const multiselect =
        new MultiSelect(config);
    instances.set(
        config.containerId,
        multiselect
    );
    return multiselect;

}

export function getSelectedValues(containerId) {

    return instances
        .get(containerId)
        ?.getValues() ?? [];

}

class MultiSelect {

    constructor({
        containerId,
        values = [],
        placeholder = "Vælg...",
        onChange = () => {}

    }) {
        this.container =
            document.getElementById(
                containerId
            );
        this.values = values;
        this.placeholder =
            placeholder;
        this.onChange =
            onChange;
        this.selected =
            new Set();
        this.options = [];
        this.build();

    }

    //--------------------------------------------------
    // Byg komponent
    //--------------------------------------------------

    build() {
        this.container.innerHTML = "";

        //----------------------------------
        // Header
        //----------------------------------

        this.header =
            this.createHeader();

        //----------------------------------
        // Dropdown
        //----------------------------------

        this.dropdown =
            document.createElement("div");
        this.dropdown.className =
            "multiselect-dropdown";

        //----------------------------------
        // Sticky område
        //----------------------------------

        this.controls =
            document.createElement("div");
        this.controls.className =
            "multiselect-controls";

        //----------------------------------
        // Scrollområde
        //----------------------------------

        this.optionsContainer =
            document.createElement("div");
        this.optionsContainer.className =
            "multiselect-options";

        //----------------------------------
        // Søgefelt
        //----------------------------------

        this.search =
            this.createSearch();

        //----------------------------------
        // Vælg alle
        //----------------------------------

        this.selectAll =
            this.createSelectAll();

        //----------------------------------
        // Muligheder
        //----------------------------------

        this.createOptions();

        //----------------------------------
        // Saml dropdown
        //----------------------------------

        this.controls.append(
            this.search,
            this.selectAll
        );
        this.dropdown.append(
            this.controls,
            this.optionsContainer
        );

        //----------------------------------
        // Saml komponent
        //----------------------------------
        this.container.append(
            this.header,
            this.dropdown
        );
        //----------------------------------
        // Events
        //----------------------------------
        this.header.addEventListener(
            "click",
            () => this.open()
        );
        document.addEventListener(
            "click",
            e => {
                if (
                    !this.container.contains(
                        e.target
                    )
                ) {
                    this.close();
                }
            }
        );
    }
