var selectedNode = null;
var active = [];
var unselect = false;
var showAll = false;
var activeFilter = {
  dates: [],
  locations: [],
  chart: []
}

function showAll() {
  console.log(showAll)
  if (showAll) {
    showAll = false;
    document.getElementById("show").innerHTML = "Show All"
  }
  else {
    showAll = true;
    document.getElementById("show").innerHTML = "Show Start"
  }
  load(sankeyJSON);

}

function show() {
  // console.log(showAll)
  if (showAll) {
    showAll = false;
    document.getElementById("show").innerHTML = "Show All"
  }
  else {
    showAll = true;
    document.getElementById("show").innerHTML = "Show Start"
  }
  load(sankeyJSON);
}

function init() {
  getJSON();
  printFilter();
}

function filter(param, value) {
  if (!activeFilter[param].includes(value))
    activeFilter[param].push(value);
  else
    remove(param, value);
  printFilter();
}

function remove(param, item) {
  var arr = [];
  activeFilter[param].forEach(function (value) {
    if (value != item) arr.push(value);
  })
  activeFilter[param] = arr;
}

function resetFilter() {
  var keys = Object.keys(activeFilter);
  keys.forEach(function (value) {
    activeFilter[value] = [];
  })
  printFilter();
  getJSON();
}

function resetDatesFilter() {
  activeFilter.dates = [];
  printFilter();
}

function resetLocationsFilter() {
  activeFilter.locations = [];
  printFilter();
}

function resetChartFilter() {
  activeFilter.chart = [];
  printFilter();
}

document.addEventListener('readystatechange', function () {
  if (document.readyState === "complete") {
    init();
  }
});


function printFilter() {
  var keys = Object.keys(activeFilter);
  var str = "";
  keys.forEach(function (value) {
    str += `${sentenceCase(value)}: ${activeFilter[value].toString()}</br>`;
  })
  document.getElementById('filter').innerHTML = str.toString();
}

function sentenceCase(str) {
  if ((str === null) || (str === ''))
    return false;
  else
    str = str.toString();

  return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

function getJSON() {
  var xhttp;
  var json;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        json = JSON.parse(this.responseText);
        // console.log(json);
        parseCovidandDraw(json);
    }
  };
  xhttp.open("GET", "index.php", true);
  xhttp.send();
  xhttp.onload = function () { };
}
