export function createArbejdeAutocomplete({

    inputId,
    suggestionId,
    data

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

    input.addEventListener(
        "input",
        () => {

            state.text =
                input.value;

            render();

        }
    );
    input.addEventListener(
    "focus",
    () => render()
);
    document.addEventListener(
    "click",
    e => {

        if (
            !input.contains(e.target) &&
            !suggestions.contains(e.target)
        ) {

            suggestions.style.display = "none";

        }

    }
);

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
            (a,b)=>b.antal-a.antal
        )

        .slice(0,50);

}
else {

    matches = state.data

        .slice(0,50);

}

        const checked =
    state.selected.includes(item.værdi)
        ? "checked"
        : "";

        suggestions.style.display = "block";

        matches.forEach(item=>{

            const row =
                document.createElement("div");

            row.className =
                "arbejde-row";

row.innerHTML = `
<label>

    <input
        type="checkbox"
        ${checked}>

    <span>${item.værdi}</span>

    <span class="arbejde-count">
        (${item.antal})
    </span>

</label>
`;

            suggestions.appendChild(row);
            const checkbox =
    row.querySelector("input");

checkbox.addEventListener(
    "change",
    () => {

        if (checkbox.checked) {

            state.selected.push(item.værdi);

        } else {

            state.selected =
                state.selected.filter(
                    v => v !== item.værdi
                );

        }

    }
);

        });

    }

}

