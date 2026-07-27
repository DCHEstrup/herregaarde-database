export function renderPagination(result, onPageChange) {
    const container =
        document.getElementById("pagination");

    container.innerHTML = "";

    const total =
        Number(result.total) || 0;

    const pageSize =
        Number(result.page_size) || 25;

    const current =
        Number(result.page) || 1;

    const totalPages =
        Math.ceil(total / pageSize);

    //----------------------------------
    // Pagination-information
    //----------------------------------

    const info =
        document.createElement("div");

    info.className =
        "pagination-info";

    if (total === 0) {
        info.textContent =
            "Ingen personer fundet";
    }
    else {
        const firstPerson =
            (current - 1) * pageSize + 1;

        const lastPerson =
            Math.min(
                current * pageSize,
                total
            );

        const rangeText =
            document.createElement("div");

        rangeText.textContent =
            `Viser ${firstPerson.toLocaleString("da-DK")}–${lastPerson.toLocaleString("da-DK")} af ${total.toLocaleString("da-DK")} personer`;

        const pageText =
            document.createElement("div");

        pageText.textContent =
            `Side ${current.toLocaleString("da-DK")} af ${totalPages.toLocaleString("da-DK")}`;

        info.append(
            rangeText,
            pageText
        );
    }

    container.appendChild(info);

    //----------------------------------
    // Stop hvis der kun er én side
    //----------------------------------

    if (totalPages <= 1) {
        return;
    }

    //----------------------------------
    // Container til sideknapper
    //----------------------------------

    const controls =
        document.createElement("div");

    controls.className =
        "pagination-controls";

    const pages = [];

    if (current === 1) {
        pages.push(1, 2);
    }
    else if (current === totalPages) {
        pages.push(
            totalPages - 1,
            totalPages
        );
    }
    else {
        pages.push(
            current - 1,
            current,
            current + 1
        );
    }

    const visiblePages =
        [...new Set(pages)]
            .filter(
                page =>
                    page >= 1 &&
                    page <= totalPages
            );

    const firstPageVisible =
        visiblePages.includes(1);

    const lastPageVisible =
        visiblePages.includes(totalPages);

    //----------------------------------
    // Første side <<
    //----------------------------------

    if (!firstPageVisible) {
        const firstButton =
            document.createElement("button");

        firstButton.type = "button";
        firstButton.className =
            "btn btn-page";

        firstButton.textContent = "<<";

        firstButton.setAttribute(
            "aria-label",
            "Gå til første side"
        );

        firstButton.addEventListener(
            "click",
            () => {
                onPageChange(1);
            }
        );

        controls.appendChild(
            firstButton
        );
    }

    //----------------------------------
    // Sideknapper
    //----------------------------------

    visiblePages.forEach(page => {
        const button =
            document.createElement("button");

        button.type = "button";
        button.className =
            "btn btn-page";

        button.textContent =
            page.toLocaleString("da-DK");

        if (page === current) {
            button.classList.add(
                "active"
            );

            button.setAttribute(
                "aria-current",
                "page"
            );
        }

        button.addEventListener(
            "click",
            () => {
                onPageChange(page);
            }
        );

        controls.appendChild(button);
    });

    //----------------------------------
    // Sidste side >>
    //----------------------------------

    if (!lastPageVisible) {
        const lastButton =
            document.createElement("button");

        lastButton.type = "button";
        lastButton.className =
            "btn btn-page";

        lastButton.textContent = ">>";

        lastButton.setAttribute(
            "aria-label",
            "Gå til sidste side"
        );

        lastButton.addEventListener(
            "click",
            () => {
                onPageChange(
                    totalPages
                );
            }
        );

        controls.appendChild(
            lastButton
        );
    }

    container.appendChild(controls);
}
