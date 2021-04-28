
//Set up the colour scale
var color = d3.scale.category20();


d3.json("data/convertcsv.json", function(error, myjson) {
 if (error) throw error;




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




//  var nodes = {};

// Compute the distinct nodes from the links.
//links.forEach(function(link) {
//    link.source = nodes[link.source] || 
//        (nodes[link.source] = {name: link.source});
//    link.target = nodes[link.target] || 
//        (nodes[link.target] = {name: link.target});
//    link.value = +link.value;
//});

var width = 1000,
    height = 800;

var force = d3.layout.force()
    .nodes(d3.values(myNodes))
    .links(myLinks)
    .size([width, height])
    .linkDistance(120)
    .charge(-300)
    .on("tick", tick)
    .start();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// build the arrow.
svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .attr("fill", "#C0C0C0")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

// add the links and the arrows
var path = svg.append("svg:g").selectAll("path")
    .data(myLinks)
  .enter().append("svg:path")
//    .attr("class", function(d) { return "link " + d.type; })
    .attr("class", "link")
          .style("stroke-width", function (d) {
        return (d.value)*1.2;
        })
    .attr("marker-end", "url(#end)");

// define the nodes
var node = svg.selectAll(".node")
    .data(myNodes)
  .enter().append("g")
    .attr("class", "node")
            .on("mouseover", mouseover)
        .on("mouseout", mouseout)
    .call(force.drag);

// add the nodes
//node.append("circle")
//    .attr("r", 5);

node.append("circle")
        .attr("r", function (d) {
        return Math.sqrt(d.weight)*5;
        })
        .style("fill", function (d) {
        return color(d.group);
        })
        .on("dblclick", dblclick)
        .call(force.drag);



// add the text 
node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });



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

    node
        .attr("transform", function(d) { 
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




   