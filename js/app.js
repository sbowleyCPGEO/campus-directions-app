import esriConfig from "https://js.arcgis.com/4.32/@arcgis/core/config.js";
import IdentityManager from "https://js.arcgis.com/4.32/@arcgis/core/identity/IdentityManager.js";
import OAuthInfo from "https://js.arcgis.com/4.32/@arcgis/core/identity/OAuthInfo.js";
import Map from "https://js.arcgis.com/4.32/@arcgis/core/Map.js";
import MapView from "https://js.arcgis.com/4.32/@arcgis/core/views/MapView.js";
import Graphic from "https://js.arcgis.com/4.32/@arcgis/core/Graphic.js";
import GraphicsLayer from "https://js.arcgis.com/4.32/@arcgis/core/layers/GraphicsLayer.js";
import Directions from "https://js.arcgis.com/4.32/@arcgis/core/widgets/Directions.js";
import TravelMode from "https://js.arcgis.com/4.32/@arcgis/core/rest/support/TravelMode.js";
import Point from "https://js.arcgis.com/4.32/@arcgis/core/geometry/Point.js";

// OAuth Setup
const oauthInfo = new OAuthInfo({
  appId: "cckj9k4jKTQyM5fe", // Client ID
  popup: true,
  popupCallbackUrl: ""../oauth-callback.html" // Ensure this file exists and is configured properly
});

IdentityManager.registerOAuthInfos([oauthInfo]);

IdentityManager.checkSignInStatus(oauthInfo.portalUrl + "/sharing")
  .then(initializeMap)
  .catch((err) => {
    console.error("OAuth Check Error: ", err);
    IdentityManager.getCredential(oauthInfo.portalUrl + "/sharing")
      .then(initializeMap)
      .catch((err) => console.error("OAuth Error:", err));
  });

// Initialize Map
function initializeMap() {
  const map = new Map({
    basemap: "streets-navigation-vector"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-97.75, 30.25], // Adjust based on your campus location
    zoom: 15
  });

  // Create Directions Widget
  const directionsWidget = new Directions({
    view: view,
    routeServiceUrls: [
      "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World", // Esri World Routing Service
      "https://webmap.cloudpointgeo.com/cdptgis/rest/services/IndoorRouting/ACC_District_Routing_Service/NAServer" // Custom Pedestrian Routing Network
    ],
    travelMode: TravelMode.walking, // Set the default travel mode
    stops: [
      new Graphic({
        geometry: new Point({
          longitude: -118.4600, // Example origin
          latitude: 34.0650
        }),
        symbol: { type: "simple-marker", color: "blue" }
      }),
      new Graphic({
        geometry: new Point({
          longitude: -118.4500, // Parking Structure 8
          latitude: 34.0705
        }),
        symbol: { type: "simple-marker", color: "green" }
      })
    ]
  });

  // Add the Directions widget to the view
  view.ui.add(directionsWidget, "top-right");

  // Optional: Add other widgets like LayerList if needed
  const layerList = new LayerList({
    view: view
  });
  view.ui.add(layerList, "bottom-right");
}
