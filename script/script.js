var selectedNode = null;
var active = [];
var covidData = {};
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
  console.log(getCookie("filter"))
  if (getCookie("filter")) activeFilter = JSON.parse(getCookie("filter"));
  getDatesJSON();
  getCovidJSON();
  printFilter();
}

function filter(param, value) {
  if (!activeFilter[param].includes(value))
    activeFilter[param].push(value);
  else
    remove(param, value);
  printFilter();
  
  getDatesJSON()
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
  getDatesJSON();
  getCovidJSON();
}

function filterDates(date) {
  date = new Date(date);
  var str = date.getFullYear() + " " + date.getMonth() + " " + date.getDate();
  filter("date", str);
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
  setCookie("filter",JSON.stringify(activeFilter),10)
}

function sentenceCase(str) {
  if ((str === null) || (str === ''))
    return false;
  else
    str = str.toString();

  return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

function getDatesJSON() {
  var xhttp;
  var json;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        json = JSON.parse(this.responseText);
        console.log("getDatesJSON",json)
        parseDates(json)
    }
  };
  console.log(JSON.stringify({"countries":activeFilter.locations.toString()}))
  if (activeFilter.locations){
    xhttp.open("POST", "https://cors-anywhere.herokuapp.com/https://us-central1-mohamed-halat.cloudfunctions.net/Covid-API", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({"countries":activeFilter.locations.toString()}));
  }
  else
  xhttp.open("GET", "https://cors-anywhere.herokuapp.com/https://us-central1-mohamed-halat.cloudfunctions.net/Covid-API", true);

  xhttp.onload = function () { };
}

function getCovidJSON() {
  var xhttp;
  var json;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        json = JSON.parse(this.responseText);
        console.log("getCovidJSON",json)
        parseCovid(json)
    }
  };
  xhttp.open("POST", "https://cors-anywhere.herokuapp.com/https://us-central1-mohamed-halat.cloudfunctions.net/Covid-API", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify({"func":true}));
  xhttp.onload = function () { };
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}