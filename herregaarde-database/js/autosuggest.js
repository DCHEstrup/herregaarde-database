export function enableAutosuggest(inputId, fetchSuggestions) {
    const input = document.getElementById(inputId);
    if (!input) return;

    //--------------------------------------------------
    // Opret dropdown
    //--------------------------------------------------

    const list = document.createElement("div");
    list.className = "autosuggest-list";
    input.parentNode.appendChild(list);

    //--------------------------------------------------
    // Debounce
    //--------------------------------------------------

    let timeout;
    input.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            const query = input.value.trim();
            if (query.length < 2) {
                list.innerHTML = "";
                list.style.display = "none";
                return;
            }
            const { data, error } =
                await fetchSuggestions(query);
            if (error) {
                console.error(error);
                return;
            }
            renderSuggestions(data);
        }, 250);
    });

    //--------------------------------------------------
    // Vis forslag
    //--------------------------------------------------

    function renderSuggestions(data) {
        list.innerHTML = "";
        if (!data || data.length === 0) {
            list.style.display = "none";
            return;
        }

        data.forEach(item => {
            const option =
                document.createElement("div");
            option.className =
                "autosuggest-item";
            option.textContent =
                item.suggestion;
            option.addEventListener("click", () => {
                input.value = item.suggestion;
                list.innerHTML = "";
                list.style.display = "none";
            });
            list.appendChild(option);
        });
        list.style.display = "block";
    }

    //--------------------------------------------------
    // Luk ved klik udenfor
    //--------------------------------------------------

    document.addEventListener("click", e => {
        if (!list.contains(e.target) &&
            e.target !== input) {
            list.style.display = "none";
        }
    });
}
