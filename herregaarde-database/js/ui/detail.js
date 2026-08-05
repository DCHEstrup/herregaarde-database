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
function renderHousehold(
    container,
    people,
    currentPersonId
) {
    container.innerHTML = "";

    if (
        !Array.isArray(people) ||
        people.length === 0
    ) {
        container.innerHTML = `
            <div class="household-empty">
                Ingen medlemmer blev fundet.
            </div>
        `;
        return;
    }

    const count =
        document.createElement("p");

    count.className =
        "household-count";

    count.textContent =
        `${people.length.toLocaleString("da-DK")} personer`;

    container.appendChild(count);

    const list =
        document.createElement("div");

    list.className =
        "household-list";

    people.forEach(person => {
        const item =
            document.createElement("button");

        item.type = "button";
        item.className =
            "household-person";

        if (
            String(person.id) ===
            String(currentPersonId)
        ) {
            item.classList.add(
                "current"
            );
        }

        item.innerHTML = `
            <span class="household-person-name">
                ${person.navn || "Ukendt"}
            </span>

            <span class="household-person-meta">
                ${person.alder ?? "?"} år
                · ${person.koen ?? "Ukendt"}
            </span>

            <span class="household-person-job">
                ${
                    person.arbejde_titel ||
                    person.position_i_husstanden ||
                    "Ingen betegnelse"
                }
            </span>
        `;

        item.addEventListener(
            "click",
            () => {
                showDetail(person.id);
            }
        );

        list.appendChild(item);
    });

    container.appendChild(list);
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
