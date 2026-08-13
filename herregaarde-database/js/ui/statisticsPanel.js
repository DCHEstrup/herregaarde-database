let expanded = false;
let initialized = false;

function createSection(
    title,
    rows,
    {
        showPercent = false
    } = {}
) {
    const section =
        document.createElement("section");
    section.className =
        "statistics-section";
    const heading =
        document.createElement("h3");
    heading.textContent =
        title;
    section.appendChild(heading);
    const max =
        Math.max(...rows.map(r => r.count));
    const total =
        rows.reduce(
            (sum, row) => sum + row.count,
            0
        );
    rows.forEach(row => {
        section.appendChild(
            createRow(
                row,
                max,
                total,
                showPercent
            )
        );
    });
    return section;
}
function createRow(
    row,
    max,
    total,
    showPercent
) {
    const wrapper =
        document.createElement("div");
    wrapper.className =
        "statistics-row";
const width =
    showPercent
        ? row.count / total * 100
        : row.count / max * 100;
const percent =
    Math.round(row.count / total * 100);
const value =
    showPercent
        ? `${row.count.toLocaleString("da-DK")} (${percent}%)`
        : row.count.toLocaleString("da-DK");
    wrapper.innerHTML = `
        <div class="statistics-label">
            ${row.label}
        </div>
        <div class="statistics-bar">
            <div
                class="statistics-fill"
                style="width:${width}%">
            </div>
        </div>
        <div class="statistics-value">
            ${value}
        </div>
    `;
    return wrapper;
}

function createAgeChart(rows = []) {
    const section =
        document.createElement("section");
    section.className =
        "statistics-section statistics-age-section";
    const heading =
        document.createElement("h3");
    heading.textContent =
        "Aldersfordeling";
    section.appendChild(heading);
    if (!rows.length) {
        const empty =
            document.createElement("p");
        empty.className =
            "statistics-empty";
        empty.textContent =
            "Der er ingen aldersoplysninger for søgeresultatet.";
        section.appendChild(empty);
        return section;
    }
    const max =
        Math.max(
            ...rows.map(row => Number(row.count) || 0),
            1
        );
    const chart =
        document.createElement("div");
    chart.className =
        "age-chart";
    rows.forEach(row => {
        const count =
            Number(row.count) || 0;
        const height =
            count / max * 100;
        const column =
            document.createElement("div");
        column.className =
            "age-chart-column";
        const value =
            document.createElement("div");
        value.className =
            "age-chart-value";
        value.textContent =
            count.toLocaleString("da-DK");
        const barWrapper =
            document.createElement("div");
        barWrapper.className =
            "age-chart-bar-wrapper";
        const bar =
            document.createElement("div");
        bar.className =
            "age-chart-bar";
        bar.style.height =
            `${height}%`;
        bar.title =
            `${row.label}: ${count.toLocaleString("da-DK")} personer`;
        const label =
            document.createElement("div");
        label.className =
            "age-chart-label";
        label.textContent =
            row.label;
        barWrapper.appendChild(bar);
        column.append(
            value,
            barWrapper,
            label
        );
        chart.appendChild(column);
    });
    section.appendChild(chart);
    return section;
}
function createRegionDistribution(
    rows = [],
    total = 0
) {
    const section =
        document.createElement("section");

    section.className =
        "statistics-section statistics-region-section";

    const heading =
        document.createElement("h3");

    heading.textContent =
        "Geografisk fordeling";

    section.appendChild(heading);

    const description =
        document.createElement("p");

    description.className =
        "statistics-region-description";

    description.textContent =
        "Personernes fordeling efter herregårdens geografiske placering.";

    section.appendChild(description);

    if (!rows.length) {
        const empty =
            document.createElement("p");

        empty.className =
            "statistics-empty";

        empty.textContent =
            "Der er ingen regionsoplysninger for søgeresultatet.";

        section.appendChild(empty);

        return section;
    }

    //----------------------------------
    // Layout
    //----------------------------------

    const layout =
        document.createElement("div");

    layout.className =
        "statistics-region-layout";

    //----------------------------------
    // Kortområde
    //----------------------------------

const map =
    createDenmarkRegionMap(
        rows,
        total
    );

layout.appendChild(map);

    //----------------------------------
    // Søjler
    //----------------------------------

    const chart =
        document.createElement("div");

    chart.className =
        "statistics-region-chart";

    rows.forEach(row => {

        const count =
            Number(row.count) || 0;

        const percentage =
            total > 0
                ? count / total * 100
                : 0;

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "statistics-region-row";

        wrapper.dataset.region =
            row.label;

        const label =
            document.createElement("div");

        label.className =
            "statistics-region-label";

        label.textContent =
            row.label;

        const barLine =
            document.createElement("div");

        barLine.className =
            "statistics-region-bar-line";

        const track =
            document.createElement("div");

        track.className =
            "statistics-region-track";

        const fill =
            document.createElement("div");

        fill.className =
            "statistics-region-fill";

        fill.style.width =
            `${percentage}%`;

        track.appendChild(fill);

        const value =
            document.createElement("div");

        value.className =
            "statistics-region-value";

        value.textContent =
            `${count.toLocaleString("da-DK")} (${Math.round(
                percentage
            )}%)`;

        barLine.append(
            track,
            value
        );

        wrapper.append(
            label,
            barLine
        );

        chart.appendChild(
            wrapper
        );
    });

    layout.appendChild(chart);

    section.appendChild(layout);

    return section;
}

