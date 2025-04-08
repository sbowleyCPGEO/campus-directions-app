// Import necessary modules from ArcGIS API
import Map from "https://js.arcgis.com/4.32/@arcgis/core/Map.js";
import MapView from "https://js.arcgis.com/4.32/@arcgis/core/views/MapView.js";
import Graphic from "https://js.arcgis.com/4.32/@arcgis/core/Graphic.js";
import GraphicsLayer from "https://js.arcgis.com/4.32/@arcgis/core/layers/GraphicsLayer.js";
import Directions from "https://js.arcgis.com/4.32/@arcgis/core/widgets/Directions.js";
import TravelMode from "https://js.arcgis.com/4.32/@arcgis/core/rest/support/TravelMode.js";
import Point from "https://js.arcgis.com/4.32/@arcgis/core/geometry/Point.js";

// Create the map object
const map = new Map({
  basemap: "streets-navigation-vector"
});

// Create the map view and attach it to the "viewDiv" container in HTML
const view = new MapView({
  container: "viewDiv", // This links to the div where the map will be displayed
  map: map,
  center: [-97.75, 30.25], // Example center for map (adjust for your campus)
  zoom: 15 // Default zoom level
});

// Create a GraphicsLayer to hold custom graphics like points and routes
const graphicsLayer = new GraphicsLayer();
map.add(graphicsLayer);

// Create an example point graphic for route start and end
const startPoint = new Graphic({
  geometry: new Point({
    longitude: -118.4600, // Example coordinates for the start point
    latitude: 34.0650
  }),
  symbol: {
    type: "simple-marker", // A simple circle marker for the point
    color: "blue"
  }
});

const endPoint = new Graphic({
  geometry: new Point({
    longitude: -118.4500, // Example coordinates for the end point (adjust as needed)
    latitude: 34.0705
  }),
  symbol: {
    type: "simple-marker", // A simple circle marker for the point
    color: "green"
  }
});

// Add the points to the graphics layer
graphicsLayer.add(startPoint);
graphicsLayer.add(endPoint);

// Optional: Add Directions Widget
const directionsWidget = new Directions({
  view: view,
  routeServiceUrls: [
    "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World" // Esri World Routing Service
  ],
  travelMode: TravelMode.walking, // Walking directions by default
  stops: [startPoint, endPoint] // Define stops for the route
});

// Add Directions widget to the top-right corner of the map
view.ui.add(directionsWidget, "top-right");
