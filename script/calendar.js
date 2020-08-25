var CalendarData;

function parseDates(info) {
  CalendarData = info;
  var keys = Object.keys(info);
  var cases = [];
  var deaths = [];
  var combo = [];
  var data = [];
  var data2 = [];
  
  info.forEach(function (key) {
    var date = new Date(key.date.value);
    date.setDate(date.getDate()+1);
    if (key.daily_confirmed_cases != 0) cases.push([date, key.daily_confirmed_cases])
    if (key.daily_deaths != 0) deaths.push([date, key.daily_deaths])
    if (key.daily_confirmed_cases != 0 || key.daily_deaths != 0) combo.push([date, key.daily_confirmed_cases, key.daily_deaths])
    if (key.daily_confirmed_cases != 0) data.push({"y":key.daily_confirmed_cases, "x":key.date.value, type:"Cases"})
    if (key.daily_deaths != 0) data.push({"y":key.daily_deaths, "x":key.date.value, type:"Deaths"})
  })
  console.log(data);
  drawD3(data,data2);
  drawLine(combo, 'lineCases', "Cases")
  console.log(window.innerWidth)
  if(window.innerWidth > 900){
    drawCalendar(deaths, "calendarDeaths", "Deaths")
    drawCalendar(cases, "calendarCases", "Cases")
  }
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

  google.visualization.events.addListener(chart, "select", function () {
    var sel = chart.getSelection();
    if (sel.length) {
      if (typeof sel[0].row !== "undefined") {
        var date = new Date(data[sel[0].row][0]);
        date.setDate(date.getDate()+1);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        filter("dates", `${date.toLocaleDateString(undefined, options)}`)
      }
    }
  });
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


function drawD3(data,data2){
  console.log("1",data)
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_IC.csv",function(data) {

  data.forEach((index, d) => {
    data[index] = {x : d3.timeParse("%Y-%m-%d")(d.x), y : d.y}
  })

  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
  .key(function(d) { return d.type;})
  .entries(data);

  // Add X axis --> it is a date format
  var x = d3.scaleTime()
  .domain(d3.extent(data, function(d) { return d3.timeParse("%Y-%m-%d")(d.x); }))
  .range([ 0, width ]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.y; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

  // This allows to find the closest X index of the mouse:
  var bisect = d3.bisector(function(d) { return d3.timeParse("%Y-%m-%d")(d.x); }).left;

  // Create the circle that travels along the curve of chart
  var focus = svg
    .append('g')
    .append('circle')
      .style("fill", "none")
      .attr("stroke", "black")
      .attr('r', 8.5)
      .style("opacity", 0)

  // Create the text that travels along the curve of chart
  var focusText = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")

  // Add the line
  svg
    // .data(sumstat)
    .datum(data)
    // .data([data2,data])
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d3.timeParse("%Y-%m-%d")(d.x)) })
      .y(function(d) { return y(d.y) })
      )

  // Create a rect on top of the svg area: this rectangle recovers mouse position
  svg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);


  // What happens when the mouse move -> show the annotations at the right positions.
  function mouseover() {
    focus.style("opacity", 0)
    focusText.style("opacity",1)
  }

  function mousemove() {
    // recover coordinate we need
    var x0 = x.invert(d3.mouse(this)[0]);
    var i = bisect(data, x0, 1);
    selectedData = data[i]
    focusText
      .html("Date:" + selectedData.x + "  -  " + ""+selectedData.type+":" + selectedData.y.toLocaleString())
      .attr("x", 15)
      .attr("y", 0)
    }
  function mouseout() {
    focus.style("opacity", 0)
    focusText.style("opacity", 0)
  }



}