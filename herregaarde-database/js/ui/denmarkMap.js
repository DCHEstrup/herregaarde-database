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
        // Statistik pr. region
        //----------------------------------

        const regionStatistics =
            new Map();

        rows.forEach(row => {

            const count =
                Number(row.count) || 0;

            const percentage =
                total > 0
                    ? count / total * 100
                    : 0;

            regionStatistics.set(
                row.label,
                {
                    count,
                    percentage
                }
            );
        });

        //----------------------------------
        // Find geografiske grænser
        //----------------------------------

        const bounds =
            getGeoJSONBounds(
                geojson
            );

        //----------------------------------
        // SVG
        //----------------------------------

        container.innerHTML = "";
//----------------------------------
// Tooltip
//----------------------------------

const tooltip =
    document.createElement("div");

tooltip.className =
    "denmark-map-tooltip";

tooltip.hidden = true;

container.appendChild(
    tooltip
);
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

        //----------------------------------
        // Tegn kommunerne
        //----------------------------------

        geojson.features.forEach(
            feature => {

                const municipalityName =
                    feature.properties?.navn;

                if (
                    !municipalityName ||
                    !feature.geometry
                ) {
                    return;
                }

                const region =
                    municipalityRegions[
                        municipalityName
                    ] || null;

                const pathData =
                    geometryToPath(
                        feature.geometry,
                        bounds
                    );

                if (!pathData) {
                    return;
                }

                const path =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "path"
                    );

                path.setAttribute(
                    "d",
                    pathData
                );

                path.classList.add(
                    "denmark-municipality"
                );

                path.dataset.municipality =
                    municipalityName;

                //----------------------------------
                // Kommune med region
                //----------------------------------

                if (region) {

                    path.dataset.region =
                        region;
                    path.addEventListener(
    "mouseenter",
    event => {

        highlightRegion(
            container,
            region
        );

        showRegionTooltip(
            event,
            tooltip,
            region,
            regionStatistics,
            total
        );
    }
);

path.addEventListener(
    "mousemove",
    event => {

        moveRegionTooltip(
            event,
            container,
            tooltip
        );
    }
);

path.addEventListener(
    "mouseleave",
    () => {

        clearRegionHighlight(
            container
        );

        hideRegionTooltip(
            tooltip
        );
    }
);

                    const stats =
                        regionStatistics.get(
                            region
                        );

                    const percentage =
                        stats?.percentage || 0;

                    path.style.setProperty(
                        "--region-opacity",
                        getRegionOpacity(
                            percentage
                        )
                    );

                    const title =
                        document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "title"
                        );

                    title.textContent =
                        stats
                            ? `${region}: ${stats.count.toLocaleString(
                                "da-DK"
                            )} personer (${stats.percentage.toLocaleString(
                                "da-DK",
                                {
                                    maximumFractionDigits: 1
                                }
                            )} %)`
                            : region;

                    path.appendChild(
                        title
                    );
                }

                //----------------------------------
                // Kommune uden mapping
                //----------------------------------

                else {
                    path.classList.add(
                        "denmark-municipality-unmapped"
                    );

                    const title =
                        document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "title"
                        );

                    title.textContent =
                        municipalityName;

                    path.appendChild(
                        title
                    );
                }

                svg.appendChild(
                    path
                );
            }
        );

        container.appendChild(svg);
const handleChartHover =
    event => {

        const region =
            event.detail?.region;

        svg
            .querySelectorAll(
                ".denmark-municipality"
            )
            .forEach(path => {

                if (!region) {
                    path.classList.remove(
                        "region-active",
                        "region-dimmed"
                    );

                    return;
                }

                const sameRegion =
                    path.dataset.region ===
                    region;

                path.classList.toggle(
                    "region-active",
                    sameRegion
                );

                path.classList.toggle(
                    "region-dimmed",
                    !sameRegion
                );
            });
    };

document.addEventListener(
    "regionChartHover",
    handleChartHover
);
        //----------------------------------
        // Debug: kommuner uden mapping
        //----------------------------------

        const unmapped =
            geojson.features
                .map(
                    feature =>
                        feature.properties
                            ?.navn
                )
                .filter(Boolean)
                .filter(
                    name =>
                        !municipalityRegions[
                            name
                        ]
                );

        console.log(
            "Kommuner uden kortregion:",
            unmapped
        );

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

//==================================================
// GEOGRAFISKE GRÆNSER
//==================================================

