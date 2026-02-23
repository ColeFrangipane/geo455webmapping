const map = L.map("map").setView([45.10617608844984, -87.6209157105656] ,9.5);

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);

var myIcon1 = L.icon({
    iconUrl: 'https://storage.needpix.com/rsynced_images/golf-307610_1280.png',
    iconSize: [30, 50],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});



L.marker([44.86866522, -87.4470866], {icon: myIcon1})
  .addTo(map)
  .bindPopup("<b>Idlewild Golf Club!</b><br> -Sturgeon Bay");

L.marker([44.88945418, -87.36038857], {icon: myIcon1})
  .addTo(map)
  .bindPopup("<b>Cherry Hills Golf and Lodge!</b><br> -Sevastopol");


L.marker([45.04585285, -87.29748228], {icon: myIcon1})
  .addTo(map)
  .bindPopup("<b>The Alpine Golf Course!</b><br> -Egg Harbor");


L.marker([45.01635207, -87.32439658], {icon: myIcon1})
  .addTo(map)
  .bindPopup("<b>Horseshoe Bay Golf Club!</b><br> -Egg Harbor");


L.marker([45.06384833, -87.25736753], {icon: myIcon1})
  .addTo(map)
  .bindPopup("<b>The Orchards at Egg Harbor!</b><br> -Egg Harbor");


L.marker([45.1578609, -87.19228508], {icon: myIcon1})
  .addTo(map)
  .bindPopup("<b>Pensinsula State Park Golf Course!</b><br> -Ephraim");
 

L.marker([45.05574623, -87.25791766], {icon: myIcon1})
  .addTo(map)
  .bindPopup("<b>Stone Hedge Golf!</b><br> -Egg Harbor");


L.marker([45.04521332, -87.138189], {icon: myIcon1})
  .addTo(map)
  .bindPopup("<b>Maxwelton Braes Golf Course!</b><br> -Baileys Harbor")


L.marker([45.36808621, -86.92925427], {icon: myIcon1})
  .addTo(map)
  .bindPopup("<b>Deer Run Golf Course!</b><br> -Washington Island")
 

L.marker([44.77693957, -87.34385027], {icon: myIcon1})
  .addTo(map)
  .bindPopup("<b>27 Pines Golf Course!</b><br> -Clay Banks")

