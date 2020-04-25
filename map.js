// Good article describing the process: https://bost.ocks.org/mike/map/

// dataSelector is used for specifying what borders should be shown
function drawMap({ dataSelector = 'states' }) {
  const selector = '#map';
  document.querySelector(selector).innerHTML = "" // clear map content

  // this is calculating some variables based on container size
  const bbox = d3.select(selector).node().getBoundingClientRect();
  const width = bbox.width;
  const height = 1.2 * bbox.width;
  const scale = [4.84 * width];
  const translate = [width / 2, height / 2]

  // setting up the svg
  const path = d3.geo.path();
  const svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);
  const url = './dist/topojson/germany.json'

  // getting and drawing the data
  d3.json(url, function(error, topology) {
    if (error) throw error;

    // const states =  // states data
    // const counties = topojson.feature(topology, topology.objects.counties); // detailed data
    // const berlin = topojson.feature(topology, topology.objects.berlin); // berlin districts data

    const mapDetails = topojson.feature(topology, topology.objects[dataSelector]);

    // projection needs some work for better positioning
    const projection = d3.geo.albers()
      .center([10.6, 51.3])
      .rotate([2, 0])
      .parallels([50, 60])
      .scale(scale)
      .translate(translate);

    const path = d3.geo.path()
      .projection(projection);

    svg
      .selectAll("path")
      .data(mapDetails.features)
      .enter().append("path")
      .attr("d", path);
  });
}

drawMap({ dataSelector: 'states' })

function redrawMap(selection) {
  console.log('redraw with', selection)
  drawMap({ dataSelector: selection })
}