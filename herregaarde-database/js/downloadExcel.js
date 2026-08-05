import { downloadPeople, getSearchStatistics } from "./supabase.js";

//--------------------------------------------------
// Tekster
//--------------------------------------------------

const filterLabels = {
    globalSoegning:
        "Søgning i hele databasen",

    herregaard:
        "Herregård",

    aar:
        "Folketællingsår",

    koen:
        "Køn",

    trossamfund:
        "Religion",

    civilstand:
        "Civilstand",

    region:
        "Region",

    kommune:
        "Kommune",

    handicap:
        "Handicap",

    arbejde:
        "Fritekstsøgning i arbejde/position",

    arbejdeValgt:
        "Arbejde / position",

    alderFra:
        "Alder fra",

    alderTil:
        "Alder til",

    transportFra:
        "Transport fra (km)",

    transportTil:
        "Transport til (km)"
};

const statisticsLabels = {
    aar:
        "Folketællinger",

    koen:
        "Køn",

    civilstand:
        "Civilstand",

    trossamfund:
        "Religion",

    alder:
        "Aldersfordeling"
};

//--------------------------------------------------
// Fælles udseende
//--------------------------------------------------

const PRIMARY_ARGB = "FF355C4A";
const PRIMARY_LIGHT_ARGB = "FFEAF0ED";
const WHITE_ARGB = "FFFFFFFF";
const BORDER_ARGB = "FFD9D9D9";

const thinBorder = {
    top: {
        style: "thin",
        color: { argb: BORDER_ARGB }
    },
    left: {
        style: "thin",
        color: { argb: BORDER_ARGB }
    },
    bottom: {
        style: "thin",
        color: { argb: BORDER_ARGB }
    },
    right: {
        style: "thin",
        color: { argb: BORDER_ARGB }
    }
};

//--------------------------------------------------
// Download
//--------------------------------------------------

