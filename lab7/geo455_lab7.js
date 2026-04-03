var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});

var mymap = L.map('map', {
    center: [28.972443641658437, 84.59443216376953],
    zoom: 8,
    layers: Esri_WorldTopoMap
});

//Easy button variables and controls
var homeCenter = mymap.getCenter(); 
var homeZoom = mymap.getZoom();
L.easyButton('<img src="images/globe_icon.png" height="60%"/>', function () {
    mymap.setView(homeCenter, homeZoom);
}, "Home").addTo(mymap);

//Scale bar
L.control.scale({
    position: 'bottomright'
}).addTo(mymap);

// Minimap
var miniLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Add minimap control
var miniMap = new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
}).addTo(mymap);

// Peaks icon
var myIcon = new L.Icon({
     iconSize: [20, 20],
     iconAnchor: [10, 15],
     popupAnchor:  [1, -24],
     iconUrl: 'images/peaks.png'
 });

//Peaks information
var peaks = new L.geoJson(mtn_peaks, {
    onEachFeature: function(feature, featureLayer){
        featureLayer.bindPopup(
            '<p>Peak Name: <b>'+feature.properties.TITLE+ '</b></br>' +
            'Peak Height: '+feature.properties.Peak_Heigh+' m' + '</br>'+
            'Number of Deaths: '+feature.properties.number_of_+'</br>'+
            'Number of Expeditions: '+feature.properties.number_of1+'</p>'
        );
    }, 
    pointToLayer: function (feature, latlng) {
            return L.marker(latlng,{icon: myIcon});
    }
}).addTo(mymap);

//Proportional circles
function getRadius(area) {
    var radius = Math.sqrt(area/Math.PI);
    return radius * 2;
}

var propcircles = new L.geoJson(mtn_peaks, {
    onEachFeature: function(feature, featureLayer) {
        featureLayer.bindPopup(
            '<p>Peak Name: <b>' + feature.properties.TITLE + '</b></br>' +
            'Number of Expeditions: ' + feature.properties.number_of1 + '</p>');
    },
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            fillColor: "#920101", 
            color: '#920101',
            weight: 2,       
            radius: (feature.properties.number_of1*0.06),
            fillOpacity: 0.35
        }).on({
            mouseover: function(e) {
                this.openPopup();
                this.setStyle({fillOpacity: 0.8, fillColor: '#2D8F4E'});

            },
            mouseout: function(e) {
                this.closePopup();
                this.setStyle({fillOpacity: 0.35, fillColor: '#920101'});  
            }
    });
  }
});

// Heat map
var min = 0;
var max = 0;    
var heatMapPoints = [];

mtn_peaks.features.forEach(function(feature) {
    heatMapPoints.push([
        feature.geometry.coordinates[1], 
        feature.geometry.coordinates[0], 
        feature.properties.number_of_
    ]);
    
    if(feature.properties.number_of_<min||min===0) {
        min=feature.properties.number_of_;
    }
    
    if(feature.properties.number_of_>max||max===0){
        max=feature.properties.number_of_;
    }
});

var heat = L.heatLayer(heatMapPoints, {
    radius: 25,
    minOpacity: 0.5,
    gradient:{0.5: 'blue', 0.75: 'lime', 1: 'red'},
});

// Cluster map
var clustermarkers = L.markerClusterGroup();
mtn_peaks.features.forEach(function(feature) {
    clustermarkers.addLayer(L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]));
});


// Search box
var searchControl = new L.Control.Search({
    position:'topright',
    layer: peaks,
    propertyName: 'TITLE',
    marker: false,
    markeranimate: true,
    delayType: 50,
    collapsed: false,
    textPlaceholder: 'Search by Peak Name: e.g. Everest, Lhotse',   
    moveToLocation: function(latlng, title, map) {
        mymap.setView(latlng, 15);}
});

mymap.addControl(searchControl); 

/* Layer control and Menu Item */

var baseLayers = {};

var overlays = {
    "<img src='images/peaks.png' height=16> Location of Himalayan Peaks": peaks,
    "<img src='images/propcircles.png' height=16> Expeditions Proportional Circles": propcircles,
    "<img src='images/dead.jpg' height=16> Death Density Heat Map": heat,
    "<img src='images/cluster_icon.png' height=16> Clustering of Peaks": clustermarkers
};

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(mymap);