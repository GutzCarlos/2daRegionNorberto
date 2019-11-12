var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
'Imagery © <a href="http://mapbox.com">Mapbox</a>',
mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmdhdmlzaCIsImEiOiJjaXFheHJmc2YwMDdoaHNrcWM4Yjhsa2twIn0.8i1Xxwd1XifUU98dGE9nsQ';

var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr}),
outdoors = L.tileLayer(mbUrl, {id: 'mapbox.outdoors', attribution: mbAttr}),
satellite = L.tileLayer(mbUrl, {id: 'mapbox.satellite', attribution: mbAttr}),
dark = L.tileLayer(mbUrl, {id: 'mapbox.dark', attribution: mbAttr}),
light = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
satellitestreets = L.tileLayer(mbUrl, {id: 'mapbox.streets-satellite', attribution: mbAttr});;
Thunderforest_MobileAtlas = L.tileLayer('https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: '<your apikey>',
	maxZoom: 22
});


// function getColor(d) {
//   return d == 1 ?
//       "#ffffd4" :
//       d ==2 ?
//       "#fed98e" :
//       d == 3 ?
//       "#fe9929" :
//       d == 4 ?
//       "#d95f0e" :
//       d == 5 ?
//       "#993404" :
//       "#ffffff";
// }

function getColor(d) {
  return d == "N�cleo" ?
      "#c49372" :
      d =="Directo" ?
      "#feedde" :
      "#ebc57e";
}

function style(feature) {
  return {
      fillColor: getColor(feature.properties.Ar_Infl),
      weight: .8,
      opacity: .2,
      color: "black",
      dashArray: "1",
      fillOpacity: 0.35
  };
}

var baseLayers = {
"Grayscale": grayscale,
"Streets": streets,
"Outdoors": outdoors,
"Satellite": satellite,
"Satellite Streets": satellitestreets,
"Dark Map": dark,
"Light Map": light
};


function onEachFeature(feature, layer) {
  layer.on({
      mouseover: popToFeature,
      click:wayToFeature
  });
}

function popToFeature(e) {
  var layer = e.target;
  layer.bindPopup(
      "<h5>Worker ID:</h5><p>"+ layer.feature.properties.NOM_LOC+
      "</p><br><h5>Distance (km): </h5><p>" + layer.feature.properties.TiempVj +"</p>"+
      "<h5>Travel Time (min): </h5><p>" + layer.feature.properties.Distanc +"<p>"+
      "<h5>Google Maps: <a href="+ layer.feature.properties.urlGogl +">link text</a>"
  );
} 
var geojson3;//= L.geoJson(Rutas);

function wayToFeature(e) {
  if (map.hasLayer(geojson3)) { map.removeLayer(geojson3); }
//  map.removeLayer(geojson5);
  var layer = e.target;
  function routFilter(feature) {
    if (feature.properties.id_lcld === layer.feature.properties.id_lcld) return true
  }
  var geojson3 =L.geoJson(Rutas, {
    filter: routFilter,
    color: 'blue',
    weight: 4,
    opacity: .7,
    dashArray: '1',
    lineJoin: 'round'
  });
  map.addLayer(geojson3);
  map.fitBounds(geojson3.getBounds());
}

function createCustomIcon2 (feature, latlng) {
  let  startIcon = L.icon({
    iconUrl: 'static/ct.png',
    iconSize:     [30, 30], // size of the icon
    iconAnchor:   [15, 30], // point of the icon which will correspond to marker's location
  })
  return L.marker(latlng, { icon: startIcon })
}
let myLayerOptions2 = {
  pointToLayer: createCustomIcon2
}
var endIcon = L.icon({
	iconUrl: 'static/pin3.png',
	iconSize:     [30, 30], // size of the icon
	iconAnchor:   [15, 30], // point of the icon which will correspond to marker's location
});

// // Worker Icon
function createCustomIcon (feature, latlng) {
  let myIcon = L.icon({
    iconUrl: 'static/pin6.png',
    iconSize:     [12, 12], // width and height of the image in pixels
    iconAnchor:   [6, 12], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
  })
  return L.marker(latlng, { icon: myIcon })
}

let myLayerOptions = {
  pointToLayer: createCustomIcon,
  onEachFeature: onEachFeature
}


//  d3.json(Trabajadores, function(data) {
//   // Creating a GeoJSON layer with the retrieved data
var geojson1=  L.geoJson(Localidades, myLayerOptions);
var geojson2=  L.geoJson(Region,{
    style: style,
  });


var overlayMaps = {
  "Localidades": geojson1,
  'Region': geojson2
};

  var map = L.map('map', {
    center: [17.72345, -94.09474], /*Default location */
    zoom: 10.8, /*Default Zoom */
    layers: [outdoors, geojson1, geojson2 ] // Default basemaplayer on startrup, can also give another layer here to show by default)
    });
  

L.easyButton('fa-globe', function(btn, map){
  map.setView([19.47075, -99.13868], 10.5);
}).addTo(map);

L.control.layers(baseLayers,overlayMaps).addTo(map);
var legend = L.control({ position: "bottomleft" });

legend.addTo(map);