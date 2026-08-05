import { compareEstates } from "./supabase.js";

let lastComparisonKey = null;

export async function loadEstateComparison(
    estates
) {
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

    description.textContent =
        `${estates[0]} sammenlignes med ${estates[1]}`;

    const comparisonKey =
        [...estates]
            .sort()
            .join("::");

    /*
     * Undgå nyt RPC-kald, hvis den samme
     * sammenligning allerede vises.
     */
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
            estates
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
        createComparisonChart(
            "Kønsfordeling",
            estates,
            "koen"
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

    const allLabels =
        [
            ...new Set(
                estates.flatMap(
                    estate =>
                        estate[key]
                            ?.map(
                                row =>
                                    String(
                                        row.label
                                    )
                            )
                        || []
                )
            )
        ];

    allLabels.forEach(label => {
        const row =
            document.createElement("div");

        row.className =
            "compare-chart-row";

        const labelElement =
            document.createElement("div");

        labelElement.className =
            "compare-chart-label";

        labelElement.textContent =
            label;

        row.appendChild(
            labelElement
        );

       const valuesContainer =
    document.createElement("div");

valuesContainer.className =
    "compare-chart-values";

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

            bar.innerHTML = `
                <span class="compare-chart-name"></span>

                <div class="compare-chart-track">
                    <div
                        class="compare-chart-fill"
                        style="width:${
                            value /
                            maximum *
                            100
                        }%"
                    ></div>
                </div>

                <strong>
                    ${formatNumber(value)}
                </strong>
            `;

            bar.querySelector(
                ".compare-chart-name"
            ).textContent =
                estate.herregaard;

            valuesContainer.appendChild(bar);
        });
        
    row.appendChild(
        valuesContainer);
    return section;
        

        section.appendChild(row);
    });

    return section;
}

function formatNumber(value) {
    return Number(value || 0)
        .toLocaleString("da-DK");
}
