import { normalizeDanishSearch } from "../utils/searchNormalization.js";

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

export function clearMultiSelect(containerId) {
    instances
        .get(containerId)
        ?.clear();
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

class MultiSelect {

    constructor({
        containerId,
        values = [],
        placeholder = "Vælg...",
        onChange = () => {},
        groups = null
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
        this.groups = groups;
        this.groupHeaders = [];

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

    const searchId =
        `${this.container.id}-search`;

    //----------------------------------
    // Grundlæggende attributter
    //----------------------------------

    input.type = "text";
    input.id = searchId;
    input.name = searchId;

    input.placeholder =
        "Søg...";

    input.className =
        "multiselect-search";

    input.autocomplete =
        "off";

    //----------------------------------
    // Tilgængeligt navn
    //----------------------------------

    const labelElementId =
        this.container.getAttribute(
            "aria-labelledby"
        );

    const labelElement =
        labelElementId
            ? document.getElementById(
                labelElementId
            )
            : null;

    const filterName =
        labelElement
            ?.textContent
            ?.trim()
            || "filter";

    input.setAttribute(
        "aria-label",
        `Søg i ${filterName}`
    );

    //----------------------------------
    // Klik
    //----------------------------------

    input.addEventListener(
        "click",
        event => {
            event.stopPropagation();
        }
    );

    //----------------------------------
    // Filtrering
    //----------------------------------

    input.addEventListener(
        "input",
        () => {
            this.filterOptions(
                input.value.trim()
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
                this.updateGroupHeaders();
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
    this.groupHeaders = [];

    //----------------------------------
    // Almindelig multiselect
    //----------------------------------

    if (!this.groups) {

        this.values.forEach(value => {
            const option =
                this.createOption(value);

            this.options.push(option);

            this.optionsContainer.appendChild(
                option.element
            );
        });

        return;
    }

    //----------------------------------
    // Grupperet multiselect
    //----------------------------------

    const sortedGroups =
        Object.entries(this.groups)
            .sort(
                ([groupA], [groupB]) =>
                    groupA.localeCompare(
                        groupB,
                        "da"
                    )
            );

    sortedGroups.forEach(
        ([groupName, groupValues]) => {

            const group =
                document.createElement(
                    "div"
                );

            group.className =
                "multiselect-group";

            //----------------------------------
            // Sortér herregårde alfabetisk
            //----------------------------------

            const sortedValues =
                [...groupValues]
                    .sort(
                        (a, b) =>
                            String(a)
                                .localeCompare(
                                    String(b),
                                    "da"
                                )
                    );

            //----------------------------------
            // Gruppeoverskrift
            //----------------------------------

            const groupHeader =
                this.createGroupHeader(
                    groupName,
                    sortedValues
                );

            group.appendChild(
                groupHeader.element
            );

            //----------------------------------
            // Gruppens muligheder
            //----------------------------------

            const groupOptions =
                document.createElement(
                    "div"
                );

            groupOptions.className =
                "multiselect-group-options";

            sortedValues.forEach(value => {
                const option =
                    this.createOption(value);

                option.groupName =
                    groupName;

                this.options.push(
                    option
                );

                groupOptions.appendChild(
                    option.element
                );
            });

            group.appendChild(
                groupOptions
            );

            this.optionsContainer.appendChild(
                group
            );

            groupHeader.groupElement =
                group;

            this.groupHeaders.push(
                groupHeader
            );
        }
    );

    this.updateGroupHeaders();
}
//--------------------------------------------------
// Gruppeoverskrift
//--------------------------------------------------

createGroupHeader(
    groupName,
    groupValues
) {
    const element =
        document.createElement("div");

    element.className =
        "multiselect-group-header";

    const checkbox =
        document.createElement("input");

    checkbox.type =
        "checkbox";

    checkbox.setAttribute(
        "aria-label",
        `Vælg alle herregårde i ${groupName}`
    );

    const name =
        document.createElement("span");

    name.className =
        "multiselect-group-name";

    name.textContent =
        groupName;

    const count =
        document.createElement("span");

    count.className =
        "multiselect-group-count";

    count.textContent =
        groupValues.length
            .toLocaleString("da-DK");

    element.append(
        checkbox,
        name,
        count
    );

    //----------------------------------
    // Klik på region
    //----------------------------------

    element.addEventListener(
        "click",
        event => {
            event.preventDefault();
            event.stopPropagation();

            const allSelected =
                groupValues.every(
                    value =>
                        this.selected.has(
                            value
                        )
                );

            const shouldSelect =
                !allSelected;

            groupValues.forEach(value => {

                const option =
                    this.options.find(
                        item =>
                            String(
                                item.value
                            ) ===
                            String(value)
                    );

                if (!option) {
                    return;
                }

                option.setChecked(
                    shouldSelect,
                    false
                );
            });

            this.updateHeader();
            this.updateSelectAll();
            this.updateGroupHeaders();
            this.notifyChange();
        }
    );

    return {
        element,
        checkbox,
        groupName,
        groupValues,
        groupElement: null
    };
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

const safeId =
    `multiselect-${this.container.id}-${String(value)
        .toLowerCase()
        .replace(/[^a-z0-9æøå]+/gi, "-")}`;

checkbox.id = safeId;
checkbox.name = this.container.id;

const label =
    document.createElement("label");

label.htmlFor = safeId;
label.textContent = value;

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
            this.updateGroupHeaders();

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
// Opdater gruppe-checkboxes
//--------------------------------------------------

updateGroupHeaders() {

    if (!this.groups) {
        return;
    }

    this.groupHeaders.forEach(
        group => {

            const selectedCount =
                group.groupValues
                    .filter(
                        value =>
                            this.selected.has(
                                value
                            )
                    )
                    .length;

            const total =
                group.groupValues.length;

            group.checkbox.checked =
                total > 0 &&
                selectedCount === total;

            group.checkbox.indeterminate =
                selectedCount > 0 &&
                selectedCount < total;
        }
    );
}

    //--------------------------------------------------
    // Opdater header
    //--------------------------------------------------

updateHeader() {
    const headerText =
        this.header.querySelector(
            ".multiselect-text"
        );

    const selectedValues =
        this.getValues();

    const label =
        this.placeholder
            .replace(/^Alle\s+/i, "")
            .replace(/^./, c => c.toUpperCase());

    if (selectedValues.length === 0) {
        headerText.textContent =
            this.placeholder;
        return;
    }

    if (selectedValues.length === 1) {
        headerText.textContent =
            selectedValues[0];
        return;
    }

    headerText.textContent =
        `${label} · ${selectedValues.length} valgt`;
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

filterOptions(query) {

    //----------------------------------
    // Filtrer muligheder
    //----------------------------------

    this.options.forEach(option => {

const matches =
    normalizeDanishSearch(
        option.value
    ).includes(
        normalizeDanishSearch(
            query
        )
    );

        option.setVisible(
            matches
        );
    });

    //----------------------------------
    // Almindelig multiselect
    //----------------------------------

    if (!this.groups) {
        return;
    }

    //----------------------------------
    // Skjul grupper uden matches
    //----------------------------------

    this.groupHeaders.forEach(
        group => {

            const groupOptions =
                this.options.filter(
                    option =>
                        option.groupName ===
                        group.groupName
                );

            const hasVisibleOptions =
                groupOptions.some(
                    option =>
                        option.element
                            .style.display
                        !== "none"
                );

            if (group.groupElement) {
                group.groupElement
                    .style.display =
                    hasVisibleOptions
                        ? ""
                        : "none";
            }
        }
    );
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
        this.updateGroupHeaders()
        this.notifyChange();
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
        this.updateGroupHeaders();
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

        instances.delete(
            this.container.id
        );
    }
}
