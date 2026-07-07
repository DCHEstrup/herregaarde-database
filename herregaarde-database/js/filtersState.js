export function getCurrentFilters() {
    return {
        herregaard:
            document.getElementById("herregaard").value || null,
        aar:
            document.getElementById("aar").value || null,
        koen:
            document.getElementById("koen").value || null,
        region:
            document.getElementById("region")?.value || null,
        kommune:
            document.getElementById("kommune")?.value || null,
        arbejde_titel:
            document.getElementById("arbejde_titel")?.value || null,
        position_i_husstanden:
            document.getElementById("position_i_husstanden")?.value || null,
        civilstand:
            document.getElementById("civilstand")?.value || null

    };

}
