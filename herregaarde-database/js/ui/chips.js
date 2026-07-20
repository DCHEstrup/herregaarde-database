export function renderChips(container, values, onRemove) {

    container.innerHTML = "";

    values.forEach(value => {

        const chip = document.createElement("div");
        chip.className = "filter-chip";

        chip.innerHTML = `
            <span>${value}</span>
            <button type="button">✕</button>
        `;

        chip.querySelector("button")
            .addEventListener("click", () => {
                onRemove(value);
            });

        container.appendChild(chip);

    });

}
