const makeChart = (data) => {
    const dataCol = data.map((d) => d.LanguageWorkedWith);
    const dataCount = cleanData(dataCol);
    var chart = new Chart("mainChart", {
        type: "horizontalBar",
        data: {
            labels: Object.keys(dataCount),
            datasets: [
                {
                    data: Object.values(dataCount),
                    backgroundColor: Object.keys(dataCount).map((d) =>
                        getRandomColor()
                    ),
                },
            ],
        },
        options: {
            title: "Desired languages to learn",
            legend: {
                display: false,
            },
        },
    });
};

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; ++i) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
};

const cleanData = (data) => {
    data = data.flatMap((entry) => entry.split(";")).filter((d) => d != "NA");

    const dataCount = new Object();
    data.forEach((d) => {
        if (!Object.keys(dataCount).includes(d)) {
            dataCount[d] = 1;
        } else {
            dataCount[d] += 1;
        }
    });

    const sortedCount = {};
    Object.entries(dataCount)
        .sort((a, b) => b[1] - a[1])
        .forEach((entry) => {
            sortedCount[entry[0]] = entry[1];
        });

    return sortedCount;
};

ds = d3.csv("survey_results_public.csv").then(makeChart);
