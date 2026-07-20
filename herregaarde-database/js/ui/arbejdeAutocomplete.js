export function window.arbejdeAutocomplete =
    createArbejdeAutocomplete({

        inputId: "arbejde",
        suggestionId: "arbejdeSuggestions",
        data: data.arbejde

    }) {

    const input =
        document.getElementById(inputId);

    const suggestions =
        document.getElementById(suggestionId);

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

                }
            );

            suggestions.appendChild(row);

        });

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

        }
    );

    //----------------------------------
    // Focus
    //----------------------------------

    input.addEventListener(
        "focus",
        () => {

            render();

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

}

export function getSelectedArbejde() {

    return window.arbejdeAutocomplete?.getSelected() || [];

}