export function renderStatistics(data) {
    const title =
        document.getElementById("statisticsTitle");
    const toggle =
        document.getElementById("statisticsToggle");
    const content =
        document.getElementById("statisticsContent");

    //----------------------------------
    // Titel
    //----------------------------------

const total =
    Number(data.total) || 0;
const herregaardeCount =
    Number(data.herregaarde_count) || 0;
const folketaellingerCount =
    Number(data.folketaellinger_count) || 0;
title.textContent =
    `📊 Statistik · ` +
    `${total.toLocaleString("da-DK")} personer · ` +
    `${herregaardeCount.toLocaleString("da-DK")} herregårde · ` +
    `${folketaellingerCount.toLocaleString("da-DK")} folketællinger` + 
    ` · (Klik for at udvide)`;

    //----------------------------------
    // Opret click-event én gang
    //----------------------------------

    if (!initialized) {
        toggle.addEventListener(
            "click",
            () => {
                expanded = !expanded;
                updatePanel();
            }
        );
        initialized = true;
    }

    //----------------------------------
    // Midlertidigt indhold
    //----------------------------------

content.innerHTML = "";
content.appendChild(
    createSection(
        "Folketællinger",
        data.aar
    )
);

content.appendChild(
    createSection(
        "Køn",
        data.koen,
        {
            showPercent: true
        }
    )
);

content.appendChild(
    createSection(
        "Civilstand",
        data.civilstand,
        {
            showPercent: true
        }
    )
);

content.appendChild(
    createSection(
        "Religion",
        data.trossamfund,
        {
            showPercent: true
        }
    )
);
    content.appendChild(
    createAgeChart(
        data.alder || []
    )
);
    content.appendChild(
    createRegionDistribution(
        data.region || [],
        total
    )
);
    updatePanel();
}
export function clearStatistics() {
    const title =
        document.getElementById("statisticsTitle");
    const content =
        document.getElementById("statisticsContent");
    const arrow =
        document.getElementById("statisticsArrow");
    title.textContent = "📊 Statistik";
    content.innerHTML = "";
    content.style.display = "none";
    arrow.textContent = "▼";
    expanded = false;
}

function updatePanel() {
    const content =
        document.getElementById("statisticsContent");
    const arrow =
        document.getElementById("statisticsArrow");
    if (expanded) {
        content.style.display = "block";
        arrow.textContent = "▲";
    }
    else {
        content.style.display = "none";
        arrow.textContent = "▼";
    }
}
