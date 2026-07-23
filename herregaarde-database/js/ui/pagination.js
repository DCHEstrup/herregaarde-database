export function renderPagination(
    result,
    onPageChange
) {
    const container =
        document.getElementById("pagination");
    container.innerHTML = "";
    const totalPages = Math.max(
    1,
    Math.ceil(result.total / result.page_size)
    );
    if (totalPages <= 1) return;
    const current = result.page;

    //----------------------------------
    // Første side <<
    //----------------------------------

    const first = document.createElement("button");
    first.textContent = "<<";
    first.disabled = current === 1;
    first.addEventListener("click", () => {
        onPageChange(1);
    });

    container.appendChild(first);

    //----------------------------------
    // Sideknapper
    //----------------------------------

    const pages = [];
    if (current === 1) {
        pages.push(1, 2, 3);

    }

    else if (current === totalPages) {
        pages.push(
            totalPages - 2,
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
    pages
        .filter(p => p >= 1 && p <= totalPages)
        .forEach(page => {
            const button =
                document.createElement("button");
            button.className = "btn btn-page";
            button.textContent = page;
            if (page === current) {
                button.classList.add("active");
            }
            button.addEventListener("click", () => {
                onPageChange(page);
            });
            container.appendChild(button);
        });

    //----------------------------------
    // Sidste side >>
    //----------------------------------

    const last = document.createElement("button");
    last.textContent = ">>";
    last.disabled = current === totalPages;
    last.addEventListener("click", () => {
        onPageChange(totalPages);
    });

    container.appendChild(last);

}
