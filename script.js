const metrics = [
    "LanguageDesireNextYear",
    "LanguageWorkedWith",
    "MiscTechDesireNextYear",
    "MiscTechWorkedWith",
    "WebframeDesireNextYear",
    "WebframeWorkedWith",
    "DevType",
];

const titles = [
    "Desired language to work with next year",
    "Languages worked with",
    "Desired technologies to work with next year",
    "Technologies worked with",
    "Desired web frameworks to work with next year",
    "Web frameworks worked with",
    "Type of Developer",
];

const makeChart = (data, title) => {
    var chart = new Chart("mainChart", {
        type: "horizontalBar",
        data: {
            labels: Object.keys(data),
            datasets: [
                {
                    data: Object.values(data),
                    backgroundColor: Object.keys(data).map((d) =>
                        getRandomColor()
                    ),
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: title,
            },
            legend: {
                display: false,
            },
            responsive: false,
        },
    });

    return chart;
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

const createLabelTag = () => {
    const labelTag = document.createElement("label");
    const labelContent = document.createTextNode("Choose a metric:");
    labelTag.appendChild(labelContent);

    return labelTag;
};

const createSelectTag = () => {
    const selectTag = document.createElement("select");
    selectTag.name = "metric";
    selectTag.id = "surveyMetrics";

    for (var i = 0; i < metrics.length; ++i) {
        const option = document.createElement("option");
        option.value = metrics[i];
        option.text = metrics[i];
        selectTag.appendChild(option);
    }

    return selectTag;
};

// Function for performing chart updates with corresponding data to prompt a change in the view
const updateChartData = (selectTag) => {
    const metric = selectTag.value;
    const data = cleanData(ds.map((d) => d[metric]));
    const title = titles[metrics.indexOf(metric)];

    chart.destroy();

    chart = makeChart(data, title);
};

var ds;
var chart;

d3.csv("survey_results_public.csv").then((data) => {
    ds = data;

    const metric = document.getElementById("surveyMetrics");
    const dataCol = data.map((d) => d[metric.value]);
    const dataCount = cleanData(dataCol);
    chart = makeChart(dataCount, "Stack Overflow Aggregator");
});
