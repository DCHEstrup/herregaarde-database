import { getPerson,getHousehold,getPersonalHousehold, getLifeCourseOccurrences } from "../supabase.js";

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
        // Link til herregård
        //----------------------------------
        if (key === "herregaard") {
    th.textContent = label;

    const slug =
        createEstateSlug(
            data[key]
        );

    td.innerHTML = `
        <a
            class="detail-estate-link"
            href="https://www.danskeherregaarde.dk/nutid/${slug}"
            target="_blank"
            rel="noopener noreferrer"
            title="Læs mere om ${data[key]} på Danske Herregårde"
        >
            ${data[key]}
            <span class="external-icon">
                ↗
            </span>
        </a>
    `;
}
        
        //----------------------------------
        // Arbejde som link
        //----------------------------------

        else if (key === "arbejde_titel") {
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
            td.textContent = data[key];
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
            td.textContent = data[key];
        }

        //----------------------------------
        // Almindelige felter
        //----------------------------------

        else {
            th.textContent = label;
            td.textContent = data[key];
        }



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
    //----------------------------------
// Link til livsforløb i Link-Lives
//----------------------------------

if (data.life_course_id !== null && data.life_course_id !== undefined) {

    const lifeCourseSection =
        document.createElement("div");

    lifeCourseSection.className =
        "life-course-section";

    const lifeCourseLink =
        document.createElement("a");

    lifeCourseLink.className =
        "life-course-link";

    lifeCourseLink.href =
        `https://link-lives.dk/#/life-course/3.0-${data.life_course_id}`;

    lifeCourseLink.target =
        "_blank";

    lifeCourseLink.rel =
        "noopener noreferrer";

    lifeCourseLink.innerHTML = `
        <span>Se livsforløb på Link-Lives</span>
        <span class="external-icon">↗</span>
    `;

    lifeCourseSection.appendChild(
        lifeCourseLink
    );

    detail.appendChild(
        lifeCourseSection
    );
}
//----------------------------------
// Forekomster i andre folketællinger
//----------------------------------

if (data.life_course_id !== null && data.life_course_id !== undefined) {

    const {
        data: occurrences,
        error: occurrencesError
    } = await getLifeCourseOccurrences(
        data.life_course_id
    );

    if (occurrencesError) {
        console.error(
            "Kunne ikke hente livsforløb:",
            occurrencesError
        );
    }

    if (
        !occurrencesError &&
        Array.isArray(occurrences) &&
        occurrences.length > 1
    ) {

        const occurrenceSection =
            document.createElement("section");

        occurrenceSection.className =
            "occurrence-section";

        const occurrenceTitle =
            document.createElement("h3");

        occurrenceTitle.className =
            "occurrence-title";

        occurrenceTitle.textContent =
            "Forekomster i databasen";

        occurrenceSection.appendChild(
            occurrenceTitle
        );


        const occurrenceList =
            document.createElement("div");

        occurrenceList.className =
            "occurrence-list";


        occurrences.forEach(occurrence => {

            const item =
                document.createElement("button");

            item.type = "button";

            item.className =
                "occurrence-item";


            //----------------------------------
            // Marker den person man står på
            //----------------------------------

            const isCurrent =
                String(occurrence.id) ===
                String(data.id);

            if (isCurrent) {
                item.classList.add("current");
            }


            //----------------------------------
            // Arbejde / position
            //----------------------------------

            const job =
                occurrence.arbejde_titel ||
                occurrence.position_i_husstanden ||
                "Ingen betegnelse";


            //----------------------------------
            // Indhold
            //----------------------------------

            item.innerHTML = `
                <span class="occurrence-year">
                    ${occurrence.aar ?? "Ukendt år"}
                </span>

                <span class="occurrence-info">

                    <span class="occurrence-estate">
                        ${occurrence.herregaard ?? "Ukendt herregård"}
                    </span>

                    <span class="occurrence-job">
                        ${job}
                    </span>

                </span>

                ${
                    isCurrent
                        ? `<span class="occurrence-current-label">
                            Aktuel
                           </span>`
                        : `<span class="occurrence-arrow">
                            ›
                           </span>`
                }
            `;


            //----------------------------------
            // Klik til anden folketælling
            //----------------------------------

            if (!isCurrent) {

                item.addEventListener(
                    "click",
                    () => {
                        showDetail(
                            occurrence.id
                        );
                    }
                );

            } else {

                item.disabled = true;

            }


            occurrenceList.appendChild(
                item
            );
        });


        occurrenceSection.appendChild(
            occurrenceList
        );

        detail.appendChild(
            occurrenceSection
        );
    }
}
// ===========================
// PERSONLIG HUSSTAND
// ===========================

