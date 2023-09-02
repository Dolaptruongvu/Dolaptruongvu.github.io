export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiZG9sYXB0cnVvbmd2dTUiLCJhIjoiY2xrd2JueDBqMHltNTN0bXZkaHNva3I0dyJ9.Y429DHV420Msu7DJqe5Cyg";
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [-74.5, 40],
    zoom: 9,
  });

  const bound = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const marker = document.createElement("div");
    marker.className = "marker";

    new mapboxgl.Marker({
      element: marker,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({ offset: [0, -50] })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>${loc.address}:${loc.description} </p>`)
      .addTo(map);

    bound.extend(loc.coordinates);
  });

  map.fitBounds(bound);
};
