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

    title.textContent =
        `📊 Statistik over søgeresultatet (${data.total.toLocaleString("da-DK")} personer)`;

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
    updatePanel();
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
