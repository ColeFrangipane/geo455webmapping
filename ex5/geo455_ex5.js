/* For additional plugins, I added the fullscreen and ruler from Leaflet's plugin library.
 * These were tools that I thought would add to the usability of this map and would be easily
 * understandable for people to use. I updated my Lab 5 JS at the bottom to include these plugins */
var streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2NoYXVkaHVyaSIsImEiOiJjazBtcG5odG8wMDltM2JtcjdnYTgyanBnIn0.qwqjMomdrBMG36GQKXBlMw', {
    maxZoom: 18,
    attribution: 'Map data &copy; OpenStreetMap contributors, Imagery © Mapbox',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
});


var USGS_USImageryTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 18,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

var map = L.map("map", {
  center: [6.794952075439587, 20.91148703911037],
  zoom: 2,
  layers: [streets]
});

var homeCenter = map.getCenter(); 
var homeZoom = map.getZoom();

L.easyButton('<img src="images/globe_icon.png" height="60%"/>', function () {
    map.setView(homeCenter, homeZoom);
}, "Home").addTo(map);

/*Create custom popups with images*/
var greatwallPopup =  "Great Wall of China<br/><img src=https://upload.wikimedia.org/wikipedia/commons/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg width='150px'/>";
var chichenPopup = "Chichen-Itza<br/><img src=https://upload.wikimedia.org/wikipedia/commons/5/51/Chichen_Itza_3.jpg width='150px'/>";
var petraPopup = "Petra<br/><img src=https://cdn2.picryl.com/photo/2018/04/20/a-view-of-the-monastery-in-the-ancient-city-of-petra-b59d49-1024.jpg width='150px'/>";
var machuPopup = "Machu Picchu<br/><img src=https://upload.wikimedia.org/wikipedia/commons/c/c2/Machu_Picchu_maravilla_del_mundo.jpg width='150px'/>";
var christPopup = "Christ the Redeemer<br/><img src=https://upload.wikimedia.org/wikipedia/commons/0/0d/Rio_de_Janeiro_-_Cristo_Redentor_01.jpg width='150px'/>";
var coloPopup = "Colosseum<br/><img src=https://www.reidsitaly.com/images/lazio/rome/sights/colosseum-ext.jpg width='150px'/>";
var tajPopup = "Taj Mahal<br/><img src=https://live.staticflickr.com/5039/14267206165_e1f8e96f22_b.jpg width='150px'/>";

var customOptions ={'maxWidth': '150','className' : 'custom'};

/*LayerGroup and Data Array*/
var landmarks = L.layerGroup().addTo(map);

var wonders = [
    { name: "Great Wall of China", coords: [40.4505, 116.5490], popupHtml: greatwallPopup },
    { name: "Chichen-Itza", coords: [20.6793, -88.5682], popupHtml: chichenPopup },
    { name: "Petra", coords: [30.3285, 35.4444], popupHtml: petraPopup },
    { name: "Machu Pichu", coords: [-13.1629, -72.5450], popupHtml: machuPopup },
    { name: "Christ the Redeemer", coords: [-22.9517, -43.2104], popupHtml: christPopup },
    { name: "Colosseum", coords: [41.8902, 12.4922], popupHtml: coloPopup },
    { name: "Taj Mahal", coords: [27.1753, 78.0421], popupHtml: tajPopup },
];

var iconFiles = [
  "images/icon_1.png",
  "images/icon_2.png",
  "images/icon_3.png",
  "images/icon_4.png",
  "images/icon_5.png",
  "images/icon_6.png",
  "images/icon_7.png",
];

var wonderIcons = [];
for (var i = 0; i < iconFiles.length; i++) {
  wonderIcons.push(
    L.icon({
      iconUrl: iconFiles[i],
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -28],
    })
  );
}

function addWondersToLayer(dataArray, layerGroup, iconsArray) {
  var markers = [];

  for (var i = 0; i < dataArray.length; i++) {
    var feature = dataArray[i];

    var marker = L.marker(feature.coords, { icon: iconsArray[i] })
      .bindPopup(feature.popupHtml, customOptions)
      .bindTooltip(feature.name, { direction: "top", sticky: true, opacity: 0.9 })
      .addTo(layerGroup);

    markers.push(marker);
  }

  return markers;
}

