var tables = {};

var tableOptions = {
  showRowNumber: false,
  width: "100%",
  height: "300",
  allowHtml: true,
  page: "enable",
  pageSize: 100,
  paginingButtons: "auto"
};


// Charts
google.charts.load("current", { packages: ["calendar", "table", "corechart", "geochart"], 'mapsApiKey': 'AIzaSyBVNqmTmZPPK-jqWzgZ4nToRGtdAF6GiH0' });

/* Data Parse into visualizable info, calls draw functions
* @param info json version of bigquery covid dataset
*/
function parseCovidandDraw(info) {
  var rows = [];
  var deaths = [];
  var cases = []
  var geoRows = [];
  var dates = {};
  var locations = {};

  info.forEach(function (value) {
    // Filter
    value.countries_and_territories = value.countries_and_territories.replace(/_/g, " ")
    if (value.countries_and_territories == "Cases on an international conveyance Japan") value.countries_and_territories = "Japan"
    if (value.countries_and_territories == "United States of America") value.countries_and_territories = "United States"
    // Add row info to dataset
    rows.push([value.date.value, value.countries_and_territories.replace(/_/g, " "), value.daily_confirmed_cases, value.daily_deaths, value.confirmed_cases, value.deaths])
    if (dates[value.date.value] == undefined) {
      dates[value.date.value] = { "cases": value.daily_confirmed_cases, "deaths": value.daily_deaths }
    }
    else {
      dates[value.date.value].cases += value.daily_confirmed_cases;
      dates[value.date.value].deaths += value.daily_deaths;
    }
    if (value.deaths != 0 || value.confirmed_cases != 0) locations[value.countries_and_territories] = { "deaths": value.deaths, "cases": value.confirmed_cases }
  })
  // Draw data

  drawCovidTable(rows);
  parseDates(dates);
  parseLocation(locations);
}


function drawCovidPie(info, param) {
  var data = new google.visualization.DataTable();
  var total = 0;
  info.forEach(function (value) {
    total += value[1];
  })
  document.getElementById(`pieTotal${param}`).innerHTML = "Total: " + total;
  data.addColumn('string', 'Country');
  data.addColumn('number', param);
  data.addRows(info);

  // Set options for pie chart.
  var options = {
    // title: 'User Intents',
    width: 400,
    height: 300
  };

  // Instantiate and draw the chart for Sarah's pizza.
  var chart = new google.visualization.PieChart(document.getElementById(`pieChart${param}`));
  chart.draw(data, options);

  var barchart_options = {
    // title: 'User Intents',
    width: 400,
    height: 300,
    legend: 'none'
  };
  var barchart = new google.visualization.BarChart(document.getElementById(`barChart${param}`));
  barchart.draw(data, barchart_options);
}


function drawCovidTable(rows) {
  // console.log(info)
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Date');
  data.addColumn('string', 'Countries and territories');
  data.addColumn('number', 'Daily Confirmed Cases');
  data.addColumn('number', 'Daily Deaths');
  data.addColumn('number', 'Confirmed Cases');
  data.addColumn('number', 'Deaths');

  console.log(rows)
  document.getElementById("numberOfCovidTable").innerHTML = `Total Rows: ${rows.length}`;
  data.addRows(rows);
  var table = new google.visualization.Table(document.getElementById("covidTable"));
  table.draw(data, tableOptions);
}


function parseLocation(info) {
  var keys = Object.keys(info);
  var data = [];
  var deaths = [];
  var cases = [];
  keys.forEach(function (key) {
    if (info[key].cases != 0) data.push([key.replace(/_/g, " "), info[key].cases, info[key].deaths])
    if (info[key].cases != 0) cases.push([key.replace(/_/g, " "), info[key].cases])
    if (info[key].deaths != 0) deaths.push([key.replace(/_/g, " "), info[key].deaths])
  })
  drawCovidPie(deaths, "Deaths");
  drawCovidPie(cases, "Cases");
  drawRegionsMap(cases);
  drawLocationsTable(data)
}

function drawLocationsTable(rows) {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Countries and territories');
  data.addColumn('number', 'Confirmed Cases');
  data.addColumn('number', 'Deaths');

  console.log(rows)
  document.getElementById("numberOfLocations").innerHTML = `Total Rows: ${rows.length}`;
  data.addRows(rows);
  var table = new google.visualization.Table(document.getElementById("locationsTable"));
  table.draw(data, tableOptions);
}

function drawRegionsMap(info) {
  // var data = google.visualization.arrayToDataTable(info);
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Country")
  data.addColumn("number", "Cases")
  data.addRows(info)

  var options = {
    width: "100%",
    height: "300",
  };

  var chart = new google.visualization.GeoChart(document.getElementById('locationsChart'));

  chart.draw(data, options);
}

function showSelect(div, filter, cell) {
  var table = document.getElementById(div).firstElementChild.firstElementChild.firstElementChild;
  for (var i = 0, row; row = table.rows[i]; i++) {
    if (table.rows[i].cells[cell] == undefined) break;
    if (table.rows[i].style.color == "blue") table.rows[i].style.color = "black"

    if (filter.includes((table.rows[i].cells[cell].innerHTML))) {
      console.log(table.rows[i].cells[cell]);
      table.rows[i].style.color = "blue"
    }
  }
}


function includesDate(date) {
  var x = false;
  activeFilter.dates.forEach(function (value) {
    if (compareDate(date, value)) {
      x = true;
    }
  });
  return x;
}

function compareDate(date, textDate) {
  return !textDate.localeCompare(date.toString().substring(0, 10).trim())
}

function dateString(date) {
  var str = date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDate();
  return str
}