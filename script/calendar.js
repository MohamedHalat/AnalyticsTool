
function parseDates(info) {
  var keys = Object.keys(info);
  var cases = [];
  var deaths = [];

  info.forEach(function (key) {
    if (key.daily_confirmed_cases != 0)
     cases.push([new Date(key.date.value), key.daily_confirmed_cases])
    if (key.daily_deaths != 0)
     deaths.push([new Date(key.date.value), key.daily_deaths])
  })
  drawCalendar(deaths, "calendarDeaths", "Deaths")
  drawCalendar(cases, "calendarCases", "Cases")
  drawLine(cases, 'lineCases', "Cases")
  drawLine(deaths, 'lineDeaths', "Deaths")
}

function drawLine(data, div, param){
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn('date', 'Date');
  dataTable.addColumn('number', param);
  dataTable.addRows(data);

  var options = {
    hAxis: {
      title: 'Date'
    },
    vAxis: {
      title: param
    }
  };

  var chart = new google.visualization.LineChart(document.getElementById(div));
  chart.draw(dataTable, options);
}

function drawCalendar(data, div, param) {
  var options = {
    // title: "Covid",
    height: "800",
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
        filterDates(new Date(sel[0].date));
      }
    }
  });
}


// Helper Functions
function format(num) {
  num = num.toString()
  if (num.length < 2) return 0 + num;
  return num
}

function convertToDates(arr) {
  var data = [];
  if (arr.length == 0) return null;
  for (var i = 0; i < arr.length; i++) {
    var date = new Date(arr[i][0]);
    date.setDate(date.getDate());
    data[i] = [date, arr[i][1]];
  }
  // console.log("Dates:", data)
  return data;
}
