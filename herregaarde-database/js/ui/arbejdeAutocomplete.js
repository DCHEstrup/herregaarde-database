import { renderChips } from "./chips.js";

let instance = null;

export function createArbejdeAutocomplete({

    inputId,
    suggestionId,
    data

}) {

const input =
    document.getElementById(inputId);

const suggestions =
    document.getElementById(suggestionId);
    const sortToggle =
    document.getElementById(
        "workSortToggle"
    );

// Opret komponent-wrapper
const wrapper =
    document.createElement("div");

wrapper.className =
    "autocomplete";

// Opret chips
const chips =
    document.createElement("div");

chips.className =
    "selected-chips";

// Pak input ind i wrapper
input.parentNode.insertBefore(
    wrapper,
    input
);

wrapper.appendChild(input);
wrapper.appendChild(chips);
wrapper.appendChild(suggestions);
    

    const state = {

        data,
        selected: [],
        text: "",
        sortMode: "count"

    };
//----------------------------------
// Sorterings-switch
//----------------------------------

sortToggle?.addEventListener(
    "click",
    event => {

        event.preventDefault();
        event.stopPropagation();

        const countMode =
            state.sortMode ===
            "count";

        if (countMode) {

            state.sortMode =
                "alphabetical";

            sortToggle.classList.remove(
                "count-mode"
            );

            sortToggle.setAttribute(
                "aria-pressed",
                "false"
            );

        }
        else {

            state.sortMode =
                "count";

            sortToggle.classList.add(
                "count-mode"
            );

            sortToggle.setAttribute(
                "aria-pressed",
                "true"
            );
        }

        render();
    }
);
    function sortItems(items) {

    const sorted =
        [...items];

    if (
        state.sortMode ===
        "alphabetical"
    ) {
        return sorted.sort(
            (a, b) =>
                String(a.værdi)
                    .localeCompare(
                        String(b.værdi),
                        "da"
                    )
        );
    }

    return sorted.sort(
        (a, b) =>
            Number(b.antal) -
            Number(a.antal)
    );
}

    //----------------------------------
    // Rendering
    //----------------------------------

    function render() {

        suggestions.innerHTML = "";

        const text =
            state.text
                .trim()
                .toLowerCase();

        let matches;

if (text) {

    matches =
        state.data.filter(
            item =>
                item.værdi
                    .toLowerCase()
                    .includes(text)
        );

}
else {

    matches =
        [...state.data];

}

matches =
    sortItems(matches)
        .slice(0, 50);

        if (matches.length === 0) {

            suggestions.style.display = "none";
            return;

        }

        suggestions.style.display = "block";

        matches.forEach(item => {

            const row =
                document.createElement("div");

            row.className =
                "arbejde-row";

            const checked =
                state.selected.includes(item.værdi)
                    ? "checked"
                    : "";

            row.innerHTML = `

                <label class="arbejde-label">

                    <input
                        type="checkbox"
                        ${checked}>

                    <span class="arbejde-value">

                        ${item.værdi}

                    </span>

                    <span class="arbejde-count">

                        (${item.antal})

                    </span>

                </label>

            `;

            const checkbox =
                row.querySelector("input");

           checkbox.addEventListener(
    "change",
    () => {
        if (checkbox.checked) {
            if (
                !state.selected.includes(
                    item.værdi
                )
            ) {
                state.selected.push(
                    item.værdi
                );
            }
        }
        else {
            state.selected =
                state.selected.filter(
                    value =>
                        value !== item.værdi
                );
        }

        renderSelectedChips();
        render();

        document.dispatchEvent(
            new CustomEvent(
                "filtersChanged"
            )
        );
    }
);

            suggestions.appendChild(row);

        });

    }
function renderSelectedChips() {
    renderChips(
        chips,
        state.selected,
        value => {
            state.selected =
                state.selected.filter(
                    v => v !== value
                );
            render();
            renderSelectedChips();

            document.dispatchEvent(
                new CustomEvent(
                    "filtersChanged"
                )
            );
        }
    );
}

    //----------------------------------
    // Input
    //----------------------------------

input.addEventListener(
    "input",
    () => {
        state.text =
            input.value;

        render();
        renderSelectedChips();

        document.dispatchEvent(
            new CustomEvent(
                "filtersChanged"
            )
        );
    }
);

    //----------------------------------
    // Focus
    //----------------------------------

    input.addEventListener(
        "focus",
        () => {

            render();
            renderSelectedChips();

        }
    );

    //----------------------------------
    // Luk ved klik udenfor
    //----------------------------------

    document.addEventListener(
        "click",
        event => {

            if (

                !input.contains(event.target)

                &&

                !suggestions.contains(event.target)

            ) {

                suggestions.style.display =
                    "none";

            }

        }
    );

    //----------------------------------
    // Offentlig metode
    //----------------------------------

    input.getSelectedValues =
        () => [...state.selected];
const api = {
    getSelected() {
        return [...state.selected];
    },

    remove(value) {
        state.selected =
            state.selected.filter(
                selectedValue =>
                    selectedValue !== value
            );

        render();
        renderSelectedChips();

        document.dispatchEvent(
            new CustomEvent(
                "filtersChanged"
            )
        );
    },

    clear() {
        state.selected = [];
        state.text = "";
        input.value = "";

        suggestions.innerHTML = "";
        suggestions.style.display = "none";

        renderSelectedChips();

        document.dispatchEvent(
            new CustomEvent(
                "filtersChanged"
            )
        );
    }
};

instance = api;

return api;
}

//--------------------------------------------------
// Offentlige hjælpefunktioner
//--------------------------------------------------

export function getSelectedArbejde() {
    return instance?.getSelected() || [];
}

export function clearSelectedArbejde() {
    instance?.clear();
}

export function removeSelectedArbejde(value) {
    instance?.remove(value);
}
