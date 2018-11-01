# NPS-Find - Front-End

<img src="./src/utils/bison.png" alt="NPS-Find-logo" width="200"/>

**Author: Kris Sakarias**

**Version: 1.0.0**

## Overview

The frontend is built with *Vue*. Application state is managed with *Vuex*, and frontend routing is handled with *Vue-router*. The application utilizes *Babel* and *Webpack* for compiling and bundling. 

## Getting Started

1. Clone the parent repo: `git clone https://github.com/kris71990/nps-find.git`
2. Create a `.env` file in this (frontend) directory for frontend environment variables
3. `npm i` to install necessary node modules

**Environment variables**

An API key from the Google Maps Javascript API is required. The Google Maps Geocoding API should also be enabled, although the same API key is used. In the `.env` file, set `GOOGLE_API_KEY` to the value of your Google API Key. Other environment variables necessary to run the application are:

- `PORT=9000`
- `NODE_ENV=development`
- `API_URL=http://localhost:3000`

**Start the Webpack Dev Server**

From the root of the frontend directory, start the webpack dev server with `npm run watch`.


## Documentation

**Component Structure**

```
App
|_ Header
|_ Landing
  |_ SearchForm
    |_ Dashboard
      |_ ImageCarousel
      |_ ParkPanel
        |_ ParkPanelMap
        |_ CampgroundOptions
          |_ CampgroundView
          |_ CampgroundViewMap
        |_ ParkView
          |_ ParkViewMap
          |_ CampgroundOptions
            |_ CampgroundView
            |_ CampgroundViewMap
|_ StateRankings
  |_ StateMap
  |_ StateChart
|_ Footer
```


**Component Functionality and UI**