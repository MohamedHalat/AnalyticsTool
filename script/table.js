// Charts
google.charts.load("current", { packages: ["calendar", "table", "corechart", "geochart", "line"], 'mapsApiKey': 'AIzaSyBVNqmTmZPPK-jqWzgZ4nToRGtdAF6GiH0' });

/**
 * Parses http calls data and creates charts
 * @param {Object} info Contains results form XMHTTP Calls
 */
function parseCovid(info) {
  var rows = [];
  var deaths = [];
  var locations = {};
  var cases = [];

  // Data loop
  info.forEach(function (value) {
    // Replace certain country names
    value.countries_and_territories = value.countries_and_territories.replace(/_/g, " ")
    if (value.countries_and_territories == "Cases on an international conveyance Japan") value.countries_and_territories = "Japan"
    if (value.countries_and_territories == "United States of America") value.countries_and_territories = "United States"
    // Pie, bar and regional chart data
    if (value.cases != 0) cases.push([value.countries_and_territories.replace(/_/g, " "), value.daily_confirmed_cases])
    if (value.deaths != 0) deaths.push([value.countries_and_territories, value.daily_deaths])

    locations[value.countries_and_territories] = value.country_territory_code; // regional chart location name mapper used in select
    rows.push([value.countries_and_territories.replace(/_/g, " "), value.country_territory_code, value.daily_confirmed_cases, value.daily_deaths]) //Table data
  })

  // Create Charts
  drawCovidPie(deaths, "Deaths");
  drawCovidPie(cases, "Cases");
  drawRegionsMap(cases, locations);
  drawLocationsTable(rows)
}


/**
 * Draws either deaths or cases piechart and barchart
 * @param {Array} info contains chart data: country, param
 * @param {String} param second parameter of the pie chart, either deaths or cases
 */
function drawCovidPie(info, param) {
  // Create Dataset
  var data = new google.visualization.DataTable();
  var total = 0;
  data.addColumn('string', 'Country');
  data.addColumn('number', param);
  data.addRows(info);

  // Set options for piechart and draw
  var options = {
    width: 400,
    height: 300
  };
  var chart = new google.visualization.PieChart(document.getElementById(`pieChart${param}`));
  chart.draw(data, options);

  // Add total
  info.forEach(value => total += value[1])
  document.getElementById(`pieTotal${param}`).innerHTML = "Total: " + total;

  // Draw Barchart
  var barchart_options = {
    width: 400,
    height: 300,
    legend: 'none'
  };
  var barchart = new google.visualization.BarChart(document.getElementById(`barChart${param}`));
  barchart.draw(data, barchart_options);
}

/**
 * 
 * @param {Array} rows contains array of table col: country, code, cases, deaths
 */
function drawLocationsTable(rows) {
  // Create Dataset
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Countries and territories');
  data.addColumn('string', 'Location');
  data.addColumn('number', 'Confirmed Cases');
  data.addColumn('number', 'Deaths');
  data.addRows(rows);

  // Draw Chart
  var options = {
    showRowNumber: false,
    width: "100%",
    height: "300",
    allowHtml: true,
    page: "enable",
    pageSize: 100,
    paginingButtons: "auto"
  };
  document.getElementById("numberOfLocations").innerHTML = `Total Rows: ${rows.length}`;
  var table = new google.visualization.Table(document.getElementById("locationsTable"));
  table.draw(data, options);

  //Select event listener
  google.visualization.events.addListener(table, "select", function () {
    var sel = table.getSelection();
    if (sel.length && typeof sel[0].row !== "undefined")
      filter("locations", data.getValue(sel[0].row, 1));
  });
}

/**
 * Draws the map chart using google API
 * @param {Array} info contains array with country,casses col
 * @param {Object} locations Maps country to Country Code
 */
function drawRegionsMap(info, locations) {
  // Create Dataset
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Country")
  data.addColumn("number", "Cases")
  data.addRows(info)

  // Create Chart
  var chart = new google.visualization.GeoChart(document.getElementById('locationsChart'));
  chart.draw(data, { width: "100%", height: "300" });

  // Select event listener
  google.visualization.events.addListener(chart, "select", function () {
    var sel = chart.getSelection();
    if (sel.length && typeof sel[0].row !== "undefined")
      filter("locations", locations[data.getValue(sel[0].row, 0)]);
  });
}