export async function downloadExcel(filters) {
    const button =
        document.getElementById(
            "downloadExcelBtn"
        );

    const originalText =
        button?.textContent?.trim()
        || "📗 Download Excel";

    try {
        if (button) {
            button.disabled = true;
            button.textContent =
                "Opretter Excel …";

            button.setAttribute(
                "aria-busy",
                "true"
            );
        }

        const [
            peopleResponse,
            statisticsResponse
        ] = await Promise.all([
            downloadPeople(filters),
            getSearchStatistics(filters)
        ]);

        if (peopleResponse.error) {
            throw peopleResponse.error;
        }

        if (statisticsResponse.error) {
            throw statisticsResponse.error;
        }

        const people =
            normalizePeopleData(
                peopleResponse.data
            );

        const statistics =
            statisticsResponse.data;

        if (people.length === 0) {
            throw new Error(
                "Der blev ikke fundet data til Excel-filen."
            );
        }

        const ExcelJS =
            window.ExcelJS;

        if (!ExcelJS) {
            throw new Error(
                "ExcelJS blev ikke indlæst."
            );
        }

        const workbook =
            new ExcelJS.Workbook();

        workbook.creator =
            "Herregårdsdatabasen";

        workbook.lastModifiedBy =
            "Herregårdsdatabasen";

        workbook.created =
            new Date();

        workbook.modified =
            new Date();

        //--------------------------------------------------
        // Ark 1: Filtre
        //--------------------------------------------------

        createFiltersSheet(
            workbook,
            filters
        );

        //--------------------------------------------------
        // Ark 2: Personer
        //--------------------------------------------------

        createPeopleSheet(
            workbook,
            people
        );

        //--------------------------------------------------
        // Ark 3: Statistik
        //--------------------------------------------------

        createStatisticsSheet(
            workbook,
            statistics
        );

        //--------------------------------------------------
        // Gem fil
        //--------------------------------------------------

        const buffer =
            await workbook.xlsx.writeBuffer();

        const blob =
            new Blob(
                [buffer],
                {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        const today =
            new Date()
                .toISOString()
                .slice(0, 10);

        link.href = url;

        link.download =
            `Herregaardsdatabasen_${today}.xlsx`;

        document.body.appendChild(link);

        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }
    catch (error) {
        console.error(
            "Kunne ikke oprette Excel-fil:",
            error
        );

        alert(
            "Excel-filen kunne ikke oprettes. Se konsollen for flere oplysninger."
        );
    }
    finally {
        if (button) {
            button.disabled = false;
            button.textContent =
                originalText;

            button.removeAttribute(
                "aria-busy"
            );
        }
    }
}

//--------------------------------------------------
// Ark 1: Filtre
//--------------------------------------------------

function createFiltersSheet(
    workbook,
    filters
) {
    const sheet =
        workbook.addWorksheet(
            "Filtre",
            {
                views: [
                    {
                        showGridLines: false
                    }
                ]
            }
        );

    sheet.mergeCells("A1:B1");

    const title =
        sheet.getCell("A1");

    title.value =
        "Herregårdsdatabasen";

    title.font = {
        bold: true,
        size: 18,
        color: {
            argb: WHITE_ARGB
        }
    };

    title.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: PRIMARY_ARGB
        }
    };

    title.alignment = {
        vertical: "middle",
        horizontal: "left"
    };

    sheet.getRow(1).height = 30;

    sheet.getCell("A3").value =
        "Eksportdato";

    sheet.getCell("B3").value =
        new Date();

    sheet.getCell("B3").numFmt =
        "dd-mm-yyyy hh:mm";

    sheet.getCell("A5").value =
        "Filter";

    sheet.getCell("B5").value =
        "Værdi";

    styleHeaderRow(
        sheet.getRow(5)
    );

    let rowNumber = 6;
    let hasFilters = false;

    Object.entries(filters)
        .forEach(([key, value]) => {
            if (
                key === "page" ||
                key === "pageSize" ||
                key === "sortColumn" ||
                key === "sortDirection"
            ) {
                return;
            }

            if (isEmptyFilter(value)) {
                return;
            }

            hasFilters = true;

            const row =
                sheet.getRow(rowNumber);

            row.getCell(1).value =
                filterLabels[key] || key;

            row.getCell(2).value =
                formatFilterValue(value);

            row.eachCell(cell => {
                cell.border =
                    thinBorder;

                cell.alignment = {
                    vertical: "top",
                    wrapText: true
                };
            });

            rowNumber += 1;
        });

    if (!hasFilters) {
        const row =
            sheet.getRow(rowNumber);

        row.getCell(1).value =
            "Ingen filtre";

        row.getCell(2).value =
            "Alle personer i databasen";

        row.eachCell(cell => {
            cell.border =
                thinBorder;
        });
    }

    sheet.getColumn(1).width = 30;
    sheet.getColumn(2).width = 65;

    sheet.views = [
        {
            showGridLines: false,
            state: "frozen",
            ySplit: 5
        }
    ];

    return sheet;
}

//--------------------------------------------------
// Ark 2: Personer
//--------------------------------------------------

function createPeopleSheet(
    workbook,
    people
) {
    const sheet =
        workbook.addWorksheet(
            "Personer",
            {
                views: [
                    {
                        state: "frozen",
                        ySplit: 1
                    }
                ]
            }
        );

    const columns =
        Object.keys(people[0]);

    sheet.columns =
        columns.map(key => ({
            header: key,
            key
        }));

    people.forEach(person => {
        const rowData = {};

        columns.forEach(key => {
            rowData[key] =
                normalizeCellValue(
                    person[key]
                );
        });

        sheet.addRow(rowData);
    });

    styleHeaderRow(
        sheet.getRow(1)
    );

    sheet.autoFilter = {
        from: {
            row: 1,
            column: 1
        },
        to: {
            row: 1,
            column: columns.length
        }
    };

    setAutomaticColumnWidths(
        sheet,
        {
            minWidth: 10,
            maxWidth: 45,
            sampleRows: 500
        }
    );

    sheet.getRow(1).height = 28;

    return sheet;
}

//--------------------------------------------------
// Ark 3: Statistik
//--------------------------------------------------

