export function initialiseAdvancedFilters() {

    const button =
        document.getElementById(
            "toggleAdvanced"
        );
    const content =
        document.getElementById(
            "advancedContent"
        );
    const arrow =
        document.getElementById(
            "advancedArrow"
        );
    button.addEventListener("click", () => {
        const open =
            content.classList.contains("open");
        content.classList.toggle("open");
        arrow.textContent =
            open
                ? "▾"
                : "▴";
    });
}
