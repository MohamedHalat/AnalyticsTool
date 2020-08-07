
function parseDates(info) {
  var keys = Object.keys(info);
  var cases = [];
  var deaths = [];
  var combo = [];

  info.forEach(function (key) {
    var date = new Date(key.date.value);
    date.setDate(date.getDate()+1);
    if (key.daily_confirmed_cases != 0) cases.push([date, key.daily_confirmed_cases])
    if (key.daily_deaths != 0) deaths.push([date, key.daily_deaths])
    if (key.daily_confirmed_cases != 0 || key.daily_deaths != 0) combo.push([date, key.daily_confirmed_cases, key.daily_deaths])
  })

  drawLine(combo, 'lineCases', "Cases")
  drawCalendar(deaths, "calendarDeaths", "Deaths")
  drawCalendar(cases, "calendarCases", "Cases")
}

function drawLine(data, div, param){
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn('date', 'Date');
  dataTable.addColumn('number', "Cases");
  dataTable.addColumn('number', "Deaths");
  dataTable.addRows(data);

  var options = {
    hAxis: {
      title: 'Date'
    },
    vAxis: {
      title: "Covid"
    }
  };

  var chart = new google.visualization.LineChart(document.getElementById(div));
  chart.draw(dataTable, options);
}

function drawCalendar(data, div, param) {
  var options = {
    // title: "Covid",
    height: "350",
    width: "100%",
    allowHtml: true,

    calendar: {
      focusedCellColor: {
        stroke: "#d3362d",
        strokeOpacity: 1,
        strokeWidth: 1,
      },
      noDataPattern: {
        backgroundColor: "#76a7fa",
        color: "#a0c3ff",
      },
      cellColor: {
        backgroundColor: "#76a7fa",
        color: "#a0c3ff",
      },
    },
  };
  // console.count("calendar");
  // console.log(json);
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: "date", id: "Date" });
  dataTable.addColumn({ type: "number", id: param });
  dataTable.addRows(data);

  var chart = new google.visualization.Calendar(document.getElementById(div));


  chart.draw(dataTable, options);
  google.visualization.events.addListener(chart, "select", function () {
    var sel = chart.getSelection();
    if (sel.length) {
      if (typeof sel[0].row !== "undefined") {
        var date = new Date(sel[0].date);
        date.setDate(date.getDate()+1);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };

        filter("dates", `${date.toLocaleDateString(undefined, options)}`)

      }
    }
  });
}