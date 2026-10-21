# Engineering Toolbox

A browser-based engineering calculator with no server, account, API key, or external calculation service. It is a static website and is online-only: it has no PWA manifest or registered service worker.

## Calculators

- Unit conversions across engineering and data units
- Mass and volume flow conversions
- Dimensions, volume, and estimated material weight
- Thermal calculations
- Linear sensor scaling
- Pipe pressure-drop and pump-power estimates, plus gauge/absolute pressure conversion
- DAQ logging and storage estimates

## Run or publish

The files in this repository are the website root. Publish them with any static web host, including GitHub Pages. For local use, serve this folder over HTTP; browser module imports may not work when opening `index.html` directly as a `file://` URL. No package installation or build step is required.

## Saved calculations and privacy

Calculations run in the browser. Preferences, draft inputs, and saved calculations stay in that browser's local storage; they are not uploaded and do not sync across devices. Use **Export backup** and **Import backup** to move saved calculations between browsers. A browser's website-data cleanup can remove local saves.

## Public-repository contents

This package contains the static app source and its supplied icons. Site project identifiers, Site deployment configuration, Git history, local user configuration, archives, and credentials are excluded. No license file is included.
