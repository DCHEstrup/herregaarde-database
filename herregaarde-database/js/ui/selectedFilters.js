import {
    getCurrentFilters
} from "../filtersState.js";

import {
    getMultiSelectOptionCount,
    removeMultiSelectValue,
    clearMultiSelect
} from "./multiselectV2.js";

import {
    clearSelectedArbejde,
    removeSelectedArbejde
} from "./arbejdeAutocomplete.js";

const MAX_VISIBLE = 7;

let initialized = false;

const filterConfig = {
    herregaard: {
        label: "Herregård",
        type: "multiselect"
    },

    aar: {
        label: "Folketællingsår",
        type: "multiselect"
    },

    koen: {
        label: "Køn",
        type: "multiselect"
    },

    trossamfund: {
        label: "Religion",
        type: "multiselect"
    },

    civilstand: {
        label: "Civilstand",
        type: "multiselect"
    },

    region: {
        label: "Herregårdens region",
        type: "multiselect"
    },

    kommune: {
        label: "Herregårdens kommune",
        type: "multiselect"
    },

    handicap: {
        label: "Handicap",
        type: "multiselect"
    },

    arbejdeValgt: {
        label: "Arbejde / position",
        type: "arbejde"
    },

    arbejde: {
        label: "Fritekstsøgning",
        type: "text",
        elementId: "arbejde"
    },

    alder: {
        label: "Alder",
        type: "range",
        fromKey: "alderFra",
        toKey: "alderTil",
        fromId: "alderFra",
        toId: "alderTil",
        suffix: " år"
    },

    transport: {
        label: "Transport",
        type: "range",
        fromKey: "transportFra",
        toKey: "transportTil",
        fromId: "transportFra",
        toId: "transportTil",
        suffix: " km"
    },
    globalSoegning: {
    label: "Søgning i hele databasen",
    type: "text",
    elementId: "globalSearch"
}
    
};

export function initSelectedFilters() {
    if (initialized) {
        return;
    }

    const toggle =
        document.getElementById(
            "selectedFiltersToggle"
        );

    const dropdown =
        document.getElementById(
            "selectedFiltersDropdown"
        );

    if (!toggle || !dropdown) {
        console.warn(
            "HTML til Valgte filtre blev ikke fundet."
        );

        return;
    }

    toggle.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            const isOpen =
                toggle.getAttribute(
                    "aria-expanded"
                ) === "true";

            setOpen(!isOpen);
        }
    );

    dropdown.addEventListener(
        "click",
        event => {
            event.stopPropagation();
        }
    );

    document.addEventListener(
        "click",
        () => {
            setOpen(false);
        }
    );

    document.addEventListener(
        "filtersChanged",
        renderSelectedFilters
    );

    addInputListeners();

    initialized = true;

    renderSelectedFilters();
}

