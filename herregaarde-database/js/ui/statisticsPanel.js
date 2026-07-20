let expanded = false;
let initialized = false;

function createSection(title, rows) {

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
    rows.forEach(row => {
        section.appendChild(
            createRow(
                row,
                max
            )
        );
    });
    return section;
}
function createRow(row, max) {
    const wrapper =
        document.createElement("div");
    wrapper.className =
        "statistics-row";
    const percent =
        (row.count / max) * 100;
    wrapper.innerHTML = `
        <div class="statistics-label">
            ${row.label}
        </div>
        <div class="statistics-bar">
            <div
                class="statistics-fill"
                style="width:${percent}%">
            </div>
        </div>
        <div class="statistics-value">
            ${row.count.toLocaleString("da-DK")}
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
        data.koen
    )
);
content.appendChild(
    createSection(
        "Civilstand",
        data.civilstand
    )
);
content.appendChild(
    createSection(
        "Religion",
        data.trossamfund
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
