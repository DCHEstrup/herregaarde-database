import { getSelectedValues } from "./ui/multiselectV2.js";

export function getCurrentFilters() {
    return {
        herregaard:
            getSelectedValues("herregaard"),
        aar:
            getSelectedValues("aar"),
        koen:
            getSelectedValues("koen"),
        trossamfund:
            getSelectedValues("trossamfund"),
        kommune:
            document.getElementById("kommune")?.value || null,
        arbejde:
            document.getElementById("arbejde")?.value.trim() || null,
        civilstand:
            getSelectedValues("civilstand")
    };
}
