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
export function clearMultiSelect(
    containerId
) {
    instances
        .get(containerId)
        ?.clear();
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
        this.container.classList.add("multiselect");
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
        //--------------------------------------------------
    // Header
    //--------------------------------------------------

    createHeader() {

        const header =
            document.createElement("div");

        header.className =
            "multiselect-header";

        header.innerHTML = `
            <span class="multiselect-text">
                ${this.placeholder}
            </span>
            
            <span class="multiselect-arrow">
                ▾
            </span>
        `;
        return header;
    }

    //--------------------------------------------------
    // Søgefelt
    //--------------------------------------------------

    createSearch() {
        const input =
            document.createElement("input");
        input.type = "text";
        input.placeholder = "Søg...";
        input.className =
            "multiselect-search";
        input.addEventListener("click", e => {
            e.stopPropagation();
        });
        input.addEventListener("input", () => {
            this.filterOptions(
                input.value.trim().toLowerCase()
            );
        });
        return input;
    }

    //--------------------------------------------------
    // Vælg alle
    //--------------------------------------------------

    createSelectAll() {

    const wrapper =
        document.createElement("div");
    wrapper.className =
        "multiselect-option multiselect-select-all";
    const checkbox =
        document.createElement("input");
    checkbox.type = "checkbox";
    const label =
        document.createElement("span");
    label.textContent = "Vælg alle";
    wrapper.append(
        checkbox,
        label
    );
    wrapper.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        const checked =
            !checkbox.checked;
        checkbox.checked = checked;
        this.options.forEach(option => {
            option.setChecked(
                checked,
                false
            );
        });
        this.updateHeader();
        this.onChange(
            this.getValues()
        );
    });
    wrapper.checkbox = checkbox;
    return wrapper;
}

    //--------------------------------------------------
    // Byg alle muligheder
    //--------------------------------------------------

    createOptions() {
        this.options = [];
        this.values.forEach(value => {
            const option =
                this.createOption(value);
            this.options.push(option);
            this.optionsContainer.appendChild(
                option.element
            );
        });
    }

    //--------------------------------------------------
    // Én mulighed
    //--------------------------------------------------

    createOption(value) {
        const element =
            document.createElement("div");
        element.className =
            "multiselect-option";
        element.dataset.value =
            value;
        const checkbox =
            document.createElement("input");
        checkbox.type = "checkbox";
        const label =
            document.createElement("span");
        label.textContent =
            value;
        element.append(
            checkbox,
            label
        );

        const setChecked = (
            checked,
            notify = true
        ) => {

            checkbox.checked =
                checked;
            if (checked) {
                this.selected.add(value);

            }

            else {

                this.selected.delete(value);

            }
            this.updateSelectAll();
            if (notify) {
                this.updateHeader();
                this.onChange(
                    this.getValues()
                );
            }
        };
        element.addEventListener(
            "click",
            e => {
                e.stopPropagation();
                if (e.target !== checkbox) {
                    checkbox.checked =
                        !checkbox.checked;
                }
                setChecked(
                    checkbox.checked
                );
            }
        );
        return {
            value,
            element,
            checkbox,
            setChecked,
            setVisible(show) {
                element.style.display =
                    show ? "" : "none";
            }
        };

    }
        //--------------------------------------------------
    // Opdater header
    //--------------------------------------------------

    updateHeader() {
        const text =
            this.header.querySelector(
                ".multiselect-text"
            );
        const values =
            this.getValues();
        if (values.length === 0) {
            text.textContent =
                this.placeholder;
            return;
        }
        if (values.length <= 2) {
            text.textContent =
                values.join(", ");
            return;
        }
        text.textContent =
            `${values[0]}, ${values[1]} +${values.length - 2}`;
    }

    //--------------------------------------------------
    // Opdater "Vælg alle"
    //--------------------------------------------------

    updateSelectAll() {
        if (!this.selectAll.checkbox) return;
        this.selectAll.checkbox.checked =
            this.selected.size ===
            this.options.length;
    }

    //--------------------------------------------------
    // Filtrer muligheder
    //--------------------------------------------------

    filterOptions(query) {
        this.options.forEach(option => {
            option.setVisible(
                option.value
                    .toLowerCase()
                    .includes(query)
            );
        });
    }

    //--------------------------------------------------
    // Åbn dropdown
    //--------------------------------------------------

    open() {
        this.dropdown.classList.add(
            "open"
        );
        this.header.classList.add(
            "open"
        );
        this.search.focus();
    }

    //--------------------------------------------------
    // Luk dropdown
    //--------------------------------------------------

    close() {
        this.dropdown.classList.remove(
            "open"
        );
        this.header.classList.remove(
            "open"
        );
    }

    //--------------------------------------------------
    // Returnér valgte værdier
    //--------------------------------------------------

    getValues() {
        return [...this.selected];
    }
    clear() {
    this.options.forEach(option => {
        option.setChecked(
            false,
            false
        );
    });

    this.selected.clear();
    this.updateHeader();
    this.updateSelectAll();
    this.onChange(
        this.getValues()
    );
}

    //--------------------------------------------------
    // Fjern komponent
    //--------------------------------------------------

    destroy() {
        this.container.innerHTML = "";
        this.options = [];
        this.selected.clear();

    }
    }
