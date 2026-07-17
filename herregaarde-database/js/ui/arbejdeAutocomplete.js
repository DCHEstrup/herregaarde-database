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
