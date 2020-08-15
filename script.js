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
                fontSize: 16,
                fontFamily: "Helvetica Neue",
            },
            legend: {
                display: false,
            },
            scales: {
                xAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
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
  data.forEach(d => {
    dataCount[d] = (dataCount[d] || 0) + 1;
  });

    const sortedCount = {};
    Object.entries(dataCount)
        .sort((a, b) => b[1] - a[1])
        .forEach((entry) => {
            sortedCount[entry[0]] = entry[1];
        });

    return sortedCount;
};

// Function for performing chart updates with corresponding data to prompt a change in the view
const updateChartData = (metric) => {
    var data;
    const country = document.getElementById("countryFilter").value;

    if (country !== "") {
        data = ds.filter((d) => d["Country"] == country);
    }

    data = cleanData(data.map((d) => d[metric]));
    const title = titles[metrics.indexOf(metric)];

    chart.destroy();

    chart = makeChart(data, title);
};

// Initialize list of countries from dataset
const addCountries = (data) => {
    var countries = new Set(data.map((d) => d["Country"]));
    countries = new Set(
        [...countries].sort().filter((country) => country !== "NA")
    );

    const countrySelectTag = document.getElementById("countryFilter");

    countries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country;
        option.text = country;

        countrySelectTag.appendChild(option);
    });
};

// TODO: Add 'global' option
const updateCountryFilter = (country) => {
    const metric = document.getElementById("surveyMetrics").value;
    const title = titles[metrics.indexOf(metric)];
    const newData = ds
        .filter((d) => d["Country"] == country)
        .map((d) => d[metric]);
    const newDataCount = cleanData(newData);

    chart.destroy();

    chart = makeChart(newDataCount, title);
};

var ds;
var chart;

d3.csv("survey_results_public.csv").then((data) => {
    ds = data;

    // Initializing chart with desired languages metric each reboot
    // IDEA: progress bar??
    const metric = document.getElementById("surveyMetrics").value;
    const dataCol = data.map((d) => d[metric]);
    const dataCount = cleanData(dataCol);
    const title = titles[metrics.indexOf(metric)];

    chart = makeChart(dataCount, title);

    addCountries(data);
});
