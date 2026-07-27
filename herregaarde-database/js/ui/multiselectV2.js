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
export function getMultiSelectOptionCount(
    containerId
) {
    return instances
        .get(containerId)
        ?.getOptionCount() ?? 0;
}

export function removeMultiSelectValue(
    containerId,
    value
) {
    instances
        .get(containerId)
        ?.removeValue(value);
}

export function clearMultiSelect(containerId) {
    instances
        .get(containerId)
        ?.clear();
}

export function getMultiSelectValues(containerId) {
    return instances
        .get(containerId)
        ?.getValues() ?? [];
}

export function getMultiSelectOptionCount(containerId) {
    return instances
        .get(containerId)
        ?.getOptionCount() ?? 0;
}

export function removeMultiSelectValue(
    containerId,
    value
) {
    instances
        .get(containerId)
        ?.removeValue(value);
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

        if (!this.container) {
            console.error(
                `Multiselect-containeren "${containerId}" blev ikke fundet.`
            );
            return;
        }

        this.values = values;
        this.placeholder = placeholder;
        this.onChange = onChange;

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

        this.container.classList.add(
            "filter-component",
            "multiselect"
        );

        this.header =
            this.createHeader();

        this.dropdown =
            document.createElement("div");

        this.dropdown.className =
            "filter-dropdown multiselect-dropdown";

        this.controls =
            document.createElement("div");

        this.controls.className =
            "multiselect-controls";

        this.optionsContainer =
            document.createElement("div");

        this.optionsContainer.className =
            "multiselect-options";

        this.search =
            this.createSearch();

        this.selectAll =
            this.createSelectAll();

        this.createOptions();

        this.controls.append(
            this.search,
            this.selectAll
        );

        this.dropdown.append(
            this.controls,
            this.optionsContainer
        );

        this.container.append(
            this.header,
            this.dropdown
        );

        this.header.addEventListener(
            "click",
            () => this.toggle()
        );

        document.addEventListener(
            "click",
            event => {
                if (
                    !this.container.contains(
                        event.target
                    )
                ) {
                    this.close();
                }
            }
        );
    }

    //--------------------------------------------------
    // Åbn / luk
    //--------------------------------------------------

    toggle() {
        if (
            this.dropdown.classList.contains(
                "open"
            )
        ) {
            this.close();
        }
        else {
            this.open();
        }
    }

    //--------------------------------------------------
    // Header
    //--------------------------------------------------

    createHeader() {
        const header =
            document.createElement("div");

        header.className =
            "multiselect-header";

        header.tabIndex = 0;

        header.setAttribute(
            "role",
            "button"
        );

        header.setAttribute(
            "aria-haspopup",
            "listbox"
        );

        header.setAttribute(
            "aria-expanded",
            "false"
        );

        const text =
            document.createElement("span");

        text.className =
            "multiselect-text";

        text.textContent =
            this.placeholder;

        const arrow =
            document.createElement("span");

        arrow.className =
            "multiselect-arrow";

        arrow.textContent =
            "▾";

        header.append(
            text,
            arrow
        );

        header.addEventListener(
            "keydown",
            event => {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    this.toggle();
                }

                if (event.key === "Escape") {
                    this.close();
                }
            }
        );

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

        input.addEventListener(
            "click",
            event => {
                event.stopPropagation();
            }
        );

        input.addEventListener(
            "input",
            () => {
                this.filterOptions(
                    input.value
                        .trim()
                        .toLowerCase()
                );
            }
        );

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

        label.textContent =
            "Vælg alle";

        wrapper.append(
            checkbox,
            label
        );

        wrapper.addEventListener(
            "click",
            event => {
                event.preventDefault();
                event.stopPropagation();

                const checked =
                    !checkbox.checked;

                checkbox.checked =
                    checked;

                this.options.forEach(
                    option => {
                        option.setChecked(
                            checked,
                            false
                        );
                    }
                );

                this.updateHeader();
                this.updateSelectAll();

                this.notifyChange();
            }
        );

        wrapper.checkbox =
            checkbox;

        return wrapper;
    }

    //--------------------------------------------------
    // Byg muligheder
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

        checkbox.type =
            "checkbox";

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
                this.notifyChange();
            }
        };

        element.addEventListener(
            "click",
            event => {
                event.stopPropagation();

                if (
                    event.target !== checkbox
                ) {
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

        if (
            values.length ===
            this.options.length
        ) {
            text.textContent =
                "Alle";

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
        if (!this.selectAll?.checkbox) {
            return;
        }

        this.selectAll.checkbox.checked =
            this.options.length > 0 &&
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

        this.header.setAttribute(
            "aria-expanded",
            "true"
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

        this.header.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    //--------------------------------------------------
    // Returnér valgte værdier
    //--------------------------------------------------

    getValues() {
        return [...this.selected];
    }

    //--------------------------------------------------
    // Antal muligheder
    //--------------------------------------------------

    getOptionCount() {
        return this.options.length;
    }

    //--------------------------------------------------
    // Fjern én værdi
    //--------------------------------------------------

    removeValue(value) {
        const option =
            this.options.find(
                item =>
                    String(item.value) ===
                    String(value)
            );

        if (!option) {
            return;
        }

        option.setChecked(
            false,
            false
        );

        this.updateHeader();
        this.updateSelectAll();

 this.onChange(
        this.getValues()
    );

    document.dispatchEvent(
        new CustomEvent(
            "filtersChanged"
        )
    );
    }

    //--------------------------------------------------
    // Ryd multiselect
    //--------------------------------------------------

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

        this.notifyChange();
    }

    //--------------------------------------------------
    // Underret resten af appen
    //--------------------------------------------------

    notifyChange() {
        this.onChange(
            this.getValues()
        );

        document.dispatchEvent(
            new CustomEvent(
                "filtersChanged"
            )
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
