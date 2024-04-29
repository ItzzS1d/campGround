mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v9",
  zoom: 10,
  center: coordinates,
});

const marker = new mapboxgl.Marker({ color: "red", draggable: true })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      "<h6>exact location provided after booking</h6>"
    )
  )

  .addTo(map);
