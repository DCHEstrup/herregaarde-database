let expanded = false;
let initialized = false;

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

    content.innerHTML = `
        <p>Folketællinger: ${data.aar.length}</p>
        <p>Køn: ${data.koen.length}</p>
        <p>Civilstand: ${data.civilstand.length}</p>
        <p>Religion: ${data.trossamfund.length}</p>
    `;
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
