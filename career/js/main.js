// main d3.js chart generator function:
var scatter = function(){
	var categories = [];
	
	d3.csv("js/AllOccupations.csv", function(data) {
		
		var margin = {top: 0, right: 0, bottom: 50, left: 60},
			chartOffset = ($(window).width()>=1033) ? 59 : 0,
			width = ($('#chart').width()+chartOffset) - margin.left - margin.right,
			height = 530 - margin.top - margin.bottom;
		
		// Define minimum/maximum axis values, and medians:
		var xMax = d3.max(data, function(d) { return +d.TotalEmployed2011; }) * 1.05,
			xMin = 0,
			yMax = d3.max(data, function(d) { return +d.MedianSalary2011; }) * 1.05,
			yMin = 0,
			xMed = d3.median(data, function(d) { return +d.TotalEmployed2011; }),
			yMed = d3.median(data, function(d) { return +d.MedianSalary2011;}),
			maxScale = 8,
			minScale = 1;
		
		
		//Define scales
		var x = d3.scale.linear()
			.domain([xMin, xMax])
			.range([0, width]);
			
		var y = d3.scale.linear()
			.domain([yMin, yMax])
			.range([height, 0]);
		
		// Colour classes array:
		var classes = ['high','medium','low','negative'];
		// Use in conjunction with classes array:
		var colourScale = function(val,array,active){
			if (val > 30) {
				return array[0];
			} else if (val > 10) {
				return array[1];
			} else if (val > 0) {
				return array[2];
			} else {
				return array[3];
			}
		};
		
		//Define X axis
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.tickSize(-height)
			.tickFormat(d3.format("s"));
		
		//Define Y axis
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(5)
			.tickSize(-width)
			.tickFormat(d3.format("s"));
		
		// Zoom behaviour:
		var zm = d3.behavior.zoom().x(x).y(y).scaleExtent([minScale, maxScale]).on("zoom", zoom);
		
		// Create main SVG:
		var svg = d3.select("#scatter")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.call(zm);
		
		// Create background
	/*	svg.append("rect")
			.attr("id", "bgRect")
			.attr("width", width)
			.attr("height", height)
			.attr('fill','transparent');*/
		
		//Create axes
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);
		
		var objects = svg.append("svg")
			.attr("class", "objects")
			.attr("width", width)
			.attr("height", height);
			
		//Create main 0,0 axis lines:
		/*
		objects.append("svg:line").attr("class", "axisLine hAxisLine")
			.attr("x1",0).attr("y1",0)
			.attr("x2",width).attr("y2",0)
			.attr("transform", "translate(0," + (y(0)) + ")");
			
		objects.append("svg:line").attr("class", "axisLine vAxisLine")
			.attr("x1",0).attr("y1",0)
			.attr("x2",0).attr("y2",height);
		//*/
					
		//Create median lines:
		objects.append("svg:line").attr("class", "medianLine hMedianLine")
			.attr("x1",0).attr("y1",0)
			.attr("x2",width).attr("y2",0)
			.attr("transform", "translate(0," + (y(yMed)) + ")");
			
		objects.append("svg:line").attr("class", "medianLine vMedianLine")
			.attr("x1",0).attr("y1",0)
			.attr("x2",0).attr("y2",height)
			.attr("transform", "translate(" + (x(xMed)) + ",0)");

		var quadrant = d3.select("#quadrant");
		//Create median boxes:
		function createRect(c,w,h,tx,ty,h5,p){
			objects.append("rect")
				.attr("class", c+" med")
				.attr("width", w)
				.attr("height", h)
				.attr('fill','transparent')
				.attr("transform", "translate("+tx+","+ty+")")
				.on("mouseover", function() {
					//Update the quadrant description:
					quadrant.select("h5").text(h5);
					quadrant.select("p").html(p);
					quadrant.classed("hidden", false);
				})
				.on("mouseout", function() {
					//Update the quadrant description:
					quadrant.classed("hidden", true);
					quadrant.select("h5").text("");
					quadrant.select("p").text("");
				});
		};
		createRect('tlMed',x(xMed),y(yMed),0,0,"Elite Players","Occupations in this quadrant pay the most, but employ very few &mdash; competition can be tough.");
		createRect('trMed',width-x(xMed),y(yMed),x(xMed),0,"Top Performers","Occupations in this quadrant employ lots of people and offer above-average salaries &mdash; seriously worth considering.");
		createRect('brMed',width-x(xMed),height-y(yMed),x(xMed),y(yMed),"A Good Bet","Occupations in this category may not pay the most, but there are lots of opportunities.");
		createRect('blMed',x(xMed),height-y(yMed),0,y(yMed),"A Matter of Taste","Occupations in this quadrant may not pay the most or employ the most people, but if it&rsquo;s your passion then go for it!");
		
		var tooltip = d3.select("#tooltip");
		var closeTooltip = d3.select("#closeTooltip");
		
		function updateTooltip(d,hex){
			//Update the tooltip value
			tooltip.select("#name").text(d.OccupationTitle);
			tooltip.select("#desc").text(d.Description);
			tooltip.select("#totEmp").text(numberWithCommas(d.TotalEmployed2011));
			tooltip.select("#medSal").text("$"+numberWithCommas(d.MedianSalary2011));
			tooltip.select("#projGrowth").text(d.ProjectedGrowth2020+'%');
			tooltip.select("#education").text(d.Education);
			tooltip.select("#experience").text(d.Experience);
			
			// Determine whether polygon is in left/right side of screen, and alter tooltip location accordingly:
			if ($(hex).attr("transform").substr(10,10)*1 > width/2) tooltip.classed("leftPos", true);
			else tooltip.classed("leftPos", false);

			//Show the tooltip
			if(($(hex).attr('class') != 'inactive')) 
				tooltip.classed("hidden", false);
		};
		
		//Create hexagon points
		objects.selectAll("polygon")
			.data(data)
			.enter()
			.append("polygon")
			.attr("class", function(d){
				return colourScale(d.ProjectedGrowth2020,classes);
			})
			.attr("transform", function(d) {
				return "translate("+x(d.TotalEmployed2011)+","+y(d.MedianSalary2011)+")";
			})
			.attr('points','4.569,2.637 0,5.276 -4.569,2.637 -4.569,-2.637 0,-5.276 4.569,-2.637')
			.attr("opacity","0.8")
			.on("mouseover", function(d) {
				if(!tooltip.classed("active"))
					updateTooltip(d,this);
			})
			.on("click", function(d) {
				updateTooltip(d,this);
				tooltip.classed("active", true);
				closeTooltip.classed("hidden", false);
				/*var thisPolygon = this;
				svg.selectAll("polygon")
					.attr("class", function(d){
						if (this === thisPolygon) {
							d.isActive = 1;
							return colourScale(d.ProjectedGrowth2020,classes);
						} else {
							d.isActive = 0;
							return "inactive";
						}
					})
					.sort(function(a,b){ // sort all polygons so that the selected ones move to the end
						return a.isActive - b.isActive;
					})*/;
			})
			.on("mouseout", function() {
				//Hide the tooltip
				if(!tooltip.classed("active"))
					tooltip.classed("hidden", true);
			});
		
		//Hide the tooltip
		var hideTooltip = function(){
			if(tooltip.classed("active")) {
				tooltip.classed("hidden", true);
				tooltip.classed("active", false);
				closeTooltip.classed("hidden", true);
				//filter();
			}
		};
		closeTooltip.on("click", function() {
			d3.event.preventDefault();
			hideTooltip();
		});
		
		
		// Create X Axis label
		svg.append("text")
			.attr("class", "x label")
			.attr("text-anchor", "end")
			.attr("x", width)
			.attr("y", height + margin.bottom - 10)
			.text("Total number of people employed in 2011");

		// Create Y Axis label
		svg.append("text")
			.attr("class", "y label")
			.attr("text-anchor", "end")
			.attr("y", -margin.left)
			.attr("x", 0)
			.attr("dy", ".75em")
			.attr("transform", "rotate(-90)")
			.text("Median annual salary in 2011 ($)");
		
		//If val is negative, return zero:
		function noNeg(val){
			return val = val>0 ? val : 0;
		}
	
		// Zoom/pan behaviour:
		function zoom() {
			
			// To restrict translation to 0 value
			if(y.domain()[0] < 0 && x.domain()[0] < 0) {
				zm.translate([0, height * (1 - zm.scale())]);
			} else if(y.domain()[0] < 0) {
				zm.translate([d3.event.translate[0], height * (1 - zm.scale())]);
			} else if(x.domain()[0] < 0) {
				zm.translate([0, d3.event.translate[1]]);
			}
			
			svg.select(".x.axis").call(xAxis);
			svg.select(".y.axis").call(yAxis);
				
			objects.select(".hMedianLine").attr("transform", "translate(0,"+y(yMed)+")");
			objects.select(".vMedianLine").attr("transform", "translate("+x(xMed)+",0)");
			
			function updateRect(c,w,h,tx,ty){
				objects.select("."+c)
					.attr("width", noNeg(w))
					.attr("height", noNeg(h))
					.attr("transform", "translate("+tx+","+ty+")");
			};
			updateRect('tlMed',x(xMed),y(yMed),0,0);
			updateRect('trMed',width-x(xMed),y(yMed),x(xMed),0);
			updateRect('brMed',width-x(xMed),height-y(yMed),x(xMed),y(yMed));
			updateRect('blMed',x(xMed),height-y(yMed),0,y(yMed));
			
			svg.selectAll("polygon").attr("transform", function(d) {
				return "translate("+x(d.TotalEmployed2011)+","+y(d.MedianSalary2011)+")";
			});
			
			d3.select('#zoomIn').classed('inactive', zm.scale()>=maxScale );
			d3.select('#zoomOut').classed('inactive', zm.scale()<=minScale );
		};
		
		// Filter function: Sets polygons in some categories to inactive using the category selecter:
		function filter(){
			svg.selectAll("polygon")
				.attr("class", function(d){
					if(categories.length>0 && !_.contains(categories, d.Category)) {
						$.each(categories,function(i){
							$('#navToggle span').append(categories[i]+' ');
						});
						d.isActive = 0;
						return "inactive";
					} else {
						d.isActive = 1;
						return colourScale(d.ProjectedGrowth2020,classes);
					}
				})
				.sort(function(a,b){ // sort all polygons so that the selected ones move to the end
					return a.isActive - b.isActive;
				});
		};
		
		// #####################################
		//       jQuery Nav List events:
		// #####################################
		
		// cache jQuery element calls:
		var nt = $('#navToggle'),
			nla = $('.nl a'),
			rn = $('#resetNav'),
			ntText = nt.text(); // Get the text value for the 'Select your categories' bit
		
		// If clicked anywhere on the document:
		$(document).mouseup(function(e){
			//if not the tooltip, hide the tooltip
			if ($('#tooltip').has(e.target).length === 0){
				hideTooltip();
			}
			//if not the select dropdown, hide the dropdown
			if ($('#select').has(e.target).length === 0 && nt.hasClass('active')){
				nt.removeClass('active').next('#navListContainer').slideUp();
			}
		});
		
		// Show/hide nav list when button is clicked:
		nt.off('click').on('click',function(e){
			e.preventDefault();
			$(this).toggleClass('active');
			if($(this).hasClass('active')){
				$(this).next('#navListContainer').slideDown();
			} else {
				$(this).next('#navListContainer').slideUp();
			}
		});
		
		// Filter points by category:
		nla.off('click').on('click',function(e){
			e.preventDefault();
			$(this).toggleClass('a');
			if($(this).hasClass('a')){
				categories.push($(this).text());
			} else {
				categories = _.without(categories, $(this).text());
			}
			filter();
			if(categories.length>0) {
				var cats = '',
					showedNames = 0;
				$.each(categories,function(i){
					//var added = cats += categories[i]+'; ';
					if((cats + categories[i]+'; ').length < 90) {
						var gap = (categories.length>1 && i<categories.length-1) ? '; ' : '';
						showedNames++;
						cats += categories[i]+gap;
					} else {
						return false;
					}
				});
				if((categories.length - showedNames)>1)
					cats = cats.substring(0,cats.length-2)+' + '+(categories.length - showedNames)+' other categories';
				else if ((categories.length - showedNames)>0)
					cats = cats.substring(0,cats.length-2)+' + 1 other category';
				nt.addClass('showCats').find('span').html(cats);
			} else {
				nt.removeClass('showCats').find('span').html(ntText);
			};
		});
		
		// Reset categories:
		rn.off('click').on('click',function(e){
			e.preventDefault();
			nla.removeClass('a');
			nt.removeClass('showCats').find('span').html(ntText);
			categories = [];
			filter();
		});
		
		// Reset categories AND close categories menu:
		/*$('#doneNav').off('click').on('click',function(e){
			e.preventDefault();
			nt.removeClass('active').next('#navListContainer').slideUp();;
		});*/
		
		//Annotations toggle button:
		$('#annotations').off('click').on('click',function(e){
			e.preventDefault();
			$('#chart, #quadrant, .oo').toggleClass('annotationsOn');
		});
		
		
		
		
		function trans(xy,constant){
			return zm.translate()[xy]+(constant*(zm.scale()));
		}
		// Zoom in/out buttons:
		d3.select('#zoomIn').on('click',function(){
			d3.event.preventDefault();
			if (zm.scale()< maxScale) {
				zm.translate([trans(0,-10),trans(1,-350)]);
				zm.scale(zm.scale()*2);
				zoom();
			}
		});
		d3.select('#zoomOut').on('click',function(){
			d3.event.preventDefault();
			if (zm.scale()> minScale) {
				zm.scale(zm.scale()*0.5);
				zm.translate([trans(0,10),trans(1,350)]);
				zoom();
			}
		});
		// Reset zoom button:
		d3.select('#zoomReset').on('click',function(){
			d3.event.preventDefault();
			zm.scale(1);
			zm.translate([0,0]);
			zoom();
		});
		
		// Generate Nav List from data:
		//navListGen(data);
		
	});
}

// Generate the list of categories. Only needs to be done once, then copy-paste the info from Firebug into index.html, because the static HTML copy loads faster and places less strain on the DOM than an auto-generated version.
/*
function navListGen(data){
	var foo = _.uniq(data,function(d){
			return d.Category;
		}).map(function(d){
			return d.Category;
		}).sort();;
	var nl = '';
	_.each(foo,function(d,i){
		nl+= '<li class="nl"><a href="'+i+'">'+d+'</a></li>';
	});
	$('#navList').html(nl);
};
//*/

//Add 'thousands' commas to numbers, for extra prettiness:
function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}