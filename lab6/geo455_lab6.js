 var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});

var map = L.map("map", {
  center: [51.48882027639122, -0.1028811094342392],
  zoom: 11,
  layers: [Esri_WorldGrayCanvas]
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

function getColorDensity(value) {
    return value > 139 ? '#54278f':
           value > 87  ? '#756bb1':
           value > 53  ? '#9e9ac8':
           value > 32  ? '#cbc9e2':
                         '#f2f0f7';
}

function getColorLanguage(value) {
    return value > 6.450409 ? '#9c0808' :
           value > 4.432128 ? '#bd3131' :
           value > 2.250533 ? '#d66b6b' :
           value > 0.985702 ? '#d78b8b' :
                              '#ffbcbc';
}

function styleDensity(feature){
    return {
        fillColor: getColorDensity(feature.properties.pop_den),   
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
}

function styleLanguage(feature){
    return {
        fillColor: getColorLanguage(feature.properties.no_eng_den),
        weight: 2,
        opacity: 1,
        color: '#696969',
        fillOpacity: 0.9
    };
}

function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        fillOpacity: 0.7
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
        }
}

function resetDensityHighlight(e) {
    densitylayer.resetStyle(e.target);
    e.target.closePopup();
}
    
function resetLanguageHighlight(e) {  languagelayer.resetStyle(e.target);
  e.target.closePopup();
}


function onEachDensityFeature(feature, layer) {
    layer.bindPopup(
    '<strong>' + feature.properties.NAME + '</strong><br>' +
    '<span style="color:purple">' + feature.properties.pop_den+ ' people/hectare</span>'
    );
    
    layer.on({
        mouseover: function (e) {
        highlightFeature(e);
        e.target.openPopup();
        },
        mouseout: resetDensityHighlight
    });
}
    
function onEachLanguageFeature(feature, layer) {
  layer.bindPopup(
    '<strong>' + feature.properties.name + '</strong><br>' + 
    '<span style="color:blue">' + feature.properties.no_eng_den.toFixed(2) + ' non-English speakers/hectare</span>'
  );
  
  layer.on({
    mouseover: function (e) {
      highlightFeature(e);
      e.target.openPopup();
    },
    mouseout: resetLanguageHighlight
  });
}

var densitylayer;
densitylayer = L.geoJson(data, {
   style:styleDensity,
   onEachFeature: onEachDensityFeature
}).addTo(map);
    
var languagelayer;
languagelayer= L.geoJson(speaker_den, { 
    style: styleLanguage, 
    onEachFeature: onEachLanguageFeature 
}).addTo(map);
    

function buildLegendHTML(title, grades, colorFunction) {
    var html = '<div class="legend-title">' + title + '</div>';
    
    for (var i = 0; i < grades.length; i++) {
        var from = grades[i];
        var to = grades[i + 1];
        
        html +=
            '<div class="legend-box">' +
                '<span class="legend-color" style="background:' + colorFunction(from + 0.5) + '"></span>' +
                '<span>' + from + (to ? '&ndash;' + to: '+') + '</span>' +
                '</div>'; 
    }
    return html;
}


var densityLegendDiv = document.getElementById('density-legend');
if (densityLegendDiv) {
    densityLegendDiv.innerHTML = buildLegendHTML(
    'Population Density',
    [0, 32, 53, 87, 139],
    getColorDensity
    );
}
    
var languageLegendDiv = document.getElementById('language-legend');
if (languageLegendDiv) {
  languageLegendDiv.innerHTML = buildLegendHTML(
    'Non-English Speaker Density',
    [0, 0.99, 2.25, 4.43, 6.45],
    getColorLanguage
  );
}
    
    var baseLayers = {
  "Population Density": densitylayer,
  "Non-English Speaker Density": languagelayer
};

var overlays = {};

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);



