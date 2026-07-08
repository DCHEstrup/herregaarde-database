export function enableAutosuggest(inputId, fetchSuggestions) {
    const input = document.getElementById(inputId);
    if (!input) return;

    //--------------------------------------------------
    // Opret dropdown
    //--------------------------------------------------

   const list =
    document.getElementById(
        inputId + "Suggestions"
    );

    //--------------------------------------------------
    // Debounce
    //--------------------------------------------------

    let timeout;
    let selectedIndex =-1;
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
        selectedIndex = -1;
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
    function updateSelection(items) {
        console.log("Valgt:", selectedIndex);
    items.forEach(item =>
        item.classList.remove("selected")
    );
    if (selectedIndex >= 0) {
        items[selectedIndex]
            .classList.add("selected");
        items[selectedIndex]
            .scrollIntoView({
                block: "nearest"
            });
    }
}

//--------------------------------------------------
// Tastaturstyring
//--------------------------------------------------

input.addEventListener("keydown", (e) => {
    const items =
        list.querySelectorAll(".autosuggest-item");
    if (items.length === 0) return;

    //--------------------------------------
    // Pil ned
    //--------------------------------------

    if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex =
            Math.min(
                selectedIndex + 1,
                items.length - 1
            );
        updateSelection(items);
    }

    //--------------------------------------
    // Pil op
    //--------------------------------------

    else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex =
            Math.max(
                selectedIndex - 1,
                0
            );
        updateSelection(items);
    }

    //--------------------------------------
    // Enter
    //--------------------------------------

    else if (e.key === "Enter") {
        if (selectedIndex >= 0) {
            e.preventDefault();
            items[selectedIndex].click();
        }
    }

    //--------------------------------------
    // Escape
    //--------------------------------------

    else if (e.key === "Escape") {
        list.style.display = "none";
    }

});
    
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
