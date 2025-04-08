import esriConfig from "https://js.arcgis.com/4.29/@arcgis/core/config.js";
import IdentityManager from "https://js.arcgis.com/4.29/@arcgis/core/identity/IdentityManager.js";
import OAuthInfo from "https://js.arcgis.com/4.29/@arcgis/core/identity/OAuthInfo.js";

import Map from "https://js.arcgis.com/4.29/@arcgis/core/Map.js";
import MapView from "https://js.arcgis.com/4.29/@arcgis/core/views/MapView.js";
import Graphic from "https://js.arcgis.com/4.29/@arcgis/core/Graphic.js";
import GraphicsLayer from "https://js.arcgis.com/4.29/@arcgis/core/layers/GraphicsLayer.js";
import RouteTask from "https://js.arcgis.com/4.29/@arcgis/core/tasks/RouteTask.js";
import RouteParameters from "https://js.arcgis.com/4.29/@arcgis/core/tasks/support/RouteParameters.js";
import FeatureSet from "https://js.arcgis.com/4.29/@arcgis/core/tasks/support/FeatureSet.js";
import Point from "https://js.arcgis.com/4.29/@arcgis/core/geometry/Point.js";

// Step 1: OAuth Setup
const oauthInfo = new OAuthInfo({
  appId: "YOUR_CLIENT_ID", // Replace with your ArcGIS Online OAuth app's Client ID
  popup: true,
  popupCallbackUrl: "oauth-callback.html"
});
IdentityManager.registerOAuthInfos([oauthInfo]);

IdentityManager.checkSignInStatus(oauthInfo.portalUrl + "/sharing")
  .then(initializeMap)
  .catch(() => {
    IdentityManager.getCredential(oauthInfo.portalUrl + "/sharing")
      .then(initializeMap)
      .catch((err) => console.error("OAuth Error:", err));
  });

// Step 2: Map + Routing Logic
function initializeMap() {
  const map = new Map({ basemap: "streets-navigation-vector" });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-97.75, 30.25],
    zoom: 15
  });

  const routeLayer = new GraphicsLayer();
  map.add(routeLayer);

  const userStart = new Point({ longitude: -118.4600, latitude: 34.0650 }); // Example origin
  const parking = new Point({ longitude: -118.4500, latitude: 34.0705 });   // Parking Structure 8
  const destination = new Point({ longitude: -118.4426, latitude: 34.0722 }); // Royce Hall

  // Driving directions using Esri's World Routing Service (OAuth now handles token)
  const drivingRouteTask = new RouteTask({
    url: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
  });

  const drivingParams = new RouteParameters({
    stops: new FeatureSet({
      features: [
        new Graphic({ geometry: userStart }),
        new Graphic({ geometry: parking })
      ]
    }),
    returnDirections: true,
    returnRoutes: true,
    outSpatialReference: { wkid: 102100 }
  });

  drivingRouteTask.solve(drivingParams).then((result) => {
    const route = result.routeResults[0].route;
    route.symbol = { type: "simple-line", color: "blue", width: 3 };
    routeLayer.add(route);
  }).catch((err) => console.error("Driving Route Error:", err));

  // Indoor/pedestrian walking route from parking to destination
  const walkingRouteTask = new RouteTask({
    url: "https://webmap.cloudpointgeo.com/cdptgis/rest/services/IndoorRouting/ACC_District_Routing_Service/NAServer"
  });

  const walkingParams = new RouteParameters({
    stops: new FeatureSet({
      features: [
        new Graphic({ geometry: parking }),
        new Graphic({ geometry: destination })
      ]
    }),
    returnDirections: true,
    returnRoutes: true,
    outSpatialReference: { wkid: 102100 },
    travelMode: "Walking"
  });

  walkingRouteTask.solve(walkingParams).then((result) => {
    const route = result.routeResults[0].route;
    route.symbol = { type: "simple-line", color: "green", width: 3 };
    routeLayer.add(route);
  }).catch((err) => console.error("Walking Route Error:", err));
}
