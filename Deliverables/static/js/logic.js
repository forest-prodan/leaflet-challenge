// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});


function chooseColor(depth) {
  var colorScale = chroma.scale(["#FFFF00", "#1cf400", "#0021ff", "#8806ce", "#cc0000"]).domain([-5, 250]);
  return colorScale(depth);
}

function createFeatures(earthquakeData, otherThing) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Magnitude: ${(feature.properties.mag)}</p><p>Depth: ${(feature.geometry.coordinates[2])}</p>`);
  };

  function createMarkers(feature, location) {
    let options = {
      radius: feature.properties.mag * 5,
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.75
    }
    return L.circleMarker(location, options);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createMarkers
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Dark View": dark
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      62.477521, -152.200742
    ],
    zoom: 5.5,
    layers: [dark, earthquakes]
  });

  // Create a new legend control and specify its position
  var legend = L.control({ position: "bottomright" });

  // Define the legend HTML content
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend');
  
  // Loop through the colors and values of your choropleth data
  // Create a new <div> for each color and value
  // Set the background color and add text or labels
  
  // Example:
    var grades = [-5, 58.75, 122.5, 186.25, 250];
    var colors = ["#FFFF00", "#1cf400", "#0021ff", "#8806ce", "#cc0000"];
  
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<div class="legend-item" style="background-color:' + colors[i] + '"></div>' +
        '<label>' + grades[i] + '</label>';
    }
  
    return div;
    
  };

  // Add the legend control to the map
  legend.addTo(myMap);

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);
};
