let initialized = false;

export function initialiseFilterInfo() {
    if (initialized) {
        return;
    }

    const buttons =
        document.querySelectorAll(
            ".info-button[data-info-target]"
        );

    buttons.forEach(button => {
        button.addEventListener(
            "click",
            event => {
                event.stopPropagation();

                const targetId =
                    button.dataset.infoTarget;

                const info =
                    document.getElementById(
                        targetId
                    );

                if (!info) {
                    return;
                }

                const shouldOpen =
                    info.hidden;

                closeAllFilterInfo();

                info.hidden =
                    !shouldOpen;

                button.setAttribute(
                    "aria-expanded",
                    String(shouldOpen)
                );
            }
        );
    });

    document
        .querySelectorAll(".filter-info")
        .forEach(info => {
            info.addEventListener(
                "click",
                event => {
                    event.stopPropagation();
                }
            );
        });

    document.addEventListener(
        "click",
        closeAllFilterInfo
    );

    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                closeAllFilterInfo();
            }
        }
    );

    initialized = true;
}

function closeAllFilterInfo() {
    document
        .querySelectorAll(".filter-info")
        .forEach(info => {
            info.hidden = true;
        });

    document
        .querySelectorAll(".info-button")
        .forEach(button => {
            button.setAttribute(
                "aria-expanded",
                "false"
            );
        });
}
