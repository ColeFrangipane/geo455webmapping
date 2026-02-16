const map = L.map("map").setView([44.8342, -87.3770] ,13);

 L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
               '<a href="https://opentopomap.org">OpenTopoMap</a>'
}).addTo(map);

L.marker([44.8342, -87.3770])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>I am Cole's Hometown.")
  .openPopup();
