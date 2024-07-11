
mapboxgl.accessToken = mapToken; //maptoken got from show.ejs file
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center:listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9, // starting zoom
    style:"mapbox://styles/mapbox/dark-v11"
});
console.log(typeof(listing.geometry.coordinates));
console.log(listing.geometry.coordinates);
const marker = new mapboxgl.Marker({color : "red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 20,})
    .setLngLat(listing.geometry.coordinates)
    .setHTML(`<h4>${listing.title}</h4><p>Exact location provided after booking</p>`)
    .setMaxWidth("300px"))
    .addTo(map);
