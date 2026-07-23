export function renderPagination(result, onPageChange) {
    const container = document.getElementById("pagination");

    container.innerHTML = "";

    const totalPages = Math.ceil(
        result.total / result.page_size
    );

    if (totalPages <= 1) {
        return;
    }

    const current = result.page;

    const pages = [];

    if (current === 1) {
        pages.push(1, 2);
    } else if (current === totalPages) {
        pages.push(totalPages - 1, totalPages);
    } else {
        pages.push(
            current - 1,
            current,
            current + 1
        );
    }

    const visiblePages = [...new Set(pages)]
        .filter(page => page >= 1 && page <= totalPages);

    const firstPageVisible =
        visiblePages.includes(1);

    const lastPageVisible =
        visiblePages.includes(totalPages);

    //----------------------------------
    // Første side <<
    //----------------------------------

    if (!firstPageVisible) {
        const first =
            document.createElement("button");

        first.type = "button";
        first.className = "btn btn-page";
        first.textContent = "<<";
        first.setAttribute(
            "aria-label",
            "Gå til første side"
        );

        first.addEventListener("click", () => {
            onPageChange(1);
        });

        container.appendChild(first);
    }

    //----------------------------------
    // Sideknapper
    //----------------------------------

    visiblePages.forEach(page => {
        const button =
            document.createElement("button");

        button.type = "button";
        button.className = "btn btn-page";
        button.textContent = page;

        if (page === current) {
            button.classList.add("active");
            button.setAttribute(
                "aria-current",
                "page"
            );
        }

        button.addEventListener("click", () => {
            onPageChange(page);
        });

        container.appendChild(button);
    });

    //----------------------------------
    // Sidste side >>
    //----------------------------------

    if (!lastPageVisible) {
        const last =
            document.createElement("button");

        last.type = "button";
        last.className = "btn btn-page";
        last.textContent = ">>";
        last.setAttribute(
            "aria-label",
            "Gå til sidste side"
        );

        last.addEventListener("click", () => {
            onPageChange(totalPages);
        });

        container.appendChild(last);
    }
}
