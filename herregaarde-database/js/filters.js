import { supabase } from "./supabase.js";
import {
    getHerregaarde,
    getFolketaellinger,
    getKoen
} from "./supabase.js";

export async function loadFilters() {

    const herregaarde = await getHerregaarde();
    const aar = await getFolketaellinger();
    const koen = await getKoen();

    fillSelect(
        "herregaard",
        herregaarde.data,
        "Alle herregårde"
    );

    fillSelect(
        "aar",
        aar.data,
        "Alle år"
    );

    fillSelect(
        "koen",
        koen.data,
        "Alle"
    );

}
