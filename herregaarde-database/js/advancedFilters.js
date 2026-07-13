export function initialiseAdvancedFilters() {

    const button =
        document.getElementById(
            "toggleAdvanced"
        );
    const content =
        document.getElementById(
            "advancedContent"
        );
    button.addEventListener("click", () => {
        button.classList.toggle("open");
        content.classList.toggle("open");
    });

}
