const metrics = {
    2020: {
        "DesiredLanguage": "LanguageDesireNextYear",
        "WorkedLanguage": "LanguageWorkedWith",
        "DesiredTech": "MiscTechDesireNextYear",
        "WorkedTech": "MiscTechWorkedWith",
        "DesiredWebframe": "WebframeDesireNextYear",
        "WorkedWebframe": "WebframeWorkedWith",
        "DevType": "DevType"
    },
    2022: {
        "DesiredLanguage": "LanguageWantToWorkWith",
        "WorkedLanguage": "LanguageHaveWorkedWith",
        "DesiredTech": "MiscTechHaveWorkedWith",
        "WorkedTech": "MiscTechWantToWorkWith",
        "DesiredWebframe": "WebframeHaveWorkedWith",
        "WorkedWebframe": "WebframeWantToWorkWith",
        "DevType": "DevType"
    }
}

const options = {
    "DesiredLanguage": "Desired Languages",
    "WorkedLanguage": "Languages Worked With",
    "DesiredTech": "Desired Technologies",
    "WorkedTech": "Technologies Worked With",
    "DesiredWebframe": "Desired Web Framework",
    "WorkedWebframe": "Web Framework worked with",
    "DevType": "Type of Developer"
}

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
                    backgroundColor: Object.keys(data).map(() =>
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

const cleanData = data => {
    data = data.flatMap(entry => entry.split(";")).filter(d => d != "NA");

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
const updateChartData = metric => {
    var data;
    const country = document.getElementById("countryFilter").value;

    if (country !== "") {
        data = ds.filter(d => d["Country"] == country);
    } else {
        data = ds;
    }

    const currentMetrics = metrics[currentYear];
    data = cleanData(data.map(d => d[currentMetrics[metric]]));
    const title = titles[Object.keys(currentMetrics).indexOf(metric)];

    chart.destroy();
    chart = makeChart(data, title);
};

// Initialize list of countries from dataset
const addCountries = data => {
    var countries = new Set(data.map(d => d["Country"]));
    countries = new Set(
        [...countries].sort().filter(country => country !== "NA")
    );

    const countrySelectTag = document.getElementById("countryFilter");

    countries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country;
        option.text = country;

        countrySelectTag.appendChild(option);
    });
};

// Performing remapping of the dataset to the chart depending on the filter selected
const updateCountryFilter = country => {
    const metric = document.getElementById("surveyMetrics").value;
    const currentMetrics = metrics[currentYear];

    const title = titles[Object.keys(currentMetrics).indexOf(metric)];
    const newData = ds
        .filter(d => d["Country"] == country)
        .map(d => d[currentMetrics[metric]]);
    const newDataCount = cleanData(newData);

    chart.destroy();
    chart = makeChart(newDataCount, title);
};

// Resetting filter to default i.e. showing data from all countries
const clearCountryFilter = () => {
    document.getElementById("countryFilter").selectedIndex = 0;
    const metric = document.getElementById("surveyMetrics").value;
    const currentMetrics = metrics[currentYear];

    const data = cleanData(ds.map(d => d[currentMetrics[metric]]));
    const title = titles[Object.keys(currentMetrics).indexOf(metric)];

    chart.destroy();
    chart = makeChart(data, title);
};

// Add survey years for which the datasets have been added
const initYears = () => {
    const yearTag = document.getElementById("yearFilter");

    Object.keys(metrics).forEach(k => {
        const option = document.createElement("option");
        option.value = k;
        option.text = k;
        if (k == currentYear) {
            option.selected = true;
        }

        yearTag.appendChild(option);
    })
}

// Replaces current dataset with new one based on year selected
const updateYearData = year => {
    if (year !== currentYear) {
        currentYear = year;

        d3.csv(`survey_results_public_${year}.csv`).then(csv => {
            ds = csv;

            const metric = document.getElementById("surveyMetrics").value;
            const currentMetrics = metrics[currentYear];

            const data = cleanData(ds.map(d => d[currentMetrics[metric]]));
            const title = titles[Object.keys(currentMetrics).indexOf(metric)];

            chart.destroy();
            chart = makeChart(data, title);
        })
    }
}

const initOptions = () => {
    const metricsTag = document.getElementById("surveyMetrics");

    var selectedAny = false;
    Object.entries(options).forEach(([metric, description]) => {
        const option = document.createElement("option");
        option.value = metric;
        option.text = description;
        if (!selectedAny) {
            option.selected = true;
            selectedAny = true;
        }

        metricsTag.appendChild(option);
    })
}

var ds;
var chart;
var currentYear = 2022;

d3.csv(`survey_results_public_${currentYear}.csv`).then(csv => {
    ds = csv;

    initOptions();
    // Initializing chart with desired languages metric each reboot
    const metric = document.getElementById("surveyMetrics").value;
    const currentMetrics = metrics[currentYear];

    const data = cleanData(ds.map(d => d[currentMetrics[metric]]));
    const title = titles[Object.keys(currentMetrics).indexOf(metric)];

    chart = makeChart(data, title);

    addCountries(ds);
    initYears();
});
