function fstrata() {
  var a = Array();
  for(var s=0; s<authors.length; s++)
    a.push(fstratum(s));
  return a;
 }

function fstratum(a) {
	var res = [];	
	 if(typeof nb_previous_day != "undefined" && !isNaN(nb_previous_day[a]) && !isNaN(nb_previous_day[a]) ) {
    (function(v, h, d, w) {
       res.push({value: function() { return w; }, label:"Strata Previous Day", category:a}) 
       res.push({value: function() { return d; }, label:"Strata Previous Week", category:a}) 
       res.push({value: function() { return h; }, label:"Strata Rest", category:a})
    })(a, nb_previous_day[a], nb_previous_week[a], nb_all[a]);
  } else {
       res.push({value: function() { return 0; }, label:"Strata Previous Day", category:a}) 
       res.push({value: function() { return 0; }, label:"Strata Previous Week", category:a}) 
       res.push({value: function() { return 0; }, label:"Strata Rest", category:a})
  }
  return res;
}

var chart_sedivn = function(xml) {
			
			current_time = min_time;
			prev_time=min_time;
			d3.select("#min_time").text(min_time);
			d3.select("#max_time").text(max_time);

			// Visual Sedimentation init
      var mySettings = {
        	width:800,
         	height:350,
          chart:{	
						x:0,
						y:20,	
        },
        data:{model:toModel(authors),
             strata: function() { return fstrata(); },
              stream:"direct"
        },
        sedimentation:{
          token:{
            size:{original:5,minimum:0}
        },
        aggregation:{
            height:150,
            maxData:max_commits
          },
         suspension:{
             decay:{power:1}
          }
        },
        chart:{
            x:0,
            y:0,
            width:800,
            height:330
          },
        options:{
          layout:false
        }
      }

var w = 800;
var h = 150;
       
var xx = d3.scale.linear()
   .domain([0, authors.length])
   .range([0, mySettings.width]);

var yy = d3.scale.linear()
   .domain([0, max_commits])
   .rangeRound([0, mySettings.sedimentation.aggregation.height]);

var nb_commits=init_array(authors.length+1);

entries.map(function (data) {
	var t = authors.indexOf(d3.select(data).select("author")[0][0].textContent);
	if(typeof(nb_commits[t]) == 'undefined')
		return;//	nb_commits[t] = 0;

		nb_commits[t]++;
});

						
max_commits =  d3.max(nb_commits, function(data) {
  return data;
});

var chart = d3.select("#barChartOverlay").append("svg")
  .attr("class", "chart")
  .attr("width", mySettings.width)
  .attr("height", mySettings.height+20).append("g").attr("transform", "translate(0, 0)");

var colorRange = d3.scale.category10();

/*
var colorRange = function (num){
  var colors = [];
  colors[0] = 'red';
  colors[1] = 'red';
  colors[2] = 'red';
  colors[3] = 'red';
  colors[4] = 'red';
  colors[5] = 'red';
  colors[6] = 'red';
  colors[7] = 'red';
  colors[8] = 'red';
  colors[9] = 'red';
  colors[10] = 'red';
  colors[11] = 'red';
  colors[12] = 'red';
  return colors[num];
}
*/


/* If we want shadows instead of dots
		chart.selectAll("rect")
		     .data(nb_commits)
		   .enter().append("rect")
		     .attr("x", function(d, i) { return xx(i) - .5; })
		     .attr("y", function(d) { return h - yy(d) - .5; })
		     .attr("width", mySettings.width / authors.length)
		     .attr("class", "overlayBar")
		     .style("fill", function(d,i) { return colorRange(i); })
		     .attr("height", function(d) { return yy(d); });
*/
    chart.selectAll("line.top")
         .data(nb_commits)
       .enter().append("line")
         .attr("x1", function(d, i) { return xx(i) +5; })
         .attr("x2",  function(d, i) { return mySettings.width / authors.length+xx(i) -5; })
         .attr("y1", function(d) { return h-yy(d)+ 1.5; })
         .attr("y2", function(d) { return h-yy(d)+ 1.5; })
         .style("stroke-dasharray", "2, 1")
         .style("stroke-width", "1")
         .attr("class", "top")
         .style("opacity", .3)
         .style("stroke", function(d,i) { return colorRange(i); });
         console.log(colorRange(i))

    chart.selectAll("line.left")
         .data(nb_commits)
       .enter().append("line")
         .attr("x1", function(d, i) { return xx(i) +5; })
         .attr("x2", function(d, i) { return xx(i) +5; })
         .attr("y1", function(d) { return h-yy(d)+ 1.5; })
         .attr("y2", function(d) { return h; })
         .style("stroke-dasharray", "2, 1")
         .style("stroke-width", "1")
         .attr("class", "left")
         .style("opacity", .3)
         .style("stroke", function(d,i) { return colorRange(i); });

    chart.selectAll("line.right")
         .data(nb_commits)
       .enter().append("line")
         .attr("x1", function(d, i) { return xx(i) +mySettings.width / authors.length-5; })
         .attr("x2", function(d, i) { return xx(i) +mySettings.width / authors.length-5; })
         .attr("y1", function(d) { return h-yy(d)+ 1.5; })
         .attr("y2", function(d) { return h; })
         .style("stroke-dasharray", "2, 1")
         .style("stroke-width", "1")
         .attr("class", "right")
         .style("opacity", .3)
         .style("stroke", function(d,i) { return colorRange(i); });


   chart.append("line")
         .attr("x1", 0)
         .attr("x2", mySettings.width)
         .attr("y1", 150)
         .attr("y2", 150)
         .style("stroke-width", .5)
         .attr("class", "bottom")
         .style("opacity", 1)
         .style("stroke", "black");

      var sediBarChart = $("#barChart").vs(mySettings).data('visualSedimentation');

      var fake_authors = Array('Direct', 'Brightroll', 'MediaAz', 'Clicksor', 'Pinterest', 'DoubleClick', 'Google', 'Facebook', 'Bing', 'Yahoo', 'Criteo')

      d3.selectAll(".gcol").append("text")
          .attr("dy", "16.5em")    
          .attr("dx", mySettings.width/(2*mySettings.data.model.length))
          .attr("text-anchor", "middle")
          .attr("vertical-align", "middle")
		  		.attr("class", function(d, i) { return "coltext coltext_"+i/4; })
          .text(function(d, ii) {
          //	if(ii%4==0) {
 						return fake_authors[ii/4];//truncate(authors[ii], 10); // truncate(authors[ii/4], 10);
          	//}
          });

   	return sediBarChart;  
  }