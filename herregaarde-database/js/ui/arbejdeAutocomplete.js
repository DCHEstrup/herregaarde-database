import { renderChips } from "./chips.js";
class ArbejdeAutocomplete {

    constructor(config){

        Object.assign(this, config);

    }

}
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
        text: ""

    };

    

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

            matches = state.data

                .filter(item =>
                    item.værdi
                        .toLowerCase()
                        .includes(text)
                )

                .sort(
                    (a, b) => b.antal - a.antal
                )

                .slice(0, 50);

        }

        else {

            matches = [...state.data]

                .sort(
                    (a, b) => b.antal - a.antal
                )

                .slice(0, 50);

        }

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

    clear() {

        state.selected = [];
        state.text = "";
        input.value = "";
    suggestions.innerHTML = "";
    suggestions.style.display = "none";
        renderSelectedChips();

    }

};

instance = api;

return api;
}

export function getSelectedArbejde() {

    return instance?.getSelected() || [];

}
export function clearSelectedArbejde() {

    instance?.clear();

}
