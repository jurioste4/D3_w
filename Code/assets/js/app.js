// @TODO: YOUR CODE HERE!
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
    .attr("height", svgHeight);

let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv")
    .then(function (data) {
        console.log(data)

        data.forEach(function (data) {
            data.healthcare = +data.healthcare;
            data.age = +data.age;
        });

        let xLinearScale = d3.scaleLinear()
            .domain([30, d3.max(data, d => d.age)])
            .range([0, width]);


        let yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.healthcare)])
            .range([height, 0]);

        let bottomAxis = d3.axisBottom(xLinearScale);
        let leftAxis = d3.axisLeft(yLinearScale);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);


        let circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.age))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "15")
            .attr("fill", "purple")
            .attr("opcaity", ".5");


        let circleLabels = chartGroup.selectAll(null).data(data).enter().append("text");

        circleLabels
            .attr("x", function (d) {
                return xLinearScale(d.age);
            })

            .attr("y", function (d) {
                return yLinearScale(d.healthcare);
            })
            .text(function (d) {
                return d.abbr;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .attr("fill", "white");





        let toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function (d) {
                return (`${d.state}<br>Health Care: ${d.healthcare}<br> Age: ${d.age}`);
            });

        chartGroup.call(toolTip);


        circlesGroup.on("click", function (data) {
            toolTip.show(data, this);
        })

            .on("mouseout", function (data, index) {
                toolTip.hide(data);
            });

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("HeathCare  ");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Age");









    });