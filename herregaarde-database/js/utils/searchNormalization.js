export function normalizeDanishSearch(value) {
    return String(value ?? "")
        .toLowerCase()
        .replaceAll("å", "aa");
}
