# Campus Directions App

A web app that combines Esri's online routing service for driving with a custom indoor/pedestrian routing service for university campuses.

## Features

- Driving directions to parking structures (Esri)
- Walking directions across campus (your NAServer)
- Multi-leg routing with labeled paths
- Uses ArcGIS API for JavaScript 4.29

## Setup

1. Replace coordinates in `js/app.js` with real locations.
2. Replace `YOUR_API_KEY` with your ArcGIS Online API Key.
3. Replace the placeholder walking route URL after publishing your own NAServer.
4. Deploy with GitHub Pages or another static host.

## Publish on GitHub Pages

1. Push to a GitHub repo
2. Go to Settings → Pages → Source → select main branch → root (`/`)
3. Visit `https://yourusername.github.io/campus-directions-app/`
