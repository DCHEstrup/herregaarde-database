import { compareEstates } from "./supabase.js";

let lastComparisonKey = null;

export async function loadEstateComparison(
    filters
) {
    const estates =
        filters.herregaard;

    const container =
        document.getElementById(
            "compareContent"
        );

    const description =
        document.getElementById(
            "compareDescription"
        );

    if (!container) {
        return;
    }

    if (
        !Array.isArray(estates) ||
        estates.length !== 2
    ) {
        container.innerHTML = `
            <div class="placeholder">
                Vælg præcis to herregårde.
            </div>
        `;

        return;
    }

    renderComparisonDescription(
        description,
        filters
    );

    const comparisonKey =
        JSON.stringify(
            normalizeComparisonFilters(
                filters
            )
        );

    if (
        lastComparisonKey ===
        comparisonKey
    ) {
        return;
    }

    container.innerHTML = `
        <div class="compare-loading">
            Henter sammenligning …
        </div>
    `;

    const { data, error } =
        await compareEstates(
            filters
        );

    if (error) {
        console.error(error);

        container.innerHTML = `
            <div class="compare-error">
                Sammenligningen kunne ikke hentes.
            </div>
        `;

        return;
    }

    renderEstateComparison(
        container,
        data?.estates || []
    );

    lastComparisonKey =
        comparisonKey;
}

function renderEstateComparison(
    container,
    estates
) {
    container.innerHTML = "";

    if (estates.length !== 2) {
        container.innerHTML = `
            <div class="placeholder">
                Der kunne ikke oprettes en sammenligning.
            </div>
        `;

        return;
    }

    const metrics =
        document.createElement("div");

    metrics.className =
        "compare-metrics";

    estates.forEach(estate => {
        const card =
            document.createElement("article");

        card.className =
            "compare-estate-card";

        card.innerHTML = `
            <h3></h3>

            <dl>
                <div>
                    <dt>Personer</dt>
                    <dd>
                        ${formatNumber(
                            estate.total
                        )}
                    </dd>
                </div>

                <div>
                    <dt>Kvinder</dt>
                    <dd>
                        ${formatNumber(
                            estate.kvinder
                        )}
                    </dd>
                </div>

                <div>
                    <dt>Mænd</dt>
                    <dd>
                        ${formatNumber(
                            estate.maend
                        )}
                    </dd>
                </div>

                <div>
                    <dt>Gennemsnitsalder</dt>
                    <dd>
                        ${
                            estate.gennemsnitsalder
                            ?? "Ukendt"
                        }
                    </dd>
                </div>

                <div>
                    <dt>Folketællinger</dt>
                    <dd>
                        ${formatNumber(
                            estate.antalFolketaellinger
                        )}
                    </dd>
                </div>
            </dl>
        `;

        card.querySelector("h3")
            .textContent =
                estate.herregaard;

        metrics.appendChild(card);
    });

    container.appendChild(metrics);

    container.appendChild(
        createComparisonChart(
            "Folketællinger",
            estates,
            "aar"
        )
    );

container.appendChild(
    createDemographicComparison(
        estates
    )
);
}

