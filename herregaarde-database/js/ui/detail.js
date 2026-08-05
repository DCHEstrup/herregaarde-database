import { getPerson,getHousehold } from "../supabase.js";

const fields = [
    ["navn", "Navn"],
    ["herregaard", "Herregård"],
    ["folketaelling_aar", "Folketælling"],
    ["alder", "Alder"],
    ["koen", "Køn"],
    ["arbejde_titel", "Arbejde"],
    ["position_i_husstanden", "Position i husstanden"],
    ["civilstand", "Civilstand"],
    ["foedested", "Fødested"],
    ["trossamfund", "Trossamfund"],
    ["transport", "Transport"],
    ["region", "Region"],
    ["kommune", "Kommune"],
    ["sted", "Sted"],
    ["naermere_lokation", "Nærmere lokation"],
    ["breddegrad_foedested", "Breddegrad"],
    ["laengdegrad_foedested", "Længdegrad"],
    ["handicap", "Handicap"]
];

export async function showDetail(id) {
    const { data, error } =
        await getPerson(id);

    if (error) {
        console.error(error);
        return;
    }

    const detail =
        document.getElementById("detail");

    detail.innerHTML = "";

    //----------------------------------
    // Titel
    //----------------------------------

    const title =
        document.createElement("h2");

    title.textContent =
        data.navn || "Ukendt person";

    detail.appendChild(title);

    //----------------------------------
    // Tabel
    //----------------------------------

    const table =
        document.createElement("table");

    table.className =
        "detail-table";

    for (const [key, label] of fields) {
        if (
            data[key] === null ||
            data[key] === ""
        ) {
            continue;
        }

        const row =
            document.createElement("tr");

        const th =
            document.createElement("th");

        const td =
            document.createElement("td");

        //----------------------------------
        // Arbejde som link
        //----------------------------------

        if (key === "arbejde_titel") {
            th.innerHTML = `
                <a
                    class="detail-heading-link"
                    href="https://www.danskeherregaarde.dk/tjenestefolk/herregaardens-hushold-funktioner-og-personer"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Læs om arbejdsfunktioner på Danske Herregårde"
                >
                    Arbejde
                    <span class="external-icon">
                        ↗
                    </span>
                </a>
            `;
        }

        //----------------------------------
        // Transport med info-knap
        //----------------------------------

        else if (key === "transport") {
            th.innerHTML = `
                <span class="detail-label-with-info">
                    <span>Transport</span>

                    <button
                        type="button"
                        class="detail-info-button"
                        aria-label="Læs mere om Transport"
                        aria-expanded="false"
                    >
                        i
                    </button>

                    <span
                        class="detail-info-popup"
                        hidden
                    >
                        <strong>Transport</strong>

                        <span>
                            Viser afstanden fra personens fødested
                            til den herregård, de arbejder på.
                        </span>
                    </span>
                </span>
            `;
        }

        //----------------------------------
        // Almindelige felter
        //----------------------------------

        else {
            th.textContent = label;
        }

        td.textContent = data[key];

        row.append(
            th,
            td
        );

        table.appendChild(row);
    }

    //----------------------------------
    // Info-popup
    //----------------------------------

    table
        .querySelectorAll(
            ".detail-info-button"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                event => {
                    event.stopPropagation();

                    const popup =
                        button
                            .closest(
                                ".detail-label-with-info"
                            )
                            ?.querySelector(
                                ".detail-info-popup"
                            );

                    if (!popup) {
                        return;
                    }

                    const shouldOpen =
                        popup.hidden;

                    popup.hidden =
                        !shouldOpen;

                    button.setAttribute(
                        "aria-expanded",
                        String(shouldOpen)
                    );
                }
            );
        });

    detail.appendChild(table);
    const householdSection =
    document.createElement("section");

householdSection.className =
    "household-section";

householdSection.innerHTML = `
    <button
        type="button"
        class="household-toggle"
        aria-expanded="false"
    >
        <span>+ Se husstand</span>
        <span aria-hidden="true">▼</span>
    </button>

    <div
        class="household-content"
        hidden
    ></div>
`;

detail.appendChild(
    householdSection
);

const householdButton =
    householdSection.querySelector(
        ".household-toggle"
    );

const householdContent =
    householdSection.querySelector(
        ".household-content"
    );

let householdLoaded = false;

householdButton.addEventListener(
    "click",
    async () => {
        const isOpen =
            householdButton.getAttribute(
                "aria-expanded"
            ) === "true";

        if (isOpen) {
            householdButton.setAttribute(
                "aria-expanded",
                "false"
            );

            householdButton
                .querySelector("span")
                .textContent =
                "+ Se husstand";

            householdContent.hidden = true;
            return;
        }

        householdButton.setAttribute(
            "aria-expanded",
            "true"
        );

        householdButton
            .querySelector("span")
            .textContent =
            "− Skjul husstand";

        householdContent.hidden = false;

        if (householdLoaded) {
            return;
        }

        householdContent.innerHTML = `
            <div class="household-loading">
                Henter husstanden …
            </div>
        `;

        const { data: household, error } =
            await getHousehold(
                data.herregaard_id,
                data.folketaelling_aar
            );

        if (error) {
            console.error(error);

            householdContent.innerHTML = `
                <div class="household-error">
                    Husstanden kunne ikke hentes.
                </div>
            `;

            return;
        }

        renderHousehold(
            householdContent,
            household,
            data.id
        );

        householdLoaded = true;
    }
);
}

export function clearDetail() {
    document
        .querySelectorAll(".result-row.selected")
        .forEach(row => {
            row.classList.remove("selected");
            row.removeAttribute("aria-current");
        });
    const detail =
        document.getElementById("detail");
    if (!detail) return;
    detail.innerHTML = `
        <div class="placeholder">
            Klik på en person for at se alle oplysninger
        </div>
    `;
}