var wonderMarkers = addWondersToLayer(wonders, landmarks, wonderIcons);

/* ---------------------------------------------------------
   6) FUNCTION: add buttons to sidebar that zoom to each site 
   --------------------------------------------------------- */

var buttonsDiv = document.getElementById("wonder-buttons");
var wonderZoom = 7; // pick a zoom level you like

for (var i = 0; i < wonders.length; i++) {
  (function(index) {
    // Create a <button>
    var btn = document.createElement("button");
    btn.type = "button";

    // If using Bootstrap, use btn classes. If not, you can use your own CSS.
    btn.className = "btn btn-outline-secondary btn-sm text-start";

    // Use the SAME icon as the marker + show name
    btn.innerHTML =
      '<img src="' + iconFiles[index] + '" style="width:18px;height:18px;margin-right:8px;">' +
      wonders[index].name;

    // When clicked: zoom to the location + open popup
    btn.addEventListener("click", function() {
      map.setView(wonders[index].coords, wonderZoom);
      wonderMarkers[index].openPopup();
    });

    buttonsDiv.appendChild(btn);
  })(i);
}

/* Layer control and Menu Item */

var baseLayers = {
  Imagery: USGS_USImageryTopo,
  Streets: streets
};

var overlays = {};

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);

var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; OpenStreetMap'
});

/* ---------------------------------------------------------
   8) CLICK ON MAP INTERACTIVITY (Lab 5): popup + update panel 
   --------------------------------------------------------- */

// Reuse one popup object (cleaner than creating new ones each click)
var clickPopup = L.popup();

function onMapClick(e) {
  var lat = e.latlng.lat;
  var lon = e.latlng.lng;

  // Popup at the clicked location
  clickPopup
    .setLatLng(e.latlng)
    .setContent(
      "You clicked the map at:<br>" +
        "<b>Lat:</b> " + lat.toFixed(5) + "<br>" +
        "<b>Lon:</b> " + lon.toFixed(5)
    )
    .openOn(map);

  // Update the info panel
  document.getElementById("click-lat").textContent = lat.toFixed(5);
  document.getElementById("click-lon").textContent = lon.toFixed(5);
}

// Leaflet event API 
map.on("click", onMapClick);

/* ---------------------------------------------------------
   9) REAL-TIME ISS (Lab 5): moving marker + jump button
   --------------------------------------------------------- */

var issIcon = L.icon({
  iconUrl: "images/iss200.png",
  iconSize: [80, 52],
  iconAnchor: [25, 16],
});

var issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);

// API endpoint
var api_url = "https://api.wheretheiss.at/v1/satellites/25544";

function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

async function getISS() {
  try {
    var response = await fetch(api_url);
    if (!response.ok) throw new Error("ISS API error");
    var data = await response.json();
    var latitude = data.latitude;
    var longitude = data.longitude;

    issMarker.setLatLng([latitude, longitude]);

    document.getElementById("lat").textContent = latitude.toFixed(3);
    document.getElementById("lon").textContent = longitude.toFixed(3);
    document.getElementById("iss-time").textContent = formatTime(new Date());
  } catch (err) {
    document.getElementById("iss-time").textContent = "ISS unavailable";
  }
}

// Initial call + refresh
getISS();
setInterval(getISS, 1000);

// Jump to ISS button (required feature)
document.getElementById("btn-iss").addEventListener("click", function () {
  var ll = issMarker.getLatLng();
  map.setView([ll.lat, ll.lng], 4);
});

/* ---------------------------------------------------------
   10) Add minimap  — use OSM tiles (no API key needed)
   --------------------------------------------------------- */

// Add minimap control
var miniMap = new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
}).addTo(map);

/* ---------------------------------------------------------
   11) Fullscreen tool
   --------------------------------------------------------- */

map.addControl(new L.Control.FullScreen());

/* ---------------------------------------------------------
   12) Ruler plugin  — measure distances and areas
   --------------------------------------------------------- */

L.control.ruler().addTo(map);

