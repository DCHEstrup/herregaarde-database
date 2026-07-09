const instances = new Map();

export function createMultiSelect({
    containerId,
    values = [],
    placeholder = "Vælg...",
    onChange = () => {}
}) {

    //----------------------------------
    // Elementer
    //----------------------------------

    const container =
        document.getElementById(containerId);
    container.innerHTML = "";

    //----------------------------------
    // State
    //----------------------------------

    const state = {
        selected: new Set(),
        options: [],
        values,
        placeholder,
        onChange
    };

    //----------------------------------
    // Header
    //----------------------------------

    const header =
        createHeader(state);

    //----------------------------------
    // Dropdown
    //----------------------------------

    const dropdown =
        createDropdown();

    //----------------------------------
    // Sticky område
    //----------------------------------

    const controls =
        document.createElement("div");
    controls.className =
        "multiselect-controls";
  const search = createSearch(filterOptions);
controls.appendChild(search);
    state.options =
    state.values.map(value => {
        const option =
            createOption(
                value,
                state,
                updateHeader
            );
        optionsContainer.appendChild(
            option.element
        );
        return option;
    });
function createOption(value, state, updateHeader) {
    const option =
        document.createElement("div");
    option.className =
        "multiselect-option";
    option.dataset.value = value;
    option.innerHTML = `
        <input type="checkbox">
        <span>${value}</span>
    `;
    const checkbox =
        option.querySelector("input");
    //----------------------------------
    // Klik på rækken
    //----------------------------------
    option.addEventListener("click", (e) => {
        if (e.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
        }
        if (checkbox.checked) {
            state.selected.add(value);
        }
        else {
            state.selected.delete(value);
        }
        updateHeader();
        state.onChange(
            [...state.selected]
        );
    });
    return {
        value,
           element: option,
        checkbox,
        setVisible(show) {
            option.style.display =
                show ? "" : "none";
        }
    };
}
    //----------------------------------
    // Scrollområde
    //----------------------------------

    const optionsContainer =
        document.createElement("div");
    optionsContainer.className =
        "multiselect-options";
    function updateHeader() {
    console.log(state.selected);
}
    dropdown.appendChild(controls);
    dropdown.appendChild(optionsContainer);

    //----------------------------------
    // Byg komponent
    //----------------------------------

    container.appendChild(header);
    container.appendChild(dropdown);

    //----------------------------------
    // Gem instans
    //----------------------------------

    instances.set(containerId, {
        getValues() {
            return [...state.selected];
        }
    });
}
export function getSelectedValues(containerId) {
    return instances
        .get(containerId)
        ?.getValues() ?? [];
}

function createHeader(state) {
    const header =
        document.createElement("div");
    header.className =
        "multiselect-header";
    header.innerHTML = `
        <span class="multiselect-text">
            ${state.placeholder}
        </span>
        <span class="multiselect-arrow">
            ▾
        </span>
    `;
    return header;
}
function createDropdown() {
    const dropdown =
        document.createElement("div");
    dropdown.className =
        "multiselect-dropdown";
    return dropdown;
}
function createSearch(onSearch) {
    const search =
        document.createElement("input");
    search.type = "text";
    search.placeholder = "Søg...";
    search.className = "multiselect-search";
    //----------------------------------
    // Klik i feltet må ikke lukke dropdown
    //----------------------------------
    search.addEventListener("click", e => {
        e.stopPropagation();
    });
    //----------------------------------
    // Filtrer mens der skrives
    //----------------------------------
    search.addEventListener("input", () => {
        onSearch(search.value.trim().toLowerCase());
    });
    return search;
}

function filterOptions(query) {
    state.options.forEach(option => {
        option.setVisible(
            option.value
                .toLowerCase()
                .includes(query)
        );
    });
}
