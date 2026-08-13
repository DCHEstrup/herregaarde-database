import { municipalityRegions } from "../data/municipalityRegions.js";

const REGION_NAMES = [
    "Hovedstaden",
    "Midtjylland",
    "Nordjylland",
    "Sjælland",
    "Sjælland; Lolland/Falster/Møn",
    "Syddanmark; Fyn og øer",
    "Syddanmark; Syd- og Sønderjylland"
];

export function createDenmarkRegionMap(
    rows = [],
    total = 0
) {
    const container =
        document.createElement("div");

    container.className =
        "denmark-region-map";

    container.innerHTML = `
        <div class="denmark-map-loading">
            Henter Danmarkskort …
        </div>
    `;

    loadMap(
        container,
        rows,
        total
    );

    return container;
}


async function loadMap(
    container,
    rows,
    total
) {
    try {
        //----------------------------------
        // Hent GeoJSON
        //----------------------------------

        const response =
            await fetch(
                "./data/denmark-municipalities.geojson"
            );

        if (!response.ok) {
            throw new Error(
                `Kunne ikke hente kortdata: ${response.status}`
            );
        }

        const geojson =
            await response.json();

        console.log(
            "Danmark GeoJSON:",
            geojson
        );

        //----------------------------------
        // Kontroller features
        //----------------------------------

        if (
            !Array.isArray(
                geojson.features
            )
        ) {
            throw new Error(
                "GeoJSON indeholder ikke et features-array."
            );
        }

        //----------------------------------
        // Fjern loading
        //----------------------------------

        container.innerHTML = "";

        //----------------------------------
        // SVG
        //----------------------------------

        const svg =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );

        svg.classList.add(
            "denmark-map-svg"
        );

        svg.setAttribute(
            "viewBox",
            "0 0 400 500"
        );

        svg.setAttribute(
            "role",
            "img"
        );

        svg.setAttribute(
            "aria-label",
            "Kort over den geografiske fordeling"
        );

        container.appendChild(svg);

        //----------------------------------
        // Midlertidig test af properties
        //----------------------------------

        console.log(
            "Første kommune:",
            geojson.features[0]
        );

        console.log(
            "Properties:",
            geojson.features[0]
                ?.properties
        );

        //----------------------------------
        // Vi tegner kommunerne i næste trin
        //----------------------------------

        const info =
            document.createElement("div");

        info.className =
            "denmark-map-debug";

        info.textContent =
            `${geojson.features.length} geografiske områder hentet`;

        container.appendChild(info);
    }
    catch (error) {
        console.error(
            "Fejl ved Danmarkskort:",
            error
        );

        container.innerHTML = `
            <div class="denmark-map-error">
                Danmarkskortet kunne ikke indlæses.
            </div>
        `;
    }
}
