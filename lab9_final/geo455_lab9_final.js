// ─── Basemaps ──────────────────────────────────────────────────────────────

var esriOcean = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ' }
);

var esriTopo = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri' }
);

// ─── Map Init ───────────────────────────────────────────────────────────────

var mymap = L.map('map', {
  center: [45.1, -87.113785234],
  zoom: 10,
  layers: [esriTopo]
});

// ─── Easy Button (Home) ─────────────────────────────────────────────────────

var homeCenter = mymap.getCenter();
var homeZoom = mymap.getZoom();

L.easyButton('<img src="images/globe_icon.png" height="60%"/>', function () {
    mymap.setView(homeCenter, homeZoom);
}, "Home").addTo(mymap);

// ─── Scale Bar ──────────────────────────────────────────────────────────────

L.control.scale({ position: 'bottomright' }).addTo(mymap);

// ─── MiniMap ────────────────────────────────────────────────────────────────

var miniLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; OpenStreetMap contributors'
});

new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: 'bottomleft'
}).addTo(mymap);

// ─── Popup Builder ──────────────────────────────────────────────────────────

function buildPopup(p) {
  var deaths      = (p.LIVESLOST !== null && p.LIVESLOST !== undefined) ? p.LIVESLOST : 'Unknown';
  var yearBuilt   = p.CONSTRUCTI || 'Unknown';
  var whereBuilt  = (p.WHEREBUILT && p.WHEREBUILT.trim() !== '') ? p.WHEREBUILT : 'Unknown';
  var crashDate   = (p.CASUALTYDA && p.CASUALTYDA.trim() !== '') ? p.CASUALTYDA : 'Unknown';
  var vesselType  = (p.VESSELTYPE && p.VESSELTYPE.trim() !== '') ? p.VESSELTYPE : 'Unknown';
  var casualtyType = (p.CASUALTYTY && p.CASUALTYTY.trim() !== '') ? p.CASUALTYTY : 'Unknown';
  var length      = p.LENGTH ? p.LENGTH + ' ft' : 'Unknown';
  var depth       = p.WATERDEPTH ? p.WATERDEPTH + ' ft' : 'Unknown';
  var deathColor  = (deaths > 0) ? '#c0392b' : '#27ae60';

  return '<div style="min-width:210px;">' +
    '<div class="popup-title">⚓ ' + p.VESSELNAME + '</div>' +
    '<div class="popup-row"><span class="popup-label">Vessel Type:</span> ' + vesselType + '</div>' +
    '<div class="popup-row"><span class="popup-label">Year Built:</span> ' + yearBuilt + '</div>' +
    '<div class="popup-row"><span class="popup-label">Built In:</span> ' + whereBuilt + '</div>' +
    '<div class="popup-row"><span class="popup-label">Crash Date:</span> ' + crashDate + '</div>' +
    '<div class="popup-row"><span class="popup-label">Cause:</span> ' + casualtyType + '</div>' +
    '<div class="popup-row"><span class="popup-label">Length:</span> ' + length + '</div>' +
    '<div class="popup-row"><span class="popup-label">Lives Lost:</span> ' +
      '<strong style="color:' + deathColor + '">' + deaths + '</strong></div>' +
    '</div>';
}

// ─── Casualty Type Colors ────────────────────────────────────────────────────
// Maps casualty keywords to colors

var casualtyColors = {
  'burned':     '#e74c3c',
  'fire':       '#e74c3c',
  'foundered':  '#2980b9',
  'sunk':       '#2980b9',
  'stranded':   '#f39c12',
  'grounded':   '#f39c12',
  'abandoned':  '#8e44ad',
  'wrecked':    '#16a085',
  'collision':  '#d35400',
  'other':      '#7f8c8d'
};

function getCasualtyColor(casualtyType) {
  if (!casualtyType) return '#7f8c8d';
  var lower = casualtyType.toLowerCase();
  for (var key in casualtyColors) {
    if (lower.indexOf(key) !== -1) return casualtyColors[key];
  }
  return '#7f8c8d';
}

