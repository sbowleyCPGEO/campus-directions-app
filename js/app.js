import Map from "https://js.arcgis.com/4.29/@arcgis/core/Map.js";
import MapView from "https://js.arcgis.com/4.29/@arcgis/core/views/MapView.js";
import Graphic from "https://js.arcgis.com/4.29/@arcgis/core/Graphic.js";
import GraphicsLayer from "https://js.arcgis.com/4.29/@arcgis/core/layers/GraphicsLayer.js";
import RouteTask from "https://js.arcgis.com/4.29/@arcgis/core/tasks/RouteTask.js";
import RouteParameters from "https://js.arcgis.com/4.29/@arcgis/core/tasks/support/RouteParameters.js";
import FeatureSet from "https://js.arcgis.com/4.29/@arcgis/core/tasks/support/FeatureSet.js";
import Point from "https://js.arcgis.com/4.29/@arcgis/core/geometry/Point.js";

const map = new Map({ basemap: "streets-navigation-vector" });

const view = new MapView({
  container: "viewDiv",
  map: map,
  center: [-97.75, 30.25],
  zoom: 15
});

const routeLayer = new GraphicsLayer();
map.add(routeLayer);

const userStart = new Point({ longitude: -97.8, latitude: 30.27 });
const parking = new Point({ longitude: -97.75, latitude: 30.252 });
const destination = new Point({ longitude: -97.748, latitude: 30.253 });

const drivingRouteTask = new RouteTask({
  url: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
  apiKey: "YOUR_API_KEY"
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
});

const walkingRouteTask = new RouteTask({
  url: "https://your-server/arcgis/rest/services/CampusPedestrianRouting/NAServer/Route"
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
});
