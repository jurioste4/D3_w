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


var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
   

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";


function xScale(usData, chosenXAxis) {

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(usData, d => d[chosenXAxis]),
            d3.max(usData, d => d[chosenXAxis]) 
        ])
        .range([0, width]);
    console.log(xLinearScale);
    return xLinearScale;

};

function yScale(usData, chosenYAxis) {

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(usData, d => d[chosenYAxis]),
            d3.max(usData, d => d[chosenYAxis]) 
        ])
        .range([height, 0]);
    console.log(yLinearScale);
    return yLinearScale;

};


function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    console.log(xAxis);
    return xAxis;
};

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    console.log(yAxis);
    return yAxis;
};

function renderXCircles(circlesGroup, newScale, newAxis) {

    circlesGroup.selectAll("circle").transition()
        .duration(1000)
        .attr("cx", d => newScale(d[newAxis]));
    circlesGroup.selectAll("text").transition()
        .duration(1000)
        .attr("x", d => newScale(d[newAxis]));
    console.log(circlesGroup);
    return circlesGroup;

}

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
  


d3.csv("./assets/data/data.csv").then(function(usData) {
  usData.forEach(function (data) {
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.poverty = +data.poverty;
    data.income = +data.income;
    console.log(data);
  });
  console.log('usData is ', usData);


    var xLinearScale = xScale(usData, chosenXAxis);
    console.log('this is xLinearScale after retrieve data', xLinearScale);

    var yLinearScale =yScale(usData,chosenYAxis);
    console.log('this is yLinearScale after retrieve data', yLinearScale);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    console.log('xAxis is: ', xAxis);

    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);
    console.log('yAxis is: ', yAxis);

 //------------------------------------------------------------------   
    circlesGroup = chartGroup.selectAll("g.dot")
        .data(usData)
        .enter().append('g');

    circlesGroup.append("circle")
        .attr("class", "dot")
        .attr("r", "12")
        .attr("cx", data => xLinearScale(data[chosenXAxis]))
        .attr("cy", data => yLinearScale(data[chosenYAxis]))
        
        .attr("fill", "pink")
        .attr("opacity", "05");
    circlesGroup.append("text").text(function(d){
        return d.abbr;
        })
        .attr("x", data =>xLinearScale(data.poverty))
        .attr("y", data =>yLinearScale(data.healthcare))
        .attr("text-anchor", "middle")
        .attr("font-size", "60%") 

    


    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") 
        .classed("active", true)
        .text("In Poverty (%)");

    var agelabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");


    var incomelabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");
    
    var ylablesGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dy", "0.375em");
    

    var obeseLabel = ylablesGroup.append("text")
        .attr("y", 80 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obese (%)");
    
    var healthcareLabel = ylablesGroup.append("text")
        .attr("y", 40 -margin.left)
        .attr("x", 0 - (height / 2))
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Missing Health Care");
    
    var smokesLabel = ylablesGroup.append("text")
        .attr("y", 60 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)");
    

    
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


    xlabelsGroup.selectAll("text")
        .on("click", function () {
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

               chosenXAxis = value;}   

                xLinearScale = xScale(usData, chosenXAxis);

                xAxis = renderXAxes(xLinearScale, xAxis);

                circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

                // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                if (chosenXAxis === "age") {
                    agelabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomelabel
                        .classed("active", false)
                        .classed("inactive", true);


                }
                else if (chosenXAxis === "poverty") {
                    agelabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomelabel
                        .classed("active", true)
                        .classed("inactive", false);

                }
                else {
                    agelabel
                    .classed("active", false)
                    .classed("inactive", true);
                    povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    incomelabel
                    .classed("active", true)
                    .classed("inactive", false);
                }
            
        });



    ylablesGroup.selectAll("text")
    .on("click", function(){
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {
        
        chosenYAxis = value;}

        yLinearScale = yScale(usData, chosenYAxis);

        yAxis = renderYAxes(yLinearScale, yAxis);

        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);




        if (chosenYAxis =="obese") {
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
        else if ( chosenYAxis === "smokes") {
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
    });
    
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup); 
        
});













