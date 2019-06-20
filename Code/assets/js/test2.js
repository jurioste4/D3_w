let svgWidth = 960;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;


let svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)



let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


var chosenXAxis = "income";

function xScale(chartdata, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(chartdata, d => d[chosenXAxis]) * 0.8,
        d3.max(chartdata, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXaxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}
function updateToolTip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === "income") {
        var label = "income:";
    }
    else {
        var label = "poverty";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
        });
    circlesGroup.call(toolTip);


    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}



d3.csv("./assets/data/data.csv").then(function (chartdata) {
    chartdata.forEach(function (data) {
        data.income = +data.income;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    var xLinearScale = xScale(chartdata, chosenXAxis);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(chartdata, d => d.healthcare)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(chartdata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5");


    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);



    var incomeLengthLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "income")
        .classed("active", true)
        .text("income level ");


    var povertyLable = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty")
        .classed("inactive", true)
        .text("poverty");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("heathcare");

    labelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(chartdata, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "income") {
                    incomeLengthLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLable
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    incomeLengthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLable
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });









})













