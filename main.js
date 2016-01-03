(function(){
var universities = [
					{'pos': [11.56786, 48.14966], 'name': 'TU-Muenchen'},
					{'pos': [16.36846, 48.19865], 'name': 'TU-Wien'},
					{'pos': [13.72900, 51.02927], 'name': 'TU-Dresden'},
					{'pos': [6.85243, 52.24103], 'name': 'Uni-Twente'}
];

var cities = [
					{'pos': [11.582, 48.135], 'name': 'TU-Muenchen', 'icon': 'http://www.mlz-garching.de/files/tum_logo.png'},
					{'pos': [16.374, 48.208], 'name': 'TU-Wien', 'icon': 'https://www.tuwien.ac.at/fileadmin/t/tuwien/downloads/cd/CD_2015/TU_Logo.gif'},
					{'pos': [13.737, 51.050], 'name': 'TU-Dresden', 'icon': 'https://tu-dresden.de/tulogosw.png'},
					{'pos': [6.894, 52.222], 'name': 'Uni-Twente', 'icon': 'http://www.charterworld.com/news/wp-content/uploads/2011/06/logo-university-of-twente.png'}
];

var countries = [
					{'pos': [10.45, 51.17], 'name': 'Germany'},
					{'pos': [14.55, 47.52], 'name': 'Austria'},
					{'pos': [5.29, 53.00], 'name': 'Netherlands'}
];

var ferry_path = [
					[11.582, 48.135],
					[16.374, 48.208],
					[13.737, 51.050],
					[6.894, 52.222],
          [11.582, 48.135]
];

var width  = 700,
	height = 570;

var projection = d3.geo.orthographic()
    .scale(3600)
    .translate([width / 2, height / 2])
    .rotate([-11, -51, 0])
    .clipAngle(90)
    .precision(.1);


var graticule = d3.geo.graticule() //change extent!!!
    .extent([[-3, 10], [23, 70]])
    .step([3, 3]);

var path = d3.geo.path()  
    .projection(projection);


var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);
var defs = svg.append("defs");
var oglow = defs.append("filter")
  .attr("id","oglow");
  oglow.append("feColorMatrix")
    .attr("in","SourceGraphic")
    .attr("type", "matrix")
    .attr("values", "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 1 0")
    .attr("result","mask");
  oglow.append("feMorphology")
    .attr("in","mask")
    .attr("radius","1")
    .attr("operator","dilate")
    .attr("result","mask");
  oglow.append("feColorMatrix")
    .attr("in","mask")
    .attr("type", "matrix")
    .attr("values", "0 0 0 0 0.6 0 0 0 0 0.5333333333333333 0 0 0 0 0.5333333333333333  0 0 0 1 0")
    .attr("result","r0");
  oglow.append("feGaussianBlur")
    .attr("in","r0")
    .attr("stdDeviation","4")
    .attr("result","r1");
  oglow.append("feComposite")
    .attr("operator","out")
    .attr("in","r1")
    .attr("in2","mask")
    .attr("result","comp");
  var frMerge = oglow.append("feMerge");
  frMerge.append("feMergeNode")
    .attr("in","SourceGraphic");
  frMerge.append("feMergeNode")
    .attr("in","r1");

var myglow = defs.append("filter")
  .attr("id","myglow");
myglow.append("feColorMatrix")
    .attr("in","SourceGraphic")
    .attr("type", "matrix")
    .attr("values", "0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 500 0")
    .attr("result","mask");
myglow.append("feMorphology")
    .attr("in","mask")
    .attr("radius","1")
    .attr("operator","erode")
    .attr("result","r1");
myglow.append("feGaussianBlur")
    .attr("in","r1")
    .attr("stdDeviation","4")
    .attr("result","r2");
myglow.append("feColorMatrix")
    .attr("in","r2")
    .attr("type", "matrix")
    .attr("values", "1 0 0 0 0.5803921568627451 0 1 0 0 0.3607843137254902 0 0 1 0 0.10588235294117647 0 0 0 -1 1")
    .attr("result","r3");
myglow.append("feComposite")
    .attr("operator","in")
    .attr("in","r3")
    .attr("in2","mask")
    .attr("result","comp");
var frMerge = myglow.append("feMerge");
  frMerge.append("feMergeNode")
    .attr("in","SourceGraphic");
  frMerge.append("feMergeNode")
    .attr("in","comp");

var hover = function(d) {
    console.log('d', d, 'event', event);
    var div = document.getElementById('tooltip');
    div.style.left = event.pageX +'px';
    div.style.top = event.pageY + 'px';
    var intro= "The four semester Master programme starts every year in winter semester (October) and will enroll up to 25 students from all over the world. Language of instruction is English. The full-time programme awards a total of 120 ECTS and is to be completed in two years. Students obtain 30 ECTS in each semester/at each university, respectively 30 ECTS for their Master thesis.";
    div.innerHTML = intro ;
  };



svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

d3.json("data.json", function(error, data) {
    svg.selectAll(".bgback")
    .data(topojson.feature(data, data.objects.land).features)
  .enter()
    .append("path")
      .attr("class", "bgback")
      .attr("d", path)
      .style("filter","url(#oglow)")
      .style("stroke", "#999")
      .style("stroke-width", 0.2);

 svg.selectAll(".bg")
    .data(topojson.feature(data, data.objects.land).features)
  .enter()
    .append("path")
      .attr("class", "bg")
      .attr("d", path)
      .style("filter","url(#myglow)")
      .style("stroke", "#999")
      .style("stroke-width", 0.2);

    
    svg.selectAll(".country")
    .data(topojson.feature(data, data.objects.countries).features)
  .enter()
    .append("path")
      .attr("class", "country")
      .attr("d", path)
      .style("stroke", "#999")
      .style("stroke-width", 0.6);

 

  var city_labels =svg.selectAll(".city_label")
    .data(cities)
    .enter();

  city_labels
    .append("text")
    .attr("class", "city_label")
    .text(function(d){return d.name;})
    .attr("font-family", "AquilineTwoRegular")
    .attr("font-size", "18px")
    .attr("fill", "#544")
    .attr("x",function(d){return projection(d.pos)[0];})
    .attr("y",function(d){return projection(d.pos)[1];});


  city_labels
    .append("circle")
    .attr("r", 3)
    .attr("fill", "black")
    .attr("cx",function(d){return projection(d.pos)[0];})
    .attr("cy",function(d){return projection(d.pos)[1];});


  svg.selectAll(".country_label")
    .data(countries)
    .enter()
    .append("text")
    .attr("class", "country_label")
    .text(function(d){return d.name;})
    .attr("font-family", "AquilineTwoRegular")
    .attr("font-size", "22px")
    .attr("fill", "#511")
    .attr("fill-opacity", ".35")
    .attr("x",function(d){return projection(d.pos)[0];})
    .attr("y",function(d){return projection(d.pos)[1];});
 



  var shipPathLine = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return projection(d)[0]; })
    .y(function(d) { return projection(d)[1]; });

  var shipPath = svg.append("path")
    .attr("d",shipPathLine(ferry_path))
    .attr("stroke","#000")
    .attr("class","ferry_path");

  var shipPathEl = shipPath.node();
  var shipPathElLen = shipPathEl.getTotalLength();

  var pt = shipPathEl.getPointAtLength(0);
  var shipIcon = svg.append("image")
          .attr("xlink:href","http://icons.iconarchive.com/icons/cheezen/web-2/128/airplane-icon.png")
          .attr("x", pt.x - 10)
          .attr("y", pt.y - 5.5)
          .attr("width", 30)
          .attr("height", 16);

var i = 0;
  var delta = 0.05;
  var dist_ease = 0.2;
  var delta_ease = 0.9;
  setInterval(function(){
    
    pt = shipPathEl.getPointAtLength(i*shipPathElLen);
    shipIcon
      .transition()
      .ease("linear")
      .duration(1000)
      .attr("x", pt.x - 10)
      .attr("y", pt.y - 5.5);
    
    //i = i + delta;

    if (i < dist_ease){
      i = i + delta * ((1-delta_ease) + i*delta_ease/dist_ease);
    }else if (i > 1 - dist_ease){
      i = i + delta * (1 - ((i - (1 - dist_ease)) * (delta_ease/dist_ease)));
    }else{
      i = i + delta;
    }
    if (i+0.0001 >= 1 || i-0.0001 <= 0)
      delta = -1 * delta;
  },1000);
  
});

//http://www.mlz-garching.de/files/tum_logo.png tum
//https://www.tuwien.ac.at/fileadmin/t/tuwien/downloads/cd/CD_2015/TU_Logo.gif tuwien
//https://tu-dresden.de/tulogosw.png tu dresden
//http://www.charterworld.com/news/wp-content/uploads/2011/06/logo-university-of-twente.png twente uni

})();