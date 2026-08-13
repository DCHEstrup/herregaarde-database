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

    const svg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
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

    return container;
}
