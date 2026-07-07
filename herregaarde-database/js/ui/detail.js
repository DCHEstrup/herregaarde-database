import { getPerson } from "../supabase.js";

export async function showDetail(id) {
    const { data, error } = await getPerson(id);
    if (error) {
        console.error(error);
        return;
    }

    const detail = document.getElementById("detail");
    detail.innerHTML = "";
    for (const [key, value] of Object.entries(data)) {
        const row = document.createElement("p");
        row.innerHTML =
            `<strong>${key}</strong>: ${value ?? ""}`;
        detail.appendChild(row);
    }
}
