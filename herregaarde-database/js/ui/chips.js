export function renderChips(container, values, onRemove) {

    container.innerHTML = "";
        if (values.length === 0) {
        container.style.display = "none";
        return;
    }

    container.style.display = "flex";

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
        container.style.display =
    values.length
        ? "flex"
        : "none";

    });

}