function createComparisonChart(
    title,
    estates,
    key
) {
    const section =
        document.createElement("section");

    section.className =
        "compare-chart";

    const heading =
        document.createElement("h3");

    heading.textContent =
        title;

    section.appendChild(heading);

    const allLabels = [
        ...new Set(
            estates.flatMap(
                estate =>
                    estate[key]?.map(
                        item =>
                            String(
                                item.label
                            )
                    ) || []
            )
        )
    ];

    allLabels.forEach(label => {
        const row =
            document.createElement("div");

        row.className =
            "compare-chart-row";

        //----------------------------------
        // Kategori, fx 1787 eller K
        //----------------------------------

        const labelElement =
            document.createElement("div");

        labelElement.className =
            "compare-chart-label";

        labelElement.textContent =
            label;

        row.appendChild(
            labelElement
        );

        //----------------------------------
        // Wrapper til begge herregårde
        //----------------------------------

        const valuesContainer =
            document.createElement("div");

        valuesContainer.className =
            "compare-chart-values";

        //----------------------------------
        // Største værdi inden for kategorien
        //----------------------------------

        const maximum =
            Math.max(
                1,
                ...estates.map(
                    estate =>
                        Number(
                            estate[key]
                                ?.find(
                                    item =>
                                        String(
                                            item.label
                                        ) === label
                                )
                                ?.count
                        ) || 0
                )
            );

        //----------------------------------
        // Én bjælke pr. herregård
        //----------------------------------

        estates.forEach(estate => {
            const value =
                Number(
                    estate[key]
                        ?.find(
                            item =>
                                String(
                                    item.label
                                ) === label
                        )
                        ?.count
                ) || 0;

            const bar =
                document.createElement("div");

            bar.className =
                "compare-chart-estate";

            const percentage =
                value / maximum * 100;

            bar.innerHTML = `
                <span
                    class="compare-chart-name">
                </span>

                <div class="compare-chart-track">
                    <div
                        class="compare-chart-fill"
                        style="width:${percentage}%">
                    </div>
                </div>

                <strong>
                    ${formatNumber(value)}
                </strong>
            `;

            bar.querySelector(
                ".compare-chart-name"
            ).textContent =
                estate.herregaard;

            valuesContainer.appendChild(
                bar
            );
        });

        //----------------------------------
        // Saml kategorirækken
        //----------------------------------

        row.appendChild(
            valuesContainer
        );

        section.appendChild(
            row
        );
    });

    return section;
}
function createDemographicComparison(
    estates
) {
    const section =
        document.createElement("section");

    section.className =
        "compare-demography";

    const heading =
        document.createElement("h3");

    heading.textContent =
        "Demografisk fordeling";

    section.appendChild(heading);

    const description =
        document.createElement("p");

    description.className =
        "compare-demography-description";

    description.textContent =
        "Aldersfordeling fordelt på mænd og kvinder. Tallene viser antal personer.";

    section.appendChild(description);

    const grid =
        document.createElement("div");

    grid.className =
        "population-pyramid-grid";

    estates.forEach(estate => {
        grid.appendChild(
            createPopulationPyramid(
                estate
            )
        );
    });

    section.appendChild(grid);

    return section;
}

function createPopulationPyramid(
    estate
) {
    const article =
        document.createElement("article");

    article.className =
        "population-pyramid";

    const title =
        document.createElement("h4");

    title.textContent =
        estate.herregaard;

    article.appendChild(title);

    const columnHeadings =
        document.createElement("div");

    columnHeadings.className =
        "population-pyramid-headings";

    columnHeadings.innerHTML = `
        <span>Mænd</span>
        <span>Alder</span>
        <span>Kvinder</span>
    `;

    article.appendChild(
        columnHeadings
    );

    const data =
        Array.isArray(estate.demografi)
            ? [...estate.demografi]
            : [];

    if (data.length === 0) {
        const empty =
            document.createElement("div");

        empty.className =
            "population-pyramid-empty";

        empty.textContent =
            "Ingen aldersdata tilgængelig.";

        article.appendChild(empty);

        return article;
    }

    /*
     * Højeste alder øverst, så pyramiden
     * læses som en traditionel
     * befolkningspyramide.
     */
    data.sort(
        (a, b) =>
            Number(b.ageStart) -
            Number(a.ageStart)
    );

    const maximum =
        Math.max(
            1,
            ...data.flatMap(row => [
                Number(row.maend) || 0,
                Number(row.kvinder) || 0
            ])
        );

    const rows =
        document.createElement("div");

    rows.className =
        "population-pyramid-rows";

    data.forEach(item => {
        const men =
            Number(item.maend) || 0;

        const women =
            Number(item.kvinder) || 0;

        const menWidth =
            men / maximum * 100;

        const womenWidth =
            women / maximum * 100;

        const row =
            document.createElement("div");

        row.className =
            "population-pyramid-row";

        row.innerHTML = `
            <div class="population-side population-side-men">
                <span class="population-count">
                    ${formatNumber(men)}
                </span>

                <div class="population-track">
                    <div
                        class="population-fill population-fill-men"
                        style="width:${menWidth}%">
                    </div>
                </div>
            </div>

            <div class="population-age">
                ${item.label}
            </div>

            <div class="population-side population-side-women">
                <div class="population-track">
                    <div
                        class="population-fill population-fill-women"
                        style="width:${womenWidth}%">
                    </div>
                </div>

                <span class="population-count">
                    ${formatNumber(women)}
                </span>
            </div>
        `;

        rows.appendChild(row);
    });

    article.appendChild(rows);

    return article;
}

