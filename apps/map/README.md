# Map Viewer

Web-based indoor map viewer for ProjectGuide

https://github.com/user-attachments/assets/d8f08559-d66f-4577-ae0e-420b389cabb8

## What it does currently
- Ingests venue metadata (`venue-bundle.json`) and per-floor SVG floorplans
  - Uses test data handcrafted from Oakville Place (Oakville, ON) map data
- Renders interactive SVG layers with tap-to-select polygon highlighting
- Projects labels onto screen overlay with viewport culling
- Basic drag panning, zoom controls, floor switching, layer toggling

## Run locally

```
npm install
npm run dev
```