function getCasualtyLabel(casualtyType) {
  if (!casualtyType || casualtyType.trim() === '') return 'Unknown';
  var t = casualtyType.trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// ─── Layer 1: Ship Icon Markers ──────────────────────────────────────────────

var shipIcon = L.divIcon({
  className: 'ship-marker-icon',
  html: '<div style="font-size:22px; line-height:1; filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.5));">⚓</div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14]
});

var shipMarkers = new L.GeoJSON(ship_wrecks, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: shipIcon });
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup(buildPopup(feature.properties), { maxWidth: 280 });
  }
});

// ─── Layer 2: Proportional Circles (by vessel length) ───────────────────────

function getPropRadius(length) {
  if (!length || length <= 0) return 5;
  return Math.sqrt(length) * 1.5;
}

var propCircles = new L.GeoJSON(ship_wrecks, {
  pointToLayer: function (feature, latlng) {
    var len = feature.properties.LENGTH || 0;
    return L.circleMarker(latlng, {
      radius: getPropRadius(len),
      fillColor: '#1e5aa0',
      color: '#0d2f5e',
      weight: 1.5,
      fillOpacity: 0.45
    });
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup(buildPopup(feature.properties), { maxWidth: 280 });
    layer.on({
      mouseover: function () {
        this.setStyle({ fillOpacity: 0.85, fillColor: '#e67e22' });
        this.openPopup();
      },
      mouseout: function () {
        this.setStyle({ fillOpacity: 0.45, fillColor: '#1e5aa0' });
        this.closePopup();
      }
    });
  }
});

// ─── Layer 3: Cluster Layer ──────────────────────────────────────────────────

var clusterGroup = L.markerClusterGroup({
  showCoverageOnHover: false,
  maxClusterRadius: 50,
  iconCreateFunction: function (cluster) {
    var count = cluster.getChildCount();
    var size  = count < 10 ? 34 : count < 50 ? 42 : 52;
    var bg    = count < 10 ? '#2980b9' : count < 50 ? '#e67e22' : '#c0392b';
    return L.divIcon({
      html: '<div style="background:' + bg + '; color:#fff; border-radius:50%; width:' + size + 'px; height:' + size + 'px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:' + Math.round(size * 0.38) + 'px; border:2px solid rgba(255,255,255,0.7); box-shadow:0 1px 5px rgba(0,0,0,0.4);">' + count + '</div>',
      className: '',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  }
});

ship_wrecks.features.forEach(function (feature) {
  var coords = feature.geometry.coordinates;
  var marker = L.marker([coords[1], coords[0]], { icon: shipIcon });
  marker.bindPopup(buildPopup(feature.properties), { maxWidth: 280 });
  clusterGroup.addLayer(marker);
});

// ─── Layer 4: Casualty Type Layer ────────────────────────────────────────────

var casualtyLayer = new L.GeoJSON(ship_wrecks, {
  pointToLayer: function (feature, latlng) {
    var color = getCasualtyColor(feature.properties.CASUALTYTY);
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: color,
      color: '#fff',
      weight: 1.5,
      fillOpacity: 0.85
    });
  },
  onEachFeature: function (feature, layer) {
    var p = feature.properties;
    var color = getCasualtyColor(p.CASUALTYTY);
    var label = getCasualtyLabel(p.CASUALTYTY);

    layer.bindPopup(
      '<div style="min-width:180px;">' +
        '<div class="popup-title">💥 Casualty Details</div>' +
        '<div class="popup-row"><span class="popup-label">Vessel:</span> ' + p.VESSELNAME + '</div>' +
        '<div class="popup-row"><span class="popup-label">Cause:</span> ' +
          '<span style="color:' + color + '; font-weight:700;">' + label + '</span></div>' +
        '<div class="popup-row"><span class="popup-label">Date:</span> ' + (p.CASUALTYDA || 'Unknown') + '</div>' +
        '<div class="popup-row"><span class="popup-label">Lives Lost:</span> ' +
          '<strong style="color:' + (p.LIVESLOST > 0 ? '#c0392b' : '#27ae60') + '">' + (p.LIVESLOST || 0) + '</strong></div>' +
        '<div class="popup-row"><span class="popup-label">Hull Material:</span> ' + (p.HULLMATERI || 'Unknown') + '</div>' +
        '<div class="popup-row"><span class="popup-label">Propulsion:</span> ' + (p.PROPULSION && p.PROPULSION.trim() !== '' ? p.PROPULSION : 'Unknown') + '</div>' +
      '</div>',
      { maxWidth: 260 }
    );

    layer.on({
      mouseover: function () {
        this.setStyle({ fillOpacity: 1, weight: 2.5 });
      },
      mouseout: function () {
        this.setStyle({ fillOpacity: 0.85, weight: 1.5 });
      }
    });
  }
});

