export function clearResults() {

    //----------------------------------
    // Resultatliste
    //----------------------------------

    document.getElementById("results").innerHTML = `
        <div class="placeholder">
            Ingen søgeresultater endnu
        </div>
    `;

    //----------------------------------
    // Persondetaljer
    //----------------------------------

    document.getElementById("detail").innerHTML = `
        <div class="placeholder">
            Klik på en person for at se alle oplysninger
        </div>
    `;

    //----------------------------------
    // Pagination
    //----------------------------------

    document.getElementById("pagination").innerHTML = "";

    //----------------------------------
    // Antal resultater
    //----------------------------------

    document.getElementById("resultCount").textContent =
        'Vælg filtre og tryk "Søg"';

    //----------------------------------
    // Download-knap
    //----------------------------------

    document.getElementById("downloadBtn").disabled = true;

}
