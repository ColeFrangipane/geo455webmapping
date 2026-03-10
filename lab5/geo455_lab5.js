var streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2NoYXVkaHVyaSIsImEiOiJjazBtcG5odG8wMDltM2JtcjdnYTgyanBnIn0.qwqjMomdrBMG36GQKXBlMw', {
    maxZoom: 18,
    attribution: 'Map data &copy; OpenStreetMap contributors, Imagery © Mapbox',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
});

var imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
});

var map = L.map("map", {
  center: [6.794952075439587, 20.91148703911037],
  zoom: 2,
  layers: [streets]
});

var homeCenter = map.getCenter();
var homeZoom = map.getZoom();

/* Popups with images */
var greatwallPopup =  "Great Wall of China<br/><img src=https://upload.wikimedia.org/wikipedia/commons/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg width='150px'/>";
var chichenPopup = "Chichen-Itza<br/><img src=https://upload.wikimedia.org/wikipedia/commons/5/51/Chichen_Itza_3.jpg width='150px'/>";
var petraPopup = "Petra<br/><img src=https://cdn2.picryl.com/photo/2018/04/20/a-view-of-the-monastery-in-the-ancient-city-of-petra-b59d49-1024.jpg width='150px'/>";
var machuPopup = "Machu Picchu<br/><img src=https://upload.wikimedia.org/wikipedia/commons/c/c2/Machu_Picchu_maravilla_del_mundo.jpg width='150px'/>";
var christPopup = "Christ the Redeemer<br/><img src=https://upload.wikimedia.org/wikipedia/commons/0/0d/Rio_de_Janeiro_-_Cristo_Redentor_01.jpg width='150px'/>";
var coloPopup = "Colosseum<br/><img src=https://www.reidsitaly.com/images/lazio/rome/sights/colosseum-ext.jpg width='150px'/>";
var tajPopup = "Taj Mahal<br/><img src=https://live.staticflickr.com/5039/14267206165_e1f8e96f22_b.jpg width='150px'/>";

var customOptions = { maxWidth: '150', className: 'custom' };

/* LayerGroup and data */
var landmarks = L.layerGroup().addTo(map);

var wonders = [
  { name: "Petra", coords: [30.3285, 35.4444], popupHtml: petraPopup },
  { name: "Colosseum", coords: [41.8902, 12.4922], popupHtml: coloPopup },
  { name: "Machu Picchu", coords: [-13.1629, -72.5450], popupHtml: machuPopup },
  { name: "Christ the Redeemer", coords: [-22.9517, -43.2104], popupHtml: christPopup },
  { name: "Taj Mahal", coords: [27.1753, 78.0421], popupHtml: tajPopup },
  { name: "Chichen-Itza", coords: [20.6793, -88.5682], popupHtml: chichenPopup },
  { name: "Great Wall of China", coords: [40.4505, 116.5490], popupHtml: greatwallPopup }
];

L.easyButton(
  '<img src="images/globe_icon.png" height="60%"/>',
  function (){
    map.setView(homeCenter, homeZoom);
  },
  "Home"
  ).addTo(map);
/* Custom Icons */
var iconFiles = [
  "images/icon_1.png",
  "images/icon_2.png",
  "images/icon_3.png",
  "images/icon_4.png",
  "images/icon_5.png",
  "images/icon_6.png",
  "images/icon_7.png"
];

var wonderIcons = [];

for (var i = 0; i < iconFiles.length; i++) {
  wonderIcons.push(
    L.icon({
      iconUrl: iconFiles[i],
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -28]
    })
  );
}

/* Add wonders to map */
function addWondersToLayer(dataArray, layerGroup, iconsArray) {
  var markers = [];

  for (var i = 0; i < dataArray.length; i++) {
    var feature = dataArray[i];

    var marker = L.marker(feature.coords, { icon: iconsArray[i] }).addTo(layerGroup);

    marker.bindPopup(feature.popupHtml, customOptions);

    marker.bindTooltip(feature.name, {
      direction: "top",
      sticky: true,
      opacity: 0.9
    });

    markers.push(marker);
  }

  return markers;
}

var wonderMarkers = addWondersToLayer(wonders, landmarks, wonderIcons);

/* Layer control */
var baseLayers = {
  'Satellite Imagery': imagery,
  'Streetmap': streets
};

var overlays = {
  "World Wonders": landmarks
};

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);

/* Map click popup */
var clickPopup = L.popup();

function onMapClick(e) {
  var lat = e.latlng.lat;
  var lon = e.latlng.lng;

  clickPopup
    .setLatLng(e.latlng)
    .setContent(
      "You clicked the map at:<br>" +
      "<b>Lat:</b> " + lat.toFixed(5) + "<br>" +
      "<b>Lon:</b> " + lon.toFixed(5)
    )
    .openOn(map);

  document.getElementById("click-lat").textContent = lat.toFixed(5);
  document.getElementById("click-lon").textContent = lon.toFixed(5);
}

map.on("click", onMapClick);

/* Wonder buttons */
var buttonsDiv = document.getElementById("wonder-buttons");
var wonderZoom = 6;

for (var i = 0; i < wonders.length; i++) {
  (function(index) {

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-outline-secondary btn-sm text-start";

    btn.innerHTML =
      '<img src="' + iconFiles[index] + '" style="width:18px;height:18px;margin-right:8px;">' +
      wonders[index].name;

    btn.addEventListener("click", function() {
      map.setView(wonders[index].coords, wonderZoom);
      wonderMarkers[index].openPopup();
    });

    buttonsDiv.appendChild(btn);

  })(i);
}

/* ISS Tracker */
var issIcon = L.icon({
  iconUrl: "images/iss200.png",
  iconSize: [80, 52],
  iconAnchor: [25, 16]
});

var issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);

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

getISS();
setInterval(getISS, 1000);

document.getElementById("btn-iss").addEventListener("click", function() {
  var ll = issMarker.getLatLng();
  map.setView([ll.lat, ll.lng], 4);
});

/* MiniMap */
var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; OpenStreetMap'
});

var miniMap = new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
}).addTo(map);