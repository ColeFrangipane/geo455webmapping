var OpenStreetMap_DE = L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var mymap = L.map('map', {
    center: [43.09157730670122, -89.41174811804763],
    zoom: 7,
    layers: OpenStreetMap_DE,
});  


var migrationLayer = new L.migrationLayer({
    map: mymap,
    data: data,
    pulseRadius:25,
    pulseBorderWidth:1,
    arcWidth:1,
    arcLabel:false,
    arcLabelFont:'14px sans-serif',
    maxWidth:10
});

migrationLayer.addTo(mymap);


var cities = L.geoJson(loc, {
     style: function (feature) {
        return { color: '#5362f3', weight: 0.5, opacity: 0.7};
    },
    onEachFeature: function(feature, featureLayer) {
        featureLayer.bindTooltip(feature.properties.NAME, {permanent: false, direction: 'right'});
    }
}).addTo(mymap);
    
mymap.fitBounds(cities.getBounds());


function hide(){
    migrationLayer.hide();
}
function show(){
    migrationLayer.show();
}
function play(){
    migrationLayer.play();
}
function pause(){
    migrationLayer.pause();
}
   