import Map from "https://js.arcgis.com/4.32/@arcgis/core/Map.js";
import MapView from "https://js.arcgis.com/4.32/@arcgis/core/views/MapView.js";

function initializeMap() {
  console.log("Initializing Map...");

  const map = new Map({
    basemap: "streets-navigation-vector"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-97.75, 30.25], // Adjust based on your campus location
    zoom: 15
  });

  console.log("Map initialized", view); // Check the map view initialization
}
