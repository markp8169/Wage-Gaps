// D3 Scatterplot Assignment
var svgWidth = 480;
var svgHeight = 380;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 90
}

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
//and shift the latter by left and top margins.
var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenxAxis = "Mean_Income_2017_M";
var chosenyAxis = "Year";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenxAxis) {
    // Create scales
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenxAxis]) * 0.8,
        d3.max(data, d => d[chosenxAxis]) * 1.2
    ])
    .range([0, width]);

    return xLinearScale
};

// function used for updating xAxis var upon click on axis label
function renderAxes(newxScale, xAxis) {
    let bottomAxis = d3.axisBottom(newxScale);

    xAxis.transition()
        .duration(200)
        .call(bottomAxis);
    return xAxis
};

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newxScale, chosenxAxis) {

    circlesGroup.transition()
      .duration(200)
      .style("fill",  (chosenxAxis === "Mean_Income_2017_F")?"magenta":"blue")
      .attr("cx", d => newxScale(d[chosenxAxis]))

    return circlesGroup
  };

function ActualData(){

    // console.log("test")
  // <div class="col-xs-12  col-md-6 col-md-offset-0">
    // <iframe src="chart_1967_2017.html" height="500" width="700"></iframe>
  // </div>

};
 

// function used for updating circles group with new tooltip
function updateToolTip(chosenxAxis, circlesGroup) {

    if (chosenxAxis === "Mean_Income_2017_M") {
      var xlabel = "Male Income($): ";
      var ylabel = "Year: "
    } else {
      var xlabel = "Female Income($): "
      var ylabel = "Year: "
    };
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {
        // return (`${d.Year}<hr>${xlabel} ${d[chosenxAxis]}<br>${ylabel} ${d[chosenyAxis]}`);
        // return (`${xlabel} ${d[chosenxAxis]}<br>${ylabel} ${d[chosenyAxis]}`);
        return (`${ylabel} ${d[chosenyAxis]}<hr>${xlabel} ${d[chosenxAxis]}`);
        // return (`${ylabel} ${d[chosenyAxis]}${xlabel} ${d[chosenxAxis]}`);
      });
    
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function (data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup
  }

// Retrieve data from the CSV file and execute everything below
d3.csv("mean_income_gender.csv", function (error, data) {
    if (error) throw error;
  
    // parse data
    data.forEach(function (file) {
      file.Year = +file.Year;
      file.Mean_Income_2017_M = +file.Mean_Income_2017_M;
      file.Mean_Income_2017_F = +file.Mean_Income_2017_F;
    });
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenxAxis);
  
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([1960, d3.max(data, d => d.Year)])
      .range([height, 0]);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    chartGroup.append("g")
      .call(leftAxis);
       
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenxAxis]))
      .attr("cy", d => yLinearScale(d[chosenyAxis]))
      .attr("r", 9)
      .style("fill",  (chosenxAxis === "Mean_Income_2017_F")?"magenta":"blue")
      .attr("opacity", "0.9");
    //.attr("class", "stateText");
    
    // var circlesText = chartGroup.selectAll("stateText")
    //   .data(data)
    //   .enter()
    //   .append("text")
    //   .text(function (d) {
    //     return d.abbr;
    /*   })
      .attr("x", function (d) {
        return xLinearScale(d[chosenxAxis]);
      })
      .attr("y", function (d) {
        return yLinearScale(d[chosenyAxis]);
      })
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("fill", "white"); */
      
    
    // Create group for  2 x- axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width/2}, ${height + 20})`)
  
    var Mean_Income_2017_M = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "Mean_Income_2017_M") //value to grab for event listener
      .classed("active", true)
      .text("Male Income 2017($)");
  
    var Mean_Income_2017_F = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "Mean_Income_2017_F") //value to grab for event listener
      .classed("inactive", true)
      .text("Female Income 2017($)");
  
    // append y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "2em")
      .classed("axis-text", true)
      .text("Year");
  
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenxAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function () {
        // get value of selection
        var value = d3.select(this).attr("value")
        if (value != chosenxAxis) {
  
          // replaces chosenXAxis with value
          chosenxAxis = value;
  
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(data, chosenxAxis);
  
          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);
  
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenxAxis);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenxAxis, circlesGroup);

          // // var newCirclesText = chartGroup.selectAll("stateText")
          // //   .data(data) 
          // //   .enter()
          // //   .append("text")
          // //   .text(function (d) {
          // //     return d.abbr;
          // //   })
          //   .attr("x", function (d) {
          //     return xLinearScale(d[chosenxAxis]);
          //   })
          //   .attr("y", function (d) {
          //     return yLinearScale(d[chosenyAxis]);
          //   })
          //   .attr("font-size", "10px")
          //   .attr("text-anchor", "middle")
          //   .attr("fill", "white");
  
          // changes classes to change bold text
          if (chosenxAxis === "Mean_Income_2017_F") {
            Mean_Income_2017_F
              .classed("active", true)
              .classed("inactive", false)
              Mean_Income_2017_M
              .classed("active", false)
              .classed("inactive", true)
          } else {
            Mean_Income_2017_F
              .classed("active", false)
              .classed("inactive", true)
              Mean_Income_2017_M
              .classed("active", true)
              .classed("inactive", false)
          };
        };
      });
  });
  
