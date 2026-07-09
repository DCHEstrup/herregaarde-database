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
state.options = state.values.map(value => {
    const option = createOption(
        value,
        state,
        updateHeader
    );
    optionsContainer.appendChild(
        option.element
    );
    return option;
});
    function filterOptions(query) {
    state.options.forEach(option => {
        option.setVisible(
            option.value
                .toLowerCase()
                .includes(query)
        );
    });
}
function createOption(value, state, updateHeader) {
    const element = document.createElement("div");
    element.className = "multiselect-option";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const label = document.createElement("span");
    label.textContent = value;
    element.append(checkbox, label);
    function setChecked(checked) {
        checkbox.checked = checked;
        if (checked) {
            state.selected.add(value);
        } else {
            state.selected.delete(value);
        }
    }
    element.addEventListener("click", e => {
        if (e.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
        }
        setChecked(checkbox.checked);
        state.onChange([...state.selected]);
        updateHeader();
        state.onChange([...state.selected]);
    });
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
    //----------------------------------
    // Scrollområde
    //----------------------------------

    const optionsContainer =
        document.createElement("div");
    optionsContainer.className =
        "multiselect-options";
function updateHeader() {
    const values = [...state.selected];
    if (values.length === 0) {
        header.querySelector(".multiselect-text").textContent =
            state.placeholder;
        return;
    }
    if (values.length <= 2) {
        header.querySelector(".multiselect-text").textContent =
            values.join(", ");
    }
    else {
        header.querySelector(".multiselect-text").textContent =
            `${values[0]}, ${values[1]} +${values.length - 2}`;
    }
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


