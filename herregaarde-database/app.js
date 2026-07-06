console.log("app.js loaded");
const supabaseUrl = "https://tdxlesfxckkwyaqlaxgj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkeGxlc2Z4Y2trd3lhcWxheGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwODY4MjksImV4cCI6MjA5NjY2MjgyOX0.JXltvUgUoyFlh8P7N0ZIznrkkm90gi7mDdE3P02Gak4";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

document
    .getElementById("soeg")
    .addEventListener("click", soeg);


async function hentHerregaarde(){

    const { data } = await db
        .from("Tjenestefolk")
        .select("Herregård_Clean");

    const liste =
        [...new Set(data.map(x => x.Herregård_Clean))]
        .filter(Boolean)
        .sort();

    const select =
        document.getElementById("herregaard");

    liste.forEach(h => {

        const option =
            document.createElement("option");

        option.value = h;
        option.textContent = h;

        select.appendChild(option);

    });

}


async function hentAar(){

    const { data } = await db
        .from("Tjenestefolk")
        .select("Folketælling_Clean");

    const liste =
        [...new Set(data.map(x => x.Folketælling_Clean))]
        .sort();

    const select =
        document.getElementById("aar");

    liste.forEach(a => {

        const option =
            document.createElement("option");

        option.value = a;
        option.textContent = a;

        select.appendChild(option);

    });

}

async function soeg(){

    let query = db
        .from("Tjenestefolk")
        .select("*");

    const herregaard =
        document.getElementById("herregaard").value;

    const aar =
        document.getElementById("aar").value;

    const koen =
        document.getElementById("koen").value;

    if(herregaard)
        query = query.eq("Herregård_Clean", herregaard);

    if(aar)
        query = query.eq("Folketælling_Clean", aar);

    if(koen)
        query = query.eq("Køn", koen);

    const { data, error } = await query.limit(100);

    if(error){
        console.log(error);
        return;
    }

    document.getElementById("antal").textContent =
        `${data.length} personer fundet`;

    document.getElementById("output").innerHTML =
        `<pre>${JSON.stringify(data,null,2)}</pre>`;

}


window.onload = async () => {
    await hentHerregaarde();
    await hentAar();
};
