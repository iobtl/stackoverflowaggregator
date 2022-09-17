# Stack Overflow Aggregator

## Overview

This project represents a simple template for performing basic data wrangling and visualization using data obtained from the Stack Overflow Developer Survey. The datasets (.csv format) can be found [here](https://insights.stackoverflow.com/survey/). To run the visualization, download the datasets from the aforementioned site and append `${YEAR}` to their filenames. For example, the latest dataset would be named `survey_results_public_2022.csv`.

## Motivation

One main reason for wanting to create this template was due in fact to the omission of raw numbers from the presentation of the dataset as well as lack of country-specific analysis. This was in part because I wished to learn a little bit more about the landscape of technologies in my own home country as well. (rather than have the data present a 'false' view based on sentiments in other countries).

_NB_: Since I was mainly interested in only a few metrics, this does not cover every metric recorded by the original survey (although implementing the rest is fairly trivial).

## Build

Python's `http.server` is used for convenience in serving the site locally. Assuming `python` is installed, simply run:

```bash
python -m http.server
```

Then visit `localhost:8000` to view the chart.

## Technologies

-   Vanilla Javascript
-   Chart.js
-   D3.js (for csv parsing)