function formatNumber(value) {
    return Number(value || 0)
        .toLocaleString("da-DK");
}
const comparisonFilterLabels = {
    globalSoegning:
        "Fritekst",

    aar:
        "Folketællingsår",

    koen:
        "Køn",

    trossamfund:
        "Religion",

    region:
        "Region",

    kommune:
        "Kommune",

    arbejde:
        "Arbejdssøgning",

    arbejdeValgt:
        "Arbejde / position",

    civilstand:
        "Civilstand",

    handicap:
        "Handicap",

    alderFra:
        "Alder fra",

    alderTil:
        "Alder til",

    transportFra:
        "Transport fra",

    transportTil:
        "Transport til"
};

function renderComparisonDescription(
    container,
    filters
) {
    if (!container) {
        return;
    }

    const [firstEstate, secondEstate] =
        filters.herregaard;

    container.innerHTML = "";

    const mainText =
        document.createElement("span");

    mainText.className =
        "compare-description-main";

    mainText.textContent =
        `${firstEstate} sammenlignes med ${secondEstate}`;

    container.appendChild(mainText);

    const activeFilters =
        getActiveComparisonFilters(
            filters
        );

    if (activeFilters.length === 0) {
        const allData =
            document.createElement("span");

        allData.className =
            "compare-description-empty";

        allData.textContent =
            "Alle registreringer er medtaget.";

        container.appendChild(allData);

        return;
    }

    const label =
        document.createElement("span");

    label.className =
        "compare-description-label";

    label.textContent =
        "Ekstra filtre:";

    container.appendChild(label);

    const list =
        document.createElement("span");

    list.className =
        "compare-description-filters";

    activeFilters.forEach(filter => {
        const item =
            document.createElement("span");

        item.className =
            "compare-description-filter";

        item.textContent =
            `${filter.label}: ${filter.value}`;

        list.appendChild(item);
    });

    container.appendChild(list);
}

function getActiveComparisonFilters(
    filters
) {
    const ignoredKeys =
        new Set([
            "herregaard",
            "sortColumn",
            "sortDirection",
            "page",
            "pageSize"
        ]);

    return Object.entries(filters)
        .filter(([key, value]) => {
            if (ignoredKeys.has(key)) {
                return false;
            }

            return !isEmptyFilter(value);
        })
        .map(([key, value]) => ({
            label:
                comparisonFilterLabels[key]
                || key,

            value:
                formatComparisonFilterValue(
                    key,
                    value
                )
        }));
}

function formatComparisonFilterValue(
    key,
    value
) {
    if (Array.isArray(value)) {
        return value.join(", ");
    }

    if (
        key === "transportFra" ||
        key === "transportTil"
    ) {
        return `${value} km`;
    }

    return String(value);
}
function normalizeComparisonFilters(filters) {
    return {
        herregaard:
            [...(filters.herregaard || [])]
                .sort(),

        aar:
            [...(filters.aar || [])]
                .map(Number)
                .sort((a, b) => a - b),

        koen:
            [...(filters.koen || [])]
                .sort(),

        trossamfund:
            [...(filters.trossamfund || [])]
                .sort(),

        region:
            [...(filters.region || [])]
                .sort(),

        kommune:
            [...(filters.kommune || [])]
                .sort(),

        arbejde:
            filters.arbejde || null,

        arbejdeValgt:
            [...(filters.arbejdeValgt || [])]
                .sort(),

        civilstand:
            [...(filters.civilstand || [])]
                .sort(),

        handicap:
            [...(filters.handicap || [])]
                .sort(),

        alderFra:
            filters.alderFra ?? null,

        alderTil:
            filters.alderTil ?? null,

        transportFra:
            filters.transportFra ?? null,

        transportTil:
            filters.transportTil ?? null,

        globalSoegning:
            filters.globalSoegning || null
    };
}
function isEmptyFilter(value) {
    return (
        value == null ||
        value === "" ||
        (
            Array.isArray(value) &&
            value.length === 0
        )
    );
}