// ─── Casualty Legend (sidebar) ───────────────────────────────────────────────

var casualtyLegendItems = [
  { label: 'Burned / Fire',       color: '#e74c3c' },
  { label: 'Foundered / Sunk',    color: '#2980b9' },
  { label: 'Stranded / Grounded', color: '#f39c12' },
  { label: 'Abandoned',           color: '#8e44ad' },
  { label: 'Wrecked',             color: '#16a085' },
  { label: 'Collision',           color: '#d35400' },
  { label: 'Other / Unknown',     color: '#7f8c8d' }
];

var casualtyLegendHtml = '';
casualtyLegendItems.forEach(function (item) {
  casualtyLegendHtml +=
    '<div class="legend-box">' +
    '<span class="legend-color" style="background:' + item.color + '; border-color:' + item.color + ';"></span>' +
    '<span style="font-size:0.82rem;">' + item.label + '</span>' +
    '</div>';
});
document.getElementById('casualty-legend').innerHTML = casualtyLegendHtml;

// ─── Proportional Circle Legend (sidebar) ────────────────────────────────────

var legendSizes = [
  { label: '< 50 ft',    len: 30 },
  { label: '50–100 ft',  len: 75 },
  { label: '100–200 ft', len: 150 },
  { label: '200+ ft',    len: 250 }
];

var propLegendHtml = '';
legendSizes.forEach(function (item) {
  var r = getPropRadius(item.len);
  var d = r * 2;
  propLegendHtml +=
    '<div class="legend-box" style="align-items:center;">' +
    '<span class="prop-swatch" style="width:' + d + 'px; height:' + d + 'px;"></span>' +
    '<span style="font-size:0.82rem;">' + item.label + '</span>' +
    '</div>';
});
document.getElementById('prop-circle-legend').innerHTML = propLegendHtml;

// ─── Search Control ──────────────────────────────────────────────────────────

var searchControl = new L.Control.Search({
  position: 'topright',
  layer: shipMarkers,
  propertyName: 'VESSELNAME',
  marker: false,
  collapsed: false,
  textPlaceholder: 'Search vessel name…',
  moveToLocation: function (latlng, title, map) {
    mymap.setView(latlng, 14);
  }
});
mymap.addControl(searchControl);

// ─── Layer Control ───────────────────────────────────────────────────────────

var baseLayers = {
  '🗺️ ESRI Topo': esriTopo, 
  '🌊 ESRI (Bathymetry)': esriOcean
};

var overlays = {
  '⚓ Ship Markers': shipMarkers,
  '🔵 Proportional Circles (by Length)': propCircles,
  '🔢 Cluster Layer': clusterGroup,
  '💥 Wreck Type': casualtyLayer
};

L.control.layers(baseLayers, overlays, { collapsed: false, position: 'topright' }).addTo(mymap);

// Add ship markers on by default
shipMarkers.addTo(mymap);