export function renderSelectedFilters() {
    const content =
        document.getElementById(
            "selectedFiltersContent"
        );

    const count =
        document.getElementById(
            "selectedFiltersCount"
        );

    const toggle =
        document.getElementById(
            "selectedFiltersToggle"
        );

    if (!content || !count || !toggle) {
        return;
    }

    const filters =
        getCurrentFilters();

    content.innerHTML = "";

    let selectedCount = 0;
    let visibleGroups = 0;

    //--------------------------------------------------
    // Multiselect-filtre
    //--------------------------------------------------

    Object.entries(filterConfig)
        .filter(([, config]) =>
            config.type === "multiselect"
        )
        .forEach(([key, config]) => {
            const values =
                normalizeArray(filters[key]);

            if (values.length === 0) {
                return;
            }

            const optionCount =
                getMultiSelectOptionCount(key);

            const allSelected =
                optionCount > 0 &&
                values.length === optionCount;

            content.appendChild(
                createMultiSelectGroup({
                    key,
                    label: config.label,
                    values,
                    allSelected
                })
            );

            selectedCount += values.length;
            visibleGroups += 1;
        });

    //--------------------------------------------------
    // Valgte arbejde/position-værdier
    //--------------------------------------------------

    const selectedArbejde =
        normalizeArray(
            filters.arbejdeValgt
        );

    if (selectedArbejde.length > 0) {
        content.appendChild(
            createArbejdeGroup(
                selectedArbejde
            )
        );

        selectedCount +=
            selectedArbejde.length;

        visibleGroups += 1;
    }

    //--------------------------------------------------
    // Fritekstsøgning
    //--------------------------------------------------

    if (filters.arbejde) {
        content.appendChild(
            createSingleValueGroup({
                label:
                    filterConfig.arbejde.label,

                value:
                    filters.arbejde,

                remove() {
                    const input =
                        document.getElementById(
                            "arbejde"
                        );

                    if (input) {
                        input.value = "";
                    }

                    notifyFiltersChanged();
                }
            })
        );

        selectedCount += 1;
        visibleGroups += 1;
    }
    if (filters.globalSoegning) {
    content.appendChild(
        createSingleValueGroup({
            label: "Søgning i hele databasen",
            value: filters.globalSoegning,

            remove() {
                const input =
                    document.getElementById(
                        "globalSearch"
                    );

                if (input) {
                    input.value = "";
                }

                notifyFiltersChanged();
            }
        })
    );

    selectedCount += 1;
    visibleGroups += 1;
}

    //--------------------------------------------------
    // Alder
    //--------------------------------------------------

    const alderGroup =
        createRangeGroup({
            label:
                filterConfig.alder.label,

            from:
                filters.alderFra,

            to:
                filters.alderTil,

            fromId:
                filterConfig.alder.fromId,

            toId:
                filterConfig.alder.toId,

            suffix:
                filterConfig.alder.suffix
        });

    if (alderGroup) {
        content.appendChild(
            alderGroup
        );

        selectedCount += 1;
        visibleGroups += 1;
    }

    //--------------------------------------------------
    // Transport
    //--------------------------------------------------

    const transportGroup =
        createRangeGroup({
            label:
                filterConfig.transport.label,

            from:
                filters.transportFra,

            to:
                filters.transportTil,

            fromId:
                filterConfig.transport.fromId,

            toId:
                filterConfig.transport.toId,

            suffix:
                filterConfig.transport.suffix
        });

    if (transportGroup) {
        content.appendChild(
            transportGroup
        );

        selectedCount += 1;
        visibleGroups += 1;
    }

    //--------------------------------------------------
    // Tom tilstand
    //--------------------------------------------------

    if (visibleGroups === 0) {
        content.innerHTML = `
            <p class="selected-filters-empty">
                Ingen filtre er valgt.
            </p>
        `;
    }

    count.textContent =
        selectedCount > 0
            ? `(${selectedCount})`
            : "";

    toggle.classList.toggle(
        "has-filters",
        selectedCount > 0
    );
}

function createMultiSelectGroup({
    key,
    label,
    values,
    allSelected
}) {
    const group =
        createGroup(label);

    const valuesContainer =
        createValuesContainer();

    if (allSelected) {
        valuesContainer.appendChild(
            createChip(
                "Alle",
                () => {
                    clearMultiSelect(key);
                    notifyFiltersChanged();
                }
            )
        );

        group.appendChild(
            valuesContainer
        );

        return group;
    }

    appendLimitedValues({
        container: valuesContainer,
        values,

        removeValue(value) {
            removeMultiSelectValue(
                key,
                value
            );

            notifyFiltersChanged();
        }
    });

    group.appendChild(
        valuesContainer
    );

    return group;
}

function createArbejdeGroup(values) {
    const group =
        createGroup(
            filterConfig.arbejdeValgt.label
        );

    const valuesContainer =
        createValuesContainer();

    appendLimitedValues({
        container: valuesContainer,
        values,

        removeValue(value) {
            removeSelectedArbejde(value);
            notifyFiltersChanged();
        }
    });

    group.appendChild(
        valuesContainer
    );

    return group;
}

function createSingleValueGroup({
    label,
    value,
    remove
}) {
    const group =
        createGroup(label);

    const valuesContainer =
        createValuesContainer();

    valuesContainer.appendChild(
        createChip(
            value,
            remove
        )
    );

    group.appendChild(
        valuesContainer
    );

    return group;
}