function createStatisticsSheet(
    workbook,
    statistics
) {
    const sheet =
        workbook.addWorksheet(
            "Statistik",
            {
                views: [
                    {
                        showGridLines: false,
                        state: "frozen",
                        ySplit: 3
                    }
                ]
            }
        );

    sheet.mergeCells("A1:C1");

    const title =
        sheet.getCell("A1");

    title.value =
        "Statistik over søgeresultatet";

    title.font = {
        bold: true,
        size: 18,
        color: {
            argb: WHITE_ARGB
        }
    };

    title.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: PRIMARY_ARGB
        }
    };

    sheet.getRow(1).height = 30;

    sheet.getCell("A3").value =
        "Antal personer";

    sheet.getCell("B3").value =
        Number(statistics.total) || 0;

    sheet.getCell("A3").font = {
        bold: true,
        color: {
            argb: PRIMARY_ARGB
        }
    };

    let nextRow = 5;

    for (
        const [category, values]
        of Object.entries(statistics)
    ) {
        if (
            category === "total" ||
            !Array.isArray(values) ||
            values.length === 0
        ) {
            continue;
        }

        nextRow =
            addStatisticsSection(
                sheet,
                nextRow,
                statisticsLabels[category]
                    || category,
                values
            );

        nextRow += 2;
    }

    sheet.getColumn(1).width = 30;
    sheet.getColumn(2).width = 16;
    sheet.getColumn(3).width = 16;

    //--------------------------------------------------
    // Diagrammer som billeder
    //--------------------------------------------------

    let chartRow = 3;

    if (
        Array.isArray(statistics.koen) &&
        statistics.koen.length > 0
    ) {
        addBarChartImage({
            workbook,
            sheet,
            rows:
                statistics.koen,
            title:
                "Kønsfordeling",
            startColumn:
                4,
            startRow:
                chartRow,
            maxItems:
                10
        });

        chartRow += 16;
    }

    if (
        Array.isArray(statistics.alder) &&
        statistics.alder.length > 0
    ) {
        addBarChartImage({
            workbook,
            sheet,
            rows:
                statistics.alder,
            title:
                "Aldersfordeling",
            startColumn:
                4,
            startRow:
                chartRow,
            maxItems:
                20
        });
    }

    return sheet;
}

//--------------------------------------------------
// Statistiksektion
//--------------------------------------------------

function addStatisticsSection(
    sheet,
    startRow,
    title,
    values
) {
    sheet.mergeCells(
        startRow,
        1,
        startRow,
        3
    );

    const heading =
        sheet.getCell(
            startRow,
            1
        );

    heading.value = title;

    heading.font = {
        bold: true,
        size: 13,
        color: {
            argb: PRIMARY_ARGB
        }
    };

    heading.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: PRIMARY_LIGHT_ARGB
        }
    };

    heading.alignment = {
        vertical: "middle"
    };

    sheet.getRow(startRow).height =
        24;

    const headerRow =
        sheet.getRow(
            startRow + 1
        );

    headerRow.values = [
        "Værdi",
        "Antal",
        "Procent"
    ];

    styleHeaderRow(headerRow);

    const total =
        values.reduce(
            (sum, row) =>
                sum +
                (Number(row.count) || 0),
            0
        );

    let rowNumber =
        startRow + 2;

    values.forEach(item => {
        const count =
            Number(item.count) || 0;

        const row =
            sheet.getRow(rowNumber);

        row.getCell(1).value =
            item.label ?? "Ukendt";

        row.getCell(2).value =
            count;

        row.getCell(3).value =
            total > 0
                ? count / total
                : 0;

        // Rigtig Excel-procent,
        // ikke tekst som "42.1%"
        row.getCell(3).numFmt =
            "0.0%";

        row.eachCell(cell => {
            cell.border =
                thinBorder;
        });

        rowNumber += 1;
    });

    return rowNumber;
}

//--------------------------------------------------
// Diagram som PNG
//--------------------------------------------------

function addBarChartImage({
    workbook,
    sheet,
    rows,
    title,
    startColumn,
    startRow,
    maxItems
}) {
    const dataUrl =
        createBarChartDataUrl(
            rows,
            title,
            maxItems
        );

    const imageId =
        workbook.addImage({
            base64: dataUrl,
            extension: "png"
        });

    sheet.addImage(
        imageId,
        {
            tl: {
                col: startColumn - 1,
                row: startRow - 1
            },
            ext: {
                width: 560,
                height: 250
            }
        }
    );
}

