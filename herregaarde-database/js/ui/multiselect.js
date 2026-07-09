const instances = new Map();

export function createMultiSelect({
    containerId,
    values,
    placeholder = "Vælg..."
}) {

    const container =
        document.getElementById(containerId);
    container.innerHTML = "";
    //------------------------------------
    // State
    //------------------------------------
    const selected = new Set();
    //------------------------------------
    // Header
    //------------------------------------
    const header =
        document.createElement("div");
    header.className = "multiselect-header";
    header.textContent = placeholder;
    //------------------------------------
    // Dropdown
    //------------------------------------
    const dropdown =
        document.createElement("div");
    dropdown.className = "multiselect-dropdown";
//------------------------------------
// Søgefelt
//------------------------------------

const search =
    document.createElement("input");
search.type = "text";
search.placeholder = "Søg...";
search.className = "multiselect-search";
search.addEventListener("click", e => {
e.stopPropagation();
});
dropdown.appendChild(search);
    const options = [];
    values.forEach(value => {
        const option =
            document.createElement("div");
        option.className = "multiselect-option";
        option.innerHTML = `
            <input type="checkbox">
            <span>${value}</span>
        `;
        option.addEventListener("click", () => {
            const checkbox =
                option.querySelector("input");
            checkbox.checked = !checkbox.checked;
            if (checkbox.checked) {
                selected.add(value);
            }
            else {
                selected.delete(value);
            }
            updateHeader();
        });
        dropdown.appendChild(option);
        options.push(option);
    });
    //------------------------------------
// Filtrer muligheder
//------------------------------------

search.addEventListener("input", () => {
    const query =
        search.value.toLowerCase();
    options.forEach(option => {
        const text =
            option.innerText.toLowerCase();
        option.style.display =
            text.includes(query)
                ? ""
                : "none";
    });
});
    //------------------------------------
    // Header tekst
    //------------------------------------
    function updateHeader() {
        if (selected.size === 0) {
            header.textContent = placeholder;
        }
        else if (selected.size <= 2) {
            header.textContent =
                [...selected].join(", ");
        }
        else {
            header.textContent =
                `${selected.size} valgt`;
        }
    }
    //------------------------------------
    // Åbn/Luk
    //------------------------------------
    header.addEventListener("click", () => {
        dropdown.classList.toggle("open");
        header.classList.toggle("open");
            if (dropdown.classList.contains("open")) {
        search.focus();
    }
    });
    //------------------------------------
    // Klik udenfor
    //------------------------------------
    document.addEventListener("click", e => {
        if (!container.contains(e.target)) {
            dropdown.classList.remove("open");
            header.classList.remove("open");
        }
    });
    //------------------------------------
    // Byg komponent
    //------------------------------------
    container.appendChild(header);
    container.appendChild(dropdown);
    //------------------------------------
    // Gem instans
    //------------------------------------
    instances.set(containerId, {
        getValues() {
            return [...selected];
        }
    });
}
export function getSelectedValues(containerId) {
    return instances
        .get(containerId)
        ?.getValues() ?? [];
}
