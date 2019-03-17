var margin = {top: 20, right: 20, bottom: 60, left: 50},
    width = 1550 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
 
var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);
var x1 = d3.scale.ordinal(); 
var y = d3.scale.linear()
    .range([height, 0]);
 
var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));
 
var color = d3.scale.ordinal()
    .range(["blue", "pink", "green"]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var yBegin;
 
var innerColumns = {
  "column1" : ["male2017"],
  "column2" : ["female2017"],
  "column3" : ["female%ofMale"],
}
 
d3.csv("Gender_Gap%", function(error, data) {
  var columnHeaders = d3.keys(data[0]).filter(function(key) { return key !== "year"; });
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));
  data.forEach(function(d) {
    var yColumn = new Array();
    d.columnDetails = columnHeaders.map(function(name) {
      for (ic in innerColumns) {
        if($.inArray(name, innerColumns[ic]) >= 0){
          if (!yColumn[ic]){
            yColumn[ic] = 0;
          }
          yBegin = yColumn[ic];
          yColumn[ic] += +d[name];
          return {name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin,};
        }
      }
    });
    d.total = d3.max(d.columnDetails, function(d) { 
      return d.yEnd; 
    });
  });
 
  x0.domain(data.map(function(d) { return d.year; }));
  x1.domain(d3.keys(innerColumns)).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) { 
    return d.total; 
  })]);
 
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "16px") 
      .style("text-anchor", "end") 
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "14px")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );
 
  var projectGroupedbar = svg.selectAll(".projectGroupedbar")
      .data(data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.year) + ",0)"; });
 
  projectGroupedbar.selectAll("rect")
      .data(function(d) { return d.columnDetails; })
      .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { 
        return x1(d.column);
         })
      .attr("y", function(d) { 
        return y(d.yEnd); 
      })
      .attr("height", function(d) { 
        return y(d.yBegin) - y(d.yEnd); 
      })
      .style("fill", function(d) { return color(d.name); });
 
  var legend = svg.selectAll(".legend")
      .data(columnHeaders.slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 15 + ")"; });
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", color);
  legend.append("text")
      .attr("x", width - 30)
      .attr("y", 10)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
});
 