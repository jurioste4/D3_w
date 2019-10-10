var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label                     
function xScale(rawData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(rawData, d => d[chosenXAxis]),
      d3.max(rawData, d => d[chosenXAxis])
    ])
    .range([0, width]);
  console.log(xLinearScale);
  return xLinearScale;
};

// function used for updating y-scale var upon click on axis label                     
function yScale(rawData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(rawData, d => d[chosenYAxis]),
      d3.max(rawData, d => d[chosenYAxis])
    ])
    .range([height, 0]);
  console.log(yLinearScale);
  return yLinearScale;
};

// function used for updating xAxis var upon click on axis label                     
function renderXAxis(newXScale, xAxis) {                                             
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  console.log(xAxis);
  return xAxis;
};
                                                                                     
function renderYAxis(newYScale, yAxis) {                                             
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  console.log(yAxis);
  return yAxis;
};

// function used for updating circles group with a transition to
// new circles
function renderXCircles(circlesGroup, newScale, newAxis) {
  circlesGroup.selectAll("circle").transition()
    .duration(1000)
    .attr("cx", d => newScale(d[newAxis]));
  circlesGroup.selectAll("text").transition()
    .duration(1000)
    .attr("x", d => newScale(d[newAxis]));
  console.log(circlesGroup);
  return circlesGroup;
};

function renderYCircles(circlesGroup, newScale, newAxis) {
  circlesGroup.selectAll("circle").transition()
    .duration(1000)
    .attr("cy", d => newScale(d[newAxis]));
  circlesGroup.selectAll("text").transition()
    .duration(1000)
    .attr("y", d => newScale(d[newAxis]));
  console.log(circlesGroup);
  return circlesGroup;
};
// function used for updating circles group with new tooltip
// Update the label displayed on the tool tip                                        
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var xlabel = "In Poverty (%):";
  }
  else if (chosenXAxis === "age"){
    var xlabel = "Age (Median):";
  }
  else {
    var xlabel = "Household Income (Median):";
  };
  console.log('xlabel is: ', xlabel);
// --------------------------------------
  if (chosenYAxis === "obese"){
    var ylabel = "Obese (%):";
  }
  else if (chosenYAxis === "smokes"){
    var ylabel = "Smokes (%):";
  }
  else {
    var ylabel = "Lacks Healthcare (%):";
  };
  console.log('ylabel is:  ', ylabel);

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([0, 0])
    .html(function(d) {
      return (`<center>${d.abbr}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}</center>`);              
    });
  console.log('tool tip processed properly');

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
  console.log('circles group - tool tip', circlesGroup);
  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
// Beginning of MAIN FUNCTION
d3.csv("./assets/data/data.csv").then(function(rawData) {                                           
  rawData.forEach(function(d){
      d.smokes = +d.smokes;
      d.obesity = +d.obesity;
      d.healthcare = +d.healthcare;
      d.age = +d.age;
      d.poverty = +d.poverty;
      d.income = +d.income;
      console.log(d);
  });
  console.log('rawData is', rawData);

  // xLinearScale function above csv import                                          
  var xLinearScale = xScale(rawData, chosenXAxis);
  console.log('xLinearScale under csv is:  ', xLinearScale);

  // Create y scale function                                                         
  var yLinearScale = yScale(rawData, chosenYAxis);
  console.log('yLinearScale under csv is:  ', yLinearScale);

  // Create initial axis functions                                                   
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  console.log('initial axis function might have worked this time');

  // append x axis                                                                  
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  console.log('xAxis is :', xAxis);

  // append y axis                                                                    
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);
  console.log('yAxis is: ', yAxis);

  console.log('X chosenXAxis', chosenXAxis);
  // console.log('y chosenYAxis', chosenYaxis);

  // append initial circles
  circlesGroup = chartGroup.selectAll("g.dot")    
    .data(rawData)
    .enter().append('g');
  circlesGroup.append("circle")
    .attr("class", "dot")
    .attr("r", "12")
    .attr("cx", data =>xLinearScale(data[chosenXAxis]))
    .attr("cy", data =>yLinearScale(data[chosenYAxis]))
    .attr("fill", "pink")
    .attr("opacity", "05");
  circlesGroup.append("text").text(function(d){
    return d.abbr;
    })
    .attr("x", data =>xLinearScale(data.poverty))
    .attr("y", data =>yLinearScale(data.healthcare))
    .attr("text-anchor", "middle")
    .attr("font-size", "60%")                    
                                                              

//   LABEL BUTTONS                                                                   
  // Create group for  2 x- axis labels                                              
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")      
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") 
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")         
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xlabelsGroup.append("text")                                    
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income")
    .classed("inactive", true)
    .text("Household Income (Median)");

  // create group for y axis labels                                               
  // append y axis                                                                
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("dy", "0.375em");                                     

  var obeseLabel = ylabelsGroup.append("text")
    .attr("y", 80 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "obesity")
    .classed("inactive", true)
    .text("Obese (%)");     
  var healthcareLabel = ylabelsGroup.append("text")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare")
    .classed("active", true)
    .text("Lacks Health Care");

  var smokesLabel = ylabelsGroup.append("text")
    .attr("y", 60 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "smokes")
    .classed("inactive", true)
    .text("Smokes (%)");
  
                

  // updateToolTip function above csv import                                     
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

 // EVENT LISTENING                                                               
  // x axis labels event listener                                                
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;
      }
        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(rawData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);     

        // updates tooltips with new info
        // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);                  

        // changes classes to change bold text                                                       
        if (chosenXAxis === "age") {        
           ageLabel
            .classed("active", true)
            .classed("inactive", false);
            povertyLabel
            .classed("active", false)
            .classed("inactive", true);
            incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "poverty") {
            ageLabel
            .classed("active", false)
            .classed("inactive", true);
            povertyLabel
            .classed("active", true)
            .classed("inactive", false);
            incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
            ageLabel
            .classed("active", false)
            .classed("inactive", true);
            povertyLabel
            .classed("active", false)
            .classed("inactive", true);
            incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
    }) // end of x axis conversion                                                         
  
  ylabelsGroup.selectAll("text")                                                   
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenYAxis with value
      chosenYAxis = value;}

      // updates y scale for new data
      yLinearScale = yScale(rawData, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxis(yLinearScale, yAxis);

      // updates circles with new x values
      circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);     

      // updates tooltips with new info                 

      // changes classes to change bold text                                                      
      if (chosenYAxis === "obese") {        
          obeseLabel
          .classed("active", true)
          .classed("inactive", false);
          smokesLabel
          .classed("active", false)
          .classed("inactive", true);
          healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "smokes") {
          obeseLabel
          .classed("active", false)
          .classed("inactive", true);
          smokesLabel
          .classed("active", true)
          .classed("inactive", false);
          healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
          obeseLabel
          .classed("active", false)
          .classed("inactive", true);
          smokesLabel
          .classed("active", false)
          .classed("inactive", true);
          healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
      }
  }); // end of y axis conversion      

   // updates tooltips with new info
   circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);                    
});                                                  