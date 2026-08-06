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
    container.appendChild(
    createCivilStatusComparison(
        estates
    )
);
    container.appendChild(
    createBirthplaceComparison(
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
        const totalPeople =
        Number(estate.total) || 1;

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
    Math.min(
        100,
        men / totalPeople * 200
    );

const womenWidth =
    Math.min(
        100,
        women / totalPeople * 200
    );

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
function createCivilStatusComparison(
    estates
) {
    const section =
        document.createElement("section");

    section.className =
        "civil-status-comparison";

    const heading =
        document.createElement("h3");

    heading.textContent =
        "Civilstand";

    section.appendChild(heading);

    const description =
        document.createElement("p");

    description.className =
        "civil-status-description";

    description.textContent =
        "Fordelingen viser civilstandenes andel af personerne på hver herregård.";

    section.appendChild(description);

    //----------------------------------
    // Find alle civilstande
    //----------------------------------

    const categories = [
        ...new Set(
            estates.flatMap(
                estate =>
                    estate.civilstand
                        ?.map(item =>
                            String(
                                item.label
                            )
                        ) || []
            )
        )
    ];

    /*
     * Sortér kategorier efter deres
     * samlede antal på begge herregårde.
     */
    categories.sort((a, b) => {
        const totalA =
            getCombinedCategoryCount(
                estates,
                "civilstand",
                a
            );

        const totalB =
            getCombinedCategoryCount(
                estates,
                "civilstand",
                b
            );

        return totalB - totalA;
    });

    //----------------------------------
    // Farveklasse pr. kategori
    //----------------------------------

    const categoryClasses =
        new Map();

    categories.forEach(
        (category, index) => {
            categoryClasses.set(
                category,
                `civil-status-color-${
                    index % 8
                }`
            );
        }
    );

    //----------------------------------
    // Bjælker
    //----------------------------------

    const chart =
        document.createElement("div");

    chart.className =
        "civil-status-chart";

    estates.forEach(estate => {
        chart.appendChild(
            createCivilStatusEstateRow(
                estate,
                categories,
                categoryClasses
            )
        );
    });

    section.appendChild(chart);

    //----------------------------------
    // Forklaring
    //----------------------------------

    section.appendChild(
        createCivilStatusLegend(
            estates,
            categories,
            categoryClasses
        )
    );

    return section;
}
function createCivilStatusEstateRow(
    estate,
    categories,
    categoryClasses
) {
    const wrapper =
        document.createElement("article");

    wrapper.className =
        "civil-status-estate";

    const title =
        document.createElement("h4");

    title.textContent =
        estate.herregaard;

    wrapper.appendChild(title);

    const total =
        estate.civilstand?.reduce(
            (sum, item) =>
                sum +
                (Number(item.count) || 0),
            0
        ) || 0;

    const bar =
        document.createElement("div");

    bar.className =
        "civil-status-stacked-bar";

    bar.setAttribute(
        "aria-label",
        `Civilstandsfordeling for ${estate.herregaard}`
    );

    categories.forEach(category => {
        const count =
            getCategoryCount(
                estate,
                "civilstand",
                category
            );

        if (count === 0 || total === 0) {
            return;
        }

        const percentage =
            count / total * 100;

        const segment =
            document.createElement("div");

        segment.className = `
            civil-status-segment
            ${categoryClasses.get(category)}
        `;

        segment.style.width =
            `${percentage}%`;

        segment.title =
            `${category}: ${formatNumber(count)} personer (${formatPercentage(percentage)})`;

        if (percentage >= 9) {
            const text =
                document.createElement("span");

            text.textContent =
                formatPercentage(
                    percentage
                );

            segment.appendChild(text);
        }

        bar.appendChild(segment);
    });

    wrapper.appendChild(bar);

    const totalText =
        document.createElement("p");

    totalText.className =
        "civil-status-total";

    totalText.textContent =
        `${formatNumber(total)} personer med registreret civilstand`;

    wrapper.appendChild(totalText);

    return wrapper;
}
function createCivilStatusLegend(
    estates,
    categories,
    categoryClasses
) {
    const legend =
        document.createElement("div");

    legend.className =
        "civil-status-legend";

    categories.forEach(category => {
        const item =
            document.createElement("div");

        item.className =
            "civil-status-legend-item";

        const header =
            document.createElement("div");

        header.className =
            "civil-status-legend-header";

        header.innerHTML = `
            <span
                class="civil-status-swatch
                ${categoryClasses.get(category)}">
            </span>

            <strong></strong>
        `;

        header.querySelector("strong")
            .textContent =
                category;

        item.appendChild(header);

        estates.forEach(estate => {
            const count =
                getCategoryCount(
                    estate,
                    "civilstand",
                    category
                );

            const total =
                estate.civilstand?.reduce(
                    (sum, row) =>
                        sum +
                        (
                            Number(
                                row.count
                            ) || 0
                        ),
                    0
                ) || 0;

            const percentage =
                total > 0
                    ? count / total * 100
                    : 0;

            const value =
                document.createElement("div");

            value.className =
                "civil-status-legend-value";

            const estateName =
                document.createElement("span");

            estateName.textContent =
                estate.herregaard;

            const numbers =
                document.createElement("span");

            numbers.textContent =
                `${formatNumber(count)} · ${formatPercentage(percentage)}`;

            value.append(
                estateName,
                numbers
            );

            item.appendChild(value);
        });

        legend.appendChild(item);
    });

    return legend;
}
function getCategoryCount(
    estate,
    key,
    category
) {
    return Number(
        estate[key]
            ?.find(
                item =>
                    String(item.label) ===
                    String(category)
            )
            ?.count
    ) || 0;
}

function getCombinedCategoryCount(
    estates,
    key,
    category
) {
    return estates.reduce(
        (sum, estate) =>
            sum +
            getCategoryCount(
                estate,
                key,
                category
            ),
        0
    );
}

function formatPercentage(value) {
    return `${value.toLocaleString(
        "da-DK",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1
        }
    )} %`;
}
function createBirthplaceComparison(
    estates
) {
    const section =
        document.createElement("section");

    section.className =
        "birthplace-comparison";

    const heading =
        document.createElement("h3");

    heading.textContent =
        "Fødested";

    section.appendChild(heading);

    const description =
        document.createElement("p");

    description.className =
        "birthplace-description";

    description.textContent =
        "Fødested er primært registreret fra folketællingerne 1850 og 1860. Klik på et amt eller område for at se de enkelte sogne og steder.";

    section.appendChild(description);

    //----------------------------------
    // Datadækning
    //----------------------------------

    section.appendChild(
        createBirthplaceCoverage(
            estates
        )
    );

    //----------------------------------
    // Område til den interaktive graf
    //----------------------------------

    const chartContainer =
        document.createElement("div");

    chartContainer.className =
        "birthplace-chart-container";

    section.appendChild(
        chartContainer
    );

    renderBirthplaceGroups(
        chartContainer,
        estates
    );

    return section;
}
function createBirthplaceCoverage(
    estates
) {
    const wrapper =
        document.createElement("div");

    wrapper.className =
        "birthplace-coverage";

    estates.forEach(estate => {
        const coverage =
            estate.foedestedDaekning || {};

        const eligible =
            Number(
                coverage.eligible
            ) || 0;

        const registered =
            Number(
                coverage.registered
            ) || 0;

        const percentage =
            eligible > 0
                ? registered /
                    eligible *
                    100
                : 0;

        const card =
            document.createElement("article");

        card.className =
            "birthplace-coverage-card";

        const title =
            document.createElement("h4");

        title.textContent =
            estate.herregaard;

        const text =
            document.createElement("p");

        if (eligible === 0) {
            text.textContent =
                "Ingen relevante registreringer fra 1850 eller senere.";
        }
        else {
            text.textContent =
                `${formatNumber(
                    registered
                )} af ${formatNumber(
                    eligible
                )} relevante personer har et registreret fødested (${formatPercentage(
                    percentage
                )}).`;
        }

        const track =
            document.createElement("div");

        track.className =
            "birthplace-coverage-track";

        const fill =
            document.createElement("div");

        fill.className =
            "birthplace-coverage-fill";

        fill.style.width =
            `${Math.min(
                100,
                percentage
            )}%`;

        track.appendChild(fill);

        card.append(
            title,
            text,
            track
        );

        wrapper.appendChild(card);
    });

    return wrapper;
}
function renderBirthplaceGroups(
    container,
    estates
) {
    container.innerHTML = "";

    const toolbar =
        document.createElement("div");

    toolbar.className =
        "birthplace-toolbar";

    const title =
        document.createElement("h4");

    title.textContent =
        "Fordeling efter amt og område";

    toolbar.appendChild(title);

    container.appendChild(toolbar);

    //----------------------------------
    // Alle grupper fra begge gårde
    //----------------------------------

    const groups = [
        ...new Set(
            estates.flatMap(
                estate =>
                    estate.foedesteder
                        ?.map(
                            item =>
                                item.gruppe
                        ) || []
            )
        )
    ];

    /*
     * Sortér efter det samlede antal
     * på begge herregårde.
     */
    groups.sort((a, b) => {
        const countA =
            getCombinedBirthplaceGroupCount(
                estates,
                a
            );

        const countB =
            getCombinedBirthplaceGroupCount(
                estates,
                b
            );

        return countB - countA;
    });

    if (groups.length === 0) {
        container.innerHTML += `
            <div class="birthplace-empty">
                Ingen klassificerede fødesteder blev fundet.
            </div>
        `;

        return;
    }

    const list =
        document.createElement("div");

    list.className =
        "birthplace-group-list";

    groups.forEach(groupName => {
        list.appendChild(
            createBirthplaceGroupRow(
                estates,
                groupName,
                container
            )
        );
    });

    container.appendChild(list);
}
function createBirthplaceGroupRow(
    estates,
    groupName,
    container
) {
    const row =
        document.createElement("button");

    row.type = "button";
    row.className =
        "birthplace-group-row";

    const label =
        document.createElement("span");

    label.className =
        "birthplace-group-label";

    label.textContent =
        groupName;

    const values =
        document.createElement("span");

    values.className =
        "birthplace-group-values";

    const maximum =
        Math.max(
            1,
            ...estates.map(
                estate =>
                    getBirthplaceGroupCount(
                        estate,
                        groupName
                    )
            )
        );

    estates.forEach(estate => {
        const count =
            getBirthplaceGroupCount(
                estate,
                groupName
            );

        const estateRow =
            document.createElement("span");

        estateRow.className =
            "birthplace-estate-value";

        const estateName =
            document.createElement("span");

        estateName.className =
            "birthplace-estate-name";

        estateName.textContent =
            estate.herregaard;

        const track =
            document.createElement("span");

        track.className =
            "birthplace-bar-track";

        const fill =
            document.createElement("span");

        fill.className =
            "birthplace-bar-fill";

        fill.style.width =
            `${count / maximum * 100}%`;

        track.appendChild(fill);

        const number =
            document.createElement("strong");

        number.textContent =
            formatNumber(count);

        estateRow.append(
            estateName,
            track,
            number
        );

        values.appendChild(
            estateRow
        );
    });

    const arrow =
        document.createElement("span");

    arrow.className =
        "birthplace-group-arrow";

    arrow.textContent = "›";

    row.append(
        label,
        values,
        arrow
    );

    row.addEventListener(
        "click",
        () => {
            renderBirthplaceSubgroups(
                container,
                estates,
                groupName
            );
        }
    );

    return row;
}
function renderBirthplaceSubgroups(
    container,
    estates,
    groupName
) {
    container.innerHTML = "";

    const toolbar =
        document.createElement("div");

    toolbar.className =
        "birthplace-toolbar";

    const backButton =
        document.createElement("button");

    backButton.type = "button";
    backButton.className =
        "birthplace-back-button";

    backButton.textContent =
        "← Tilbage til alle områder";

    backButton.addEventListener(
        "click",
        () => {
            renderBirthplaceGroups(
                container,
                estates
            );
        }
    );

    const title =
        document.createElement("h4");

    title.textContent =
        groupName;

    toolbar.append(
        backButton,
        title
    );

    container.appendChild(toolbar);

    //----------------------------------
    // Find alle undergrupper
    //----------------------------------

    const subgroups = [
        ...new Set(
            estates.flatMap(
                estate =>
                    getBirthplaceGroup(
                        estate,
                        groupName
                    )
                        ?.undergrupper
                        ?.map(
                            item =>
                                item.label
                        ) || []
            )
        )
    ];

    subgroups.sort((a, b) => {
        const countA =
            getCombinedBirthplaceSubgroupCount(
                estates,
                groupName,
                a
            );

        const countB =
            getCombinedBirthplaceSubgroupCount(
                estates,
                groupName,
                b
            );

        return countB - countA;
    });

    const list =
        document.createElement("div");

    list.className =
        "birthplace-subgroup-list";

    subgroups.forEach(
        subgroupName => {
            list.appendChild(
                createBirthplaceSubgroupRow(
                    estates,
                    groupName,
                    subgroupName
                )
            );
        }
    );

    container.appendChild(list);
}
function createBirthplaceSubgroupRow(
    estates,
    groupName,
    subgroupName
) {
    const row =
        document.createElement("div");

    row.className =
        "birthplace-subgroup-row";

    const label =
        document.createElement("div");

    label.className =
        "birthplace-subgroup-label";

    label.textContent =
        subgroupName;

    row.appendChild(label);

    const values =
        document.createElement("div");

    values.className =
        "birthplace-subgroup-values";

    const maximum =
        Math.max(
            1,
            ...estates.map(
                estate =>
                    getBirthplaceSubgroupCount(
                        estate,
                        groupName,
                        subgroupName
                    )
            )
        );

    estates.forEach(estate => {
        const count =
            getBirthplaceSubgroupCount(
                estate,
                groupName,
                subgroupName
            );

        const estateRow =
            document.createElement("div");

        estateRow.className =
            "birthplace-estate-value";

        const estateName =
            document.createElement("span");

        estateName.className =
            "birthplace-estate-name";

        estateName.textContent =
            estate.herregaard;

        const track =
            document.createElement("span");

        track.className =
            "birthplace-bar-track";

        const fill =
            document.createElement("span");

        fill.className =
            "birthplace-bar-fill";

        fill.style.width =
            `${count / maximum * 100}%`;

        track.appendChild(fill);

        const number =
            document.createElement("strong");

        number.textContent =
            formatNumber(count);

        estateRow.append(
            estateName,
            track,
            number
        );

        values.appendChild(
            estateRow
        );
    });

    row.appendChild(values);

    return row;
}
function getBirthplaceGroup(
    estate,
    groupName
) {
    return estate.foedesteder
        ?.find(
            item =>
                String(item.gruppe) ===
                String(groupName)
        ) || null;
}

function getBirthplaceGroupCount(
    estate,
    groupName
) {
    return Number(
        getBirthplaceGroup(
            estate,
            groupName
        )?.count
    ) || 0;
}

function getCombinedBirthplaceGroupCount(
    estates,
    groupName
) {
    return estates.reduce(
        (sum, estate) =>
            sum +
            getBirthplaceGroupCount(
                estate,
                groupName
            ),
        0
    );
}

function getBirthplaceSubgroupCount(
    estate,
    groupName,
    subgroupName
) {
    const group =
        getBirthplaceGroup(
            estate,
            groupName
        );

    return Number(
        group
            ?.undergrupper
            ?.find(
                item =>
                    String(item.label) ===
                    String(subgroupName)
            )
            ?.count
    ) || 0;
}

function getCombinedBirthplaceSubgroupCount(
    estates,
    groupName,
    subgroupName
) {
    return estates.reduce(
        (sum, estate) =>
            sum +
            getBirthplaceSubgroupCount(
                estate,
                groupName,
                subgroupName
            ),
        0
    );
}