/*if (
    data.husstands_familienr !== null &&
    data.husstands_familienr !== undefined &&
    data.husstands_familienr !== ""
) {
    const personalHouseholdSection = document.createElement("div");
    personalHouseholdSection.className = "household-section personal-household";

    const personalButton = document.createElement("button");
    personalButton.className = "household-toggle";

    personalButton.innerHTML = `
        <span>+ Se personlig husstand</span>
        <span class="household-arrow">▼</span>
    `;

    const personalContent = document.createElement("div");
    personalContent.className = "household-content";
    personalContent.style.display = "none";

    let personalLoaded = false;

    personalButton.addEventListener("click", async () => {

        const isOpen = personalContent.style.display !== "none";

        if (isOpen) {
            personalContent.style.display = "none";

            personalButton.innerHTML = `
                <span>+ Se personlig husstand</span>
                <span class="household-arrow">▼</span>
            `;

            return;
        }

        personalContent.style.display = "block";

        personalButton.innerHTML = `
            <span>− Skjul personlig husstand</span>
            <span class="household-arrow">▲</span>
        `;

        if (personalLoaded) return;

        personalContent.innerHTML = `
            <div class="household-loading">
                Henter husstand...
            </div>
        `;

        const { data: household, error } =
            await getPersonalHousehold(
                data.herregaard,
                data.folketaelling_aar,
                data.husstands_familienr
            );

        if (error) {
            console.error(error);

            personalContent.innerHTML = `
                <div class="household-error">
                    Kunne ikke hente husstanden.
                </div>
            `;

            return;
        }

        personalContent.innerHTML = "";

        const header = document.createElement("div");
        header.className = "household-header";

        header.textContent =
            `${household.length} personer i personlig husstand`;

        personalContent.appendChild(header);

        const list = document.createElement("div");
        list.className = "household-list";

        household.forEach(person => {

            const item = document.createElement("button");
            item.className = "household-person";

            // Marker den person vi allerede ser på
            if (person.id === data.id) {
                item.classList.add("current-person");
            }

            const age =
                person.alder !== null &&
                person.alder !== undefined
                    ? `${person.alder} år`
                    : "";

            const gender =
                person.koen
                    ? person.koen
                    : "";

            const job =
                person.arbejde_titel ||
                person.position_i_husstanden ||
                "";

            item.innerHTML = `
                <div class="household-person-top">
                    <strong>${person.navn ?? ""}</strong>

                    <span class="household-person-meta">
                        ${age}${age && gender ? " · " : ""}${gender}
                    </span>
                </div>

                ${
                    job
                        ? `<div class="household-person-job">${job}</div>`
                        : ""
                }
            `;

            item.addEventListener("click", () => {
                showDetail(person.id);
            });

            list.appendChild(item);
        });

        personalContent.appendChild(list);

        personalLoaded = true;
    });

    personalHouseholdSection.appendChild(personalButton);
    personalHouseholdSection.appendChild(personalContent);

    detail.appendChild(personalHouseholdSection);
}*/
//----------------------------------
// Husstand
//----------------------------------

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
        <span>+ Se herregårdens fulde husstand</span>
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
                "+ Se herregårdens fulde husstand";

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
            "− Skjul herregårdens fulde husstand";

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
            data.id,
            data.herregaard,
            data.folketaelling_aar
        );

        householdLoaded = true;
    }
);
}
function renderHousehold(
    container,
    people,
    currentPersonId,
    herregaard,
    folketaellingAar
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
           `${people.length.toLocaleString("da-DK")} personer på ${herregaard} (${folketaellingAar})`;

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

    const scroll =
    document.createElement("div");

scroll.className =
    "household-scroll";

scroll.appendChild(list);

container.appendChild(scroll);
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
function createEstateSlug(name) {
    return String(name)
        .trim()
        .toLowerCase()

        // danske bogstaver
        .replace(/æ/g, "ae")
        .replace(/ø/g, "oe")
        .replace(/å/g, "aa")

        // fjern parenteser
        .replace(/[()]/g, "")

        // mellemrum bliver til -
        .replace(/\s+/g, "-")

        // fjern evt. flere bindestreger
        .replace(/-+/g, "-")

        // fjern bindestreg i starten/slutningen
        .replace(/^-|-$/g, "");
}
