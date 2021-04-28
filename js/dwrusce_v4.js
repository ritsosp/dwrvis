var svg = d3.select("#vis"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBodyReuse())
    .force("center", d3.forceCenter(width / 2, height / 2));


console.log("Stage I...");


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




  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(myLinks)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(myNodes)
    .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.name; });

  simulation
      .nodes(myNodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(myLinks);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}