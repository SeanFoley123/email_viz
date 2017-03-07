var margin = {top: 20, right: 20, bottom: 30, left: 40},
	size = d3.select("div.graph").node().getBoundingClientRect(),
	width = size.width - margin.left - margin.right,
	height = size.width/2 - margin.top - margin.bottom;

function time_point(time) { 	// Date to num of year since jan 2004
	var month_map = {"January": 0, "February":1, "March":2, "April":3, "May":4, "June":5, "July":6, "August":7, "September":8, "October":9, "November":10,
	"December":11};
	return +(/[0-9]{4}/i.exec(time)) + month_map[/[a-z]*/i.exec(time)]/12;}

var line = d3.svg.line()
	.x(function(d){return xMap(d);})
	.y(function(d){return yMap(d);})
	.interpolate("linear"); 

// setup x 
var xValue = function(d) {return time_point(d.Time);}, // data -> value
	xScale = d3.scale.linear().range([0, width]), // value -> display
	xMap = function(d) { return xScale(xValue(d));}, // data -> display
	xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.format("d"));

// setup y
var yValue = function(d) { return d.Value;}, // data -> value
	yScale = d3.scale.linear().range([height, 0]), // value -> display
	yMap = function(d) { return yScale(yValue(d));}, // data -> display
	yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(d3.format("d"));

var color = d3.scale.category10();

var tooltip = d3.select("div.graph").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

function graph(name, data, svg){
	svg.selectAll(".line"+name)
		.data(data)
		.enter().append("path")
		.attr("class", "line"+name)
		.attr("d", function(d) { return line(data)})
		.style("stroke-width", 2)
		.style("stroke", function(d){return color(d.Name)})
		.style("fill", "none");

	// draw dots
	svg.selectAll(".dot"+name)
		.data(data)
		.enter().append("circle")
		.attr("class", "dot"+name)
		.attr("r", function(d){if(d.Value==0){return 2} else{return 3}})
		.attr("cx", xMap)
		.attr("cy", yMap)
		.attr("opacity", 1)
		.attr("stroke", "black")
		.attr("fill", function(d){return color(d.Name)})
		.on("mouseover", function(d){
			d3.select(this).transition().duration(200).
				attr("r", 8);
	  	
			tooltip.transition().duration(200)
				.style("opacity", .9);
			
			tooltip.html(d.Time+ " " + d.Value)
		       .style("left", (d3.event.pageX + 5) + "px")
		       .style("top", (d3.event.pageY - 20) + "px");})

		.on("mouseout", function(){
			d3.select(this).transition().duration(400).
				attr("r", function(d){if(d.Value==0){return 2} else{return 3}});
		
			tooltip.transition()
			   .duration(500)
			   .style("opacity", 0);});
	}

function graph_selected(data, included_lists){
	d3.select("body").selectAll("svg").remove()

	// add the graph canvas to the body of the webpage
	var svg = d3.select("div.graph").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("align", "center")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var included_data = data.filter(function(d){return included_lists.includes(d.Name)})
	var data_to_include = d3.nest()
		.key(function(d) {return d.Name}).entries(included_data)

	// don't want dots overlapping axis, so add in buffer to data domain
	xScale.domain([2003.5, 2018]);
	yScale.domain([0, d3.max(included_data, yValue)+1]);

	// x-axis
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("Year");

	// y-axis
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("# Emails");

	for (var i = 0; i<data_to_include.length; i++){	//Graph the data
		graph(data_to_include[i]['key'], data_to_include[i]['values'], svg);
	  }
}

d3.csv("data/act_data.csv", function(error, data) {
	// change string (from CSV) into number format
	data.forEach(function(d) {d.Value = +d.Value});

	var included_lists = []
	
	graph_selected(data, included_lists)

	var legend = d3.select("div.legend")

	var split_up = d3.nest().key(function(d) {return d.Name})
		// .rollup(function(v) {return v.key})
		.entries(data)

	var names = []

	for(i=0; i<split_up.length; i++){
		names.push(split_up[i].key)
	}

	legend.selectAll('button')
		.data(names)
		.enter().append("button")
		.attr("type", "button").attr('toggled', 'false')
		.text(function (d) {return d})
		.on('click', function(){
			var toggled = d3.select(this).attr('toggled');
			if (toggled == "false") {
				d3.select(this).style("background-color", color);
				d3.select(this).attr('toggled', 'true');
			}
			else {
				d3.select(this).style("background-color", "transparent");	
				d3.select(this).attr('toggled', 'false');
			}
			var name = d3.select(this).text()
			var found = false
			for(i=0; i<included_lists.length && found==false; i++){
				if(included_lists[i]==name){
					included_lists.splice(i, 1);
					found = true;
				}
			}
			if (found==false){
				included_lists.push(name)
			}
			graph_selected(data, included_lists)
		})

  });