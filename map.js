// Good article describing the process: https://bost.ocks.org/mike/map/

// dataSelector is used for specifying what borders should be shown
let mapDataSelector = 'states'

function drawMap() {
  const selector = '#map';
  document.querySelector(selector).innerHTML = "" // clear map content

  // this is calculating some variables based on container size
  const bbox = d3.select(selector).node().getBoundingClientRect();
  const width = bbox.width;
  const height = 1.3 * bbox.width;
  const scale = [9.5 * width];
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

    const mapDetails = topojson.feature(topology, topology.objects[mapDataSelector]);

    // projection needs some work for better positioning
    const projection = d3.geo.albers()
      .center([12.6, 51.2])
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

    addZoomFunctionality()
  });
}

drawMap()

function redrawMap(selection) {
  console.log('redraw with', selection)
  mapDataSelector = selection
  drawMap()
}

window.addEventListener('resize', function(event){
  drawMap()
});

// testing zoom in ->
function addZoomFunctionality() {
  const mapElem = document.querySelector('#map')
  const berlinElem = document.querySelector('#map svg path:nth-child(3)') // todo use class

  // add zoom for berlin
  berlinElem.addEventListener('click', function() {
    mapElem.classList.toggle('berlin'); // zooms in with css
    mapElem.classList.toggle('zoomed');

    // wait a second and then renderes state data
    setTimeout(function () {
        mapDataSelector = 'berlin'
        drawMap()
    }, 1000);
  });
}