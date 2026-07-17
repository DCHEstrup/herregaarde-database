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

        text: "",

        selected: [],

        data

    };

} input.addEventListener(
    "input",
    e => {

        state.text =
            e.target.value;

        renderSuggestions();

    }
);
function renderSuggestions() {

    suggestions.innerHTML = "";

    if (!state.text.trim()) {
        return;
    }

    const matches =
        state.data
            .filter(item =>
                item.værdi
                    .toLowerCase()
                    .includes(
                        state.text.toLowerCase()
                    )
            )
            .sort(
                (a, b) =>
                    b.antal - a.antal
            )
            .slice(0, 15);

    matches.forEach(item => {

        const div =
            document.createElement("div");

        div.className =
            "arbejde-suggestion";

        div.innerHTML = `
            <span>${item.værdi}</span>
            <span>${item.antal}</span>
        `;

        suggestions.appendChild(div);

    });

}
