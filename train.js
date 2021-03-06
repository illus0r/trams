var margin = {top: 100, right: 20, bottom: 10, left: 100, };
var w = 1200 - margin.left - margin.right,
    h = 2000 - margin.top  - margin.bottom;

var station_points = [0, 3.24, 3.76, 5.97, 9.55, 11.8, 12.6, 16.7];
var scale_stations_km = d3.scale.linear()
    .domain([0, d3.max(station_points)])
    .range([0, w/2]);
var scale_stations = d3.scale.ordinal()
    .domain([ "Ельшанка",
         "Пл. Чекистов",
         "Пионерская",
         "Пл. Ленина",
         "Дворец Спорта",
         "ЗКО",
         "Стадион Монолит",
         "ВГТЗ"])
    .range(station_points.map(function(d){
        return scale_stations_km(d);
    }));

var time_parser = d3.time.format("%H:%M");
var scale_time = d3.time.scale()
    .domain([time_parser.parse('04:00'), time_parser.parse('24:10')])
    .range([0, h]);

var line = d3.svg.line()
    .x(function(d) {
        return scale_stations(d[0]);
    })
    .y(function(d) {
        return scale_time(time_parser.parse(d[1]));
    });
    //.interpolate("bundle");

var svg = d3.select('body').append('svg')
    .attr({
        width:   w + margin.left + margin.right,
        height:  h + margin.top + margin.bottom
    })
    .append('g')
    .attr('transform', 'translate('+margin.left+','+margin.top+')');

var axis_stations = d3.svg.axis()
    .scale(scale_stations)
    .orient("top")
    .innerTickSize(-h);

var axis_time = d3.svg.axis()
    .scale(scale_time)
    .ticks(d3.time.minute, 10)
    .innerTickSize(-w)
    //.tickSize(w)
    .orient("left");

for(var graph_index = 1; graph_index <= 2; graph_index++){
    //svg = svg.append('g')
        //.attr('transform', 'translate('+graph_index*w/2+',0)');

    d3.csv('./st12_'+(graph_index+1)+'.csv', function(dataset) {
        //dataset.map(function(data){});
        //console.log(dataset);
        dataset.map(function(d){
            var track = [];
            var type = d['type'];
            delete d['type'];
            for (var i in d){
                if(d[i]){
                    var clear_time = d[i].replace('/\[\]/','');
                    //console.log(d);
                    track.push([i, clear_time]);
                    //console.log(d[i]);
                    //d.points.push(scale_stations(i)+","+clear_time);
                }
                delete d[i];
            }
            d['track'] = track;
            d['type'] = type;
        });

        var tracks_enter = svg.selectAll('path')
            .data(dataset)
            .enter()
        var tracks = tracks_enter
            .append('path')
            .attr({
                d: function(d){
                    //console.log(d);
                    return line(d.track);
                },
                stroke: function(d){
                    switch (d.type) {
                       case '13':
                          return 'yellowgreen';
                       case 'st':
                          return 'CornflowerBlue';
                       case 'st2':
                          return 'OrangeRed';
                    }
                },
                fill: "none",
                "stroke-width": "0.3",
            });

        //var points = [];
        //svg.selectAll('path')
            //.data().map( function(d) {
                //d.track.map( function(p) {
                    //p.push(d.type);
                    //points.push(p);
            //} );
        //} );

        //var stations = svg.selectAll('ellipse')
            //.data(points)
            //.enter()
            //.append('ellipse')
            //.attr({
                //fill: function(d){
                    //switch (d[2]) {
                       //case '13':
                          //return 'green';
                       //case 'st':
                          //return 'blue';
                       //case 'st2':
                          //return 'red';
                    //}
                //},
                //cx: function(d) {
                    ////console.log(d);
                    //return scale_stations(d[0]);
                //},
                //cy: function(d) {
                    //return scale_time(time_parser.parse(d[1]));
                //},
                //rx: 3.8,
                //ry: 1.8,
                ////points: "0,0 100,100",
            //});

        var ax_s = svg.append("g")
            .attr("class", "axis_stations")
            //.attr("transform", "translate(0,"+ margin.top +")")
            .call(axis_stations)
            .attr('stroke', 'silver');

        //var ax_t = svg.append("g")
            //.attr("class", "axis_time")
            ////.attr("transform", "translate("+ margin.left +",0)")
            //.call(axis_time)
            ////.selectAll('.tick')
            //.data(axis_time.ticks(d3.time.hours), function(d) { return d; })
            //.exit()
            //.classed('minor', true);

    });
}