function createRangeGroup({
    label,
    from,
    to,
    fromId,
    toId,
    suffix = ""
}) {
    if (
        from == null &&
        to == null
    ) {
        return null;
    }

    let text = "";

    if (
        from != null &&
        to != null
    ) {
        text =
            `${from}–${to}${suffix}`;
    }
    else if (from != null) {
        text =
            `Fra ${from}${suffix}`;
    }
    else {
        text =
            `Til ${to}${suffix}`;
    }

    return createSingleValueGroup({
        label,
        value: text,

        remove() {
            clearInput(fromId);
            clearInput(toId);

            notifyFiltersChanged();
        }
    });
}

function appendLimitedValues({
    container,
    values,
    removeValue
}) {
    const visible =
        values.slice(
            0,
            MAX_VISIBLE
        );

    visible.forEach(value => {
        container.appendChild(
            createChip(
                value,
                () => {
                    removeValue(value);
                }
            )
        );
    });

    const remaining =
        values.length -
        visible.length;

    if (remaining <= 0) {
        return;
    }

    const more =
        document.createElement(
            "button"
        );

    more.type = "button";

    more.className =
        "selected-filter-more";

    more.textContent =
        `+ ${remaining} valgte`;

    more.addEventListener(
        "click",
        () => {
            container.innerHTML = "";

            values.forEach(value => {
                container.appendChild(
                    createChip(
                        value,
                        () => {
                            removeValue(value);
                        }
                    )
                );
            });
        }
    );

    container.appendChild(more);
}

function createGroup(label) {
    const group =
        document.createElement(
            "section"
        );

    group.className =
        "selected-filter-group";

    const heading =
        document.createElement(
            "h3"
        );

    heading.className =
        "selected-filter-heading";

    heading.textContent =
        label;

    group.appendChild(heading);

    return group;
}

function createValuesContainer() {
    const container =
        document.createElement(
            "div"
        );

    container.className =
        "selected-filter-values";

    return container;
}

function createChip(
    text,
    removeCallback
) {
    const chip =
        document.createElement(
            "span"
        );

    chip.className =
        "selected-filter-chip";

    const value =
        document.createElement(
            "span"
        );

    value.className =
        "selected-filter-chip-text";

    value.textContent =
        String(text);

    const remove =
        document.createElement(
            "button"
        );

    remove.type = "button";

    remove.className =
        "selected-filter-remove";

    remove.textContent = "×";

    remove.setAttribute(
        "aria-label",
        `Fjern ${text}`
    );

    remove.addEventListener(
        "click",
        event => {
            event.stopPropagation();
            removeCallback();
        }
    );

    chip.append(
        value,
        remove
    );

    return chip;
}

function addInputListeners() {
    [
        "arbejde",
        "alderFra",
        "alderTil",
        "transportFra",
        "transportTil"
    ].forEach(id => {
        const input =
            document.getElementById(id);

        if (!input) {
            return;
        }

        input.addEventListener(
            "input",
            notifyFiltersChanged
        );

        input.addEventListener(
            "change",
            notifyFiltersChanged
        );
    });
}

function setOpen(open) {
    const toggle =
        document.getElementById(
            "selectedFiltersToggle"
        );

    const dropdown =
        document.getElementById(
            "selectedFiltersDropdown"
        );

    if (!toggle || !dropdown) {
        return;
    }

    toggle.setAttribute(
        "aria-expanded",
        String(open)
    );

    dropdown.hidden = !open;
}

function clearInput(id) {
    const input =
        document.getElementById(id);

    if (input) {
        input.value = "";
    }
}

function normalizeArray(value) {
    return Array.isArray(value)
        ? value
        : [];
}

export function notifyFiltersChanged() {
    document.dispatchEvent(
        new CustomEvent(
            "filtersChanged"
        )
    );
}

export function clearSelectedFilters() {
    setOpen(false);
    renderSelectedFilters();
}
