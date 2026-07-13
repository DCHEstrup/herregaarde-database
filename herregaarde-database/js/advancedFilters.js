export function initialiseAdvancedFilters(){

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
            content.style.display === "block";
        content.style.display =
            open
                ? "none"
                : "block";
        arrow.textContent =
            open
                ? "▾"
                : "▴";
    });

}