function createBarChartDataUrl(
    rows,
    title,
    maxItems = 12
) {
    const data =
        [...rows]
            .filter(item =>
                Number(item.count) > 0
            )
            .slice(0, maxItems);

    const width = 1120;
    const height = 500;

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width = width;
    canvas.height = height;

    const context =
        canvas.getContext("2d");

    if (!context) {
        throw new Error(
            "Browseren kunne ikke oprette diagrammet."
        );
    }

    context.fillStyle =
        "#ffffff";

    context.fillRect(
        0,
        0,
        width,
        height
    );

    context.fillStyle =
        "#355c4a";

    context.font =
        "bold 34px Arial";

    context.fillText(
        title,
        40,
        55
    );

    const labelWidth = 250;
    const chartLeft = 300;
    const chartRight = width - 60;
    const chartWidth =
        chartRight - chartLeft;

    const top = 90;
    const bottom = height - 35;
    const availableHeight =
        bottom - top;

    const rowHeight =
        data.length > 0
            ? availableHeight /
                data.length
            : availableHeight;

    const max =
        Math.max(
            1,
            ...data.map(item =>
                Number(item.count) || 0
            )
        );

    data.forEach((item, index) => {
        const y =
            top +
            index * rowHeight;

        const count =
            Number(item.count) || 0;

        const barWidth =
            count / max *
            chartWidth;

        context.fillStyle =
            "#2b2b2b";

        context.font =
            "24px Arial";

        const label =
            String(
                item.label ?? "Ukendt"
            );

        context.fillText(
            truncateText(
                context,
                label,
                labelWidth
            ),
            40,
            y + rowHeight * 0.62
        );

        context.fillStyle =
            "#e4ebe7";

        context.fillRect(
            chartLeft,
            y + rowHeight * 0.2,
            chartWidth,
            rowHeight * 0.52
        );

        context.fillStyle =
            "#355c4a";

        context.fillRect(
            chartLeft,
            y + rowHeight * 0.2,
            barWidth,
            rowHeight * 0.52
        );

        context.fillStyle =
            "#2b2b2b";

        context.font =
            "22px Arial";

        context.fillText(
            count.toLocaleString(
                "da-DK"
            ),
            Math.min(
                chartLeft +
                    barWidth +
                    10,
                width - 130
            ),
            y + rowHeight * 0.62
        );
    });

    return canvas.toDataURL(
        "image/png"
    );
}

function truncateText(
    context,
    text,
    maxWidth
) {
    if (
        context.measureText(text).width
        <= maxWidth
    ) {
        return text;
    }

    let shortened = text;

    while (
        shortened.length > 1 &&
        context
            .measureText(
                shortened + "…"
            )
            .width > maxWidth
    ) {
        shortened =
            shortened.slice(0, -1);
    }

    return shortened + "…";
}

//--------------------------------------------------
// Styling
//--------------------------------------------------

function styleHeaderRow(row) {
    row.eachCell(cell => {
        cell.font = {
            bold: true,
            color: {
                argb: WHITE_ARGB
            }
        };

        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: PRIMARY_ARGB
            }
        };

        cell.alignment = {
            vertical: "middle",
            horizontal: "left"
        };

        cell.border =
            thinBorder;
    });
}

function setAutomaticColumnWidths(
    sheet,
    {
        minWidth = 10,
        maxWidth = 45,
        sampleRows = 500
    } = {}
) {
    sheet.columns.forEach(column => {
        let longest = 0;

        column.eachCell(
            {
                includeEmpty: false
            },
            (cell, rowNumber) => {
                // Ved meget store eksportfiler
                // undersøger vi kun et udsnit.
                if (
                    rowNumber >
                    sampleRows + 1
                ) {
                    return;
                }

                const value =
                    cell.value == null
                        ? ""
                        : String(
                            cell.value
                        );

                longest =
                    Math.max(
                        longest,
                        value.length
                    );
            }
        );

        column.width =
            Math.min(
                maxWidth,
                Math.max(
                    minWidth,
                    longest + 2
                )
            );
    });
}

//--------------------------------------------------
// Hjælpefunktioner
//--------------------------------------------------

function normalizePeopleData(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (
        data &&
        Array.isArray(data.data)
    ) {
        return data.data;
    }

    return [];
}

function normalizeCellValue(value) {
    if (value === undefined) {
        return null;
    }

    if (
        typeof value === "object" &&
        value !== null
    ) {
        return JSON.stringify(value);
    }

    return value;
}

function isEmptyFilter(value) {
    return (
        value == null ||
        value === "" ||
        (
            Array.isArray(value) &&
            value.length === 0
        )
    );
}

function formatFilterValue(value) {
    if (Array.isArray(value)) {
        return value.join(", ");
    }

    if (typeof value === "number") {
        return value;
    }

    return String(value);
}
