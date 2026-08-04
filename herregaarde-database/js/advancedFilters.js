export function initialiseAdvancedFilters() {
    const button =
        document.getElementById("toggleAdvanced");

    const content =
        document.getElementById("advancedContent");

    if (!button || !content) {
        return;
    }

    button.addEventListener("click", () => {
        const isOpen =
            button.classList.toggle("open");

        content.classList.toggle(
            "open",
            isOpen
        );

        button.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });
}