function getGeoJSONBounds(
    geojson
) {
    let minX = Infinity;
    let maxX = -Infinity;

    let minY = Infinity;
    let maxY = -Infinity;

    geojson.features.forEach(
        feature => {

            visitCoordinates(
                feature.geometry
                    ?.coordinates,
                coordinate => {

                    const [
                        longitude,
                        latitude
                    ] = coordinate;

                    minX =
                        Math.min(
                            minX,
                            longitude
                        );

                    maxX =
                        Math.max(
                            maxX,
                            longitude
                        );

                    minY =
                        Math.min(
                            minY,
                            latitude
                        );

                    maxY =
                        Math.max(
                            maxY,
                            latitude
                        );
                }
            );
        }
    );

    return {
        minX,
        maxX,
        minY,
        maxY
    };
}

function visitCoordinates(
    coordinates,
    callback
) {
    if (
        !Array.isArray(
            coordinates
        )
    ) {
        return;
    }

    //----------------------------------
    // Vi har fundet [lon, lat]
    //----------------------------------

    if (
        typeof coordinates[0]
            === "number" &&
        typeof coordinates[1]
            === "number"
    ) {
        callback(
            coordinates
        );

        return;
    }

    //----------------------------------
    // Gå længere ned
    //----------------------------------

    coordinates.forEach(
        child => {
            visitCoordinates(
                child,
                callback
            );
        }
    );
}

//==================================================
// GEOJSON → SVG
//==================================================

function geometryToPath(
    geometry,
    bounds
) {
    if (
        geometry.type ===
        "Polygon"
    ) {
        return polygonToPath(
            geometry.coordinates,
            bounds
        );
    }

    if (
        geometry.type ===
        "MultiPolygon"
    ) {
        return geometry.coordinates
            .map(
                polygon =>
                    polygonToPath(
                        polygon,
                        bounds
                    )
            )
            .join(" ");
    }

    return "";
}

function polygonToPath(
    polygon,
    bounds
) {
    return polygon
        .map(ring => {

            if (!ring.length) {
                return "";
            }

            const points =
                ring.map(
                    coordinate =>
                        projectCoordinate(
                            coordinate,
                            bounds
                        )
                );

            const [
                first,
                ...rest
            ] = points;

            let path =
                `M ${first.x} ${first.y}`;

            rest.forEach(point => {
                path +=
                    ` L ${point.x} ${point.y}`;
            });

            path += " Z";

            return path;
        })
        .join(" ");
}

//==================================================
// PROJEKTION
//==================================================

function projectCoordinate(
    coordinate,
    bounds
) {
    const [
        longitude,
        latitude
    ] = coordinate;

    const width =
        400;

    const height =
        500;

    const padding =
        18;

    const usableWidth =
        width -
        padding * 2;

    const usableHeight =
        height -
        padding * 2;

    const x =
        padding +
        (
            longitude -
            bounds.minX
        ) /
        (
            bounds.maxX -
            bounds.minX
        ) *
        usableWidth;

    /*
     * SVG går nedad på y-aksen,
     * så latitude vendes om.
     */
    const y =
        padding +
        (
            bounds.maxY -
            latitude
        ) /
        (
            bounds.maxY -
            bounds.minY
        ) *
        usableHeight;

    return {
        x:
            x.toFixed(2),

        y:
            y.toFixed(2)
    };
}

//==================================================
// FARVEINTENSITET
//==================================================

function getRegionOpacity(
    percentage
) {
    if (percentage <= 0) {
        return 0.12;
    }

    /*
     * Minimum 25 % synlighed,
     * maksimum 100 %.
     */
    return Math.min(
        1,
        0.25 +
        percentage / 40
    );
}
function highlightRegion(
    container,
    region
) {
    //----------------------------------
    // Fremhæv kort
    //----------------------------------

    container
        .querySelectorAll(
            ".denmark-municipality"
        )
        .forEach(path => {

            const sameRegion =
                path.dataset.region ===
                region;

            path.classList.toggle(
                "region-active",
                sameRegion
            );

            path.classList.toggle(
                "region-dimmed",
                !sameRegion
            );
        });

    //----------------------------------
    // Fortæl resten af siden
    //----------------------------------

    document.dispatchEvent(
        new CustomEvent(
            "regionMapHover",
            {
                detail: {
                    region
                }
            }
        )
    );
}


function clearRegionHighlight(
    container
) {
    container
        .querySelectorAll(
            ".denmark-municipality"
        )
        .forEach(path => {

            path.classList.remove(
                "region-active",
                "region-dimmed"
            );
        });

    document.dispatchEvent(
        new CustomEvent(
            "regionMapHover",
            {
                detail: {
                    region: null
                }
            }
        )
    );
}
