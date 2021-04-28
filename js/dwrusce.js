//Constants for the SVG
var width = 800,
    height = 600;

//Set up the colour scale
var color = d3.scale.category20();

//Set up the force layout
var force = d3.layout.force()
    .charge(-120)
    .linkDistance(80)
    .size([width, height]);

//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//Read the data from the mis element 
//var mis = document.getElementById('mis').innerHTML;



console.log("Stage I...");


d3.json("data/convertcsv.json", function(myjson) {
    //if (error) return;

    console.log("Stage II...");
    //console.log(myjson.nodes.length);

   //Parse the JSON and feed nodes/links to graph

    //nodes and links array
    var graph = {
        "nodes": [],
        "links": []
    };


    var myNodes =[];
    var myLinks =[];



    for (var i = 0; i < myjson.nodes.length; i++) {
        //console.log("test");
        //console.log(myjson.nodes[i]);
        
        //console.log(myjson.nodes[i].orgName);
        //console.log({"source":myjson.nodes[i].Nodei, "target":myjson.nodes[i].Nodee, "value":myjson.nodes[i].Width});

        //links
        //myLinks.push({'"source"':myjson.nodes[i].Nodei, '"target"':myjson.nodes[i].Nodee, '"value"':myjson.nodes[i].Width});

        //nodes    
        //myNodes.push({'"name"': myjson.nodes[i].orgName, '"group"': myjson.nodes[i].Category});

        addI = true; addE = true; idxI = -1; idxE = -1
        for (j = 0; j < myNodes.length; j++) {
            if (myNodes[j].name == myjson.nodes[i].Nodei) {
                addI = false;
                idxI = j;
                break;
            }
        }
        for (j = 0; j < myNodes.length; j++) {
            if (myNodes[j].name == myjson.nodes[i].Nodee) {
                addE = false;
                idxE = j;
                break;
            }
        }

        if (addI) {
            idxI = myNodes.push({"name": myjson.nodes[i].Nodei, "group": myjson.nodes[i].Category}) - 1;
        }

        if (addE) {
            idxE = myNodes.push({"name": myjson.nodes[i].Nodee, "group": myjson.nodes[i].Category}) - 1;
        }

        myLinks.push({"source": idxI, "target": idxE, "value": myjson.nodes[i].Link, "item": i})
    }


    //Creates the graph data structure out of the json data
    force.nodes(myNodes)
        .links(myLinks)
        .on("tick", tick)
        .start();



    // build the arrow.
    svg.append("svg:defs").selectAll("marker")
        .data(["end"])
      .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
      .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");



    //Create all the line svgs but without locations yet
    var link = svg.selectAll(".link")
        .data(myLinks)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function (d) {
        return (d.value)*1.2;
        })
        .attr("marker-end", "url(#end)");


    //Do the same with the circles for the nodes - no 
    //Changed
    var node = svg.selectAll(".node")
        .data(myNodes)
        .enter().append("g")
        .attr("class", "node")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .call(force.drag);

    node.append("circle")
        .attr("r", function (d) {
        return Math.sqrt(d.weight)*5;
        })
        .style("fill", function (d) {
        return color(d.group);
        })
        .on("dblclick", dblclick)
        .call(force.drag);

    node.append("text")
        .attr("dx", 10)
        .attr("dy", ".35em")
        .text(function(d) { return d.name });
    //End changed


    //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
    force.on("tick", function () {
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
            return d.source.y;
        })
            .attr("x2", function (d) {
            return d.target.x;
        })
            .attr("y2", function (d) {
            return d.target.y;
        });

        //Changed
        
        d3.selectAll("circle").attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
            return d.y;
        });

        d3.selectAll("text").attr("x", function (d) {
            return d.x;
        })
            .attr("y", function (d) {
            return d.y;
        });
        
        //End Changed

    });


    // add the curvy lines
    function tick() {
        path.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + 
                d.source.x + "," + 
                d.source.y + "A" + 
                dr + "," + dr + " 0 0,1 " + 
                d.target.x + "," + 
                d.target.y;
        });
     
        node.attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")"; });
    }




    force.drag()
        .on("dragstart", dragstart);


    // action for double-clicking nodes
    function dblclick(d) {
        d3.select(this).classed("fixed", d.fixed = false);
    }


    // action for disabling node pinning by double clicking
    function dragstart(d) {
        d3.select(this).classed("fixed", d.fixed = true);
    }


    // action to take on mouse over
    function mouseover() {
        d3.select(this).select("text")
            .style("font-size", "1.3em");
    }
 

    // action to take on mouse out
    function mouseout() {
        d3.select(this).select("text")
            .style("font-size", "7px");
    }
     



});
