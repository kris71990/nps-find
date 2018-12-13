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
  |_ AuthForm
  |_ ProfileView
    |_ ProfileForm
    |_ ReportView
  |_ Dashboard
    |_ CommonReturn
      |_ ...
  |_ SearchForm
    |_ CommonReturn
      |_ ImageCarousel
      |_ ParkPanel
        |_ CampgroundOptions
          |_ CampgroundView
          |_ CampgroundViewMap
        |_ ParkView
          |_ ParkViewMap
          |_ ImageCarousel
          |_ ReportView
          |_ ReportForm
          |_ CampgroundOptions
            |_ CampgroundView
            |_ CampgroundViewMap
|_ StateRankings
  |_ StateMap
  |_ StateChart
|_ Footer
```

**Component Functionality and UI**

+ `App`
  - The main wrapper component. This component is rendered in a Vue instance and is the root of the application.
  - This component renders `Header` and `Footer`

+ `Header` 
  - Renders the header - the header, along with the footer, is present throughout the entire application
  - Links to the homepage (`/` renders `Landing`), Profile, and About pages

+ `Footer` - renders the footer

+ `Landing`
  - User entry point to the application
  - Renders a `SearchForm` that allows the user to search for any public lands, subject to whatever preferences the user supplies.
  - Provides a link to render the `StateRankings` component, as well as common parks searches (popular, discover etc.)

+ `AuthForm`
  - Renders a modal that allows a user to login or signup with an account
  - Required fields for signup
    - `Username`, `Email`, `Password`
  - Consult backend readme for more information on account security

+ `ProfileView`
  - Renders profile data for an authenticated user
  - Renders `ProfileForm` 
  - Renders `ReportView`, a summary of all reports submitted by the user

+ `ProfileForm`
  - Renders a modal to create or update a user profile
  - Profile Data 
    - First Name (required)
    - Age (required),
    - Home State (required)
    - Interests
      - enter activities as a comma separated string
      ex. `hiking, camping, fishing`
    - Weather
      - enter favorite weather as comma separated string
      ex. `sun, warm`
    - Preferred Landscape
      - enter favorite landscape as a comma separated string
      ex. `mountains, forest`
    - Residential Environment 
      - enter the environment where you live (urban, suburban, or rural)
      ex. `urban`

+ `SearchForm`
  - The user chooses a state from a dropdown menu to search for
  - The user can currently specify some interests that the server (at `/parks/:state`) will use to filter parks in the chosen state, and return these parks to the user.

+ `StateRankings`
  - Makes a request to the API at `/states`, and receives back basic park statistics for each state
  - Renders a list of states by total number of parks
  - Provides a link to `StateMap` and `StateChart`

+ `StateMap`
  - Uses the Google Maps API to render a GeoMap of the United States
  - Each state on the geomap is shaded to represent the number of parks in each state

+ `StateChart`
  - Uses Chart.js to render a stacked bar chart 
  - The bar chart represents the total number of parks per state, as well as the total number of each park type in each state.

+ `Dashboard`
  - The user is redirected to the user dashboard after login
  - User can search by parameters based on user profile data 
    - Geographic Region
    - Climate
    - Park Landscape
    - Park Environment
    - Interests 
  - Dashboard also includes quick links to common searches (popular, discover, overview)

+ `CommonReturn`
  - A user query from the `SearchForm` will pass a query object to the server and render the `CommonReturn`
  - Will render either the `ParkPanel` component, if the user specifies any interests; otherwise it will render an `ImageCarousel` for every park in the state specified by the user.

+ `ImageCarousel`
  - The Image Carousel allows the user to scroll through a series of images for each park

+ `ParkPanel`
  - The main component that renders whenever a user specifies any interest when searching.
  - Renders a panel of slides for each park that is returned from the server according to user interests.
  - Also serves as an entry point to `CampgroundOptions`, if camping is specified as an interest - from `ParkPanel`, it renders all of the camping options in the desired state

+ `ParkView`
  - This component renders the view of a single park, when selected from the `ParkPanel`.
  - Renders `ParkViewMap`, `ImageCarousel`, and `ReportView`
  - Renders travel related information for the park, and provides an entry point to `CampgroundOptions` - from this component, `CampgroundOptions` renders all camping options for the specific park

+ `ParkViewMap`
  - Uses the Google Maps API to render the location of the park on a map

+ `ReportForm`
  - Renders a modal that allows a user to submit a park report
  - Report Form data
    - Overall Score (required) - 1-5 rating (5 is best)
    - Length of Visit (required) - Length of time spent in the park in hours
    - Park Location (required) - environment in which park is located 
    - Temperature (required) - what was the temperature like during your visit?
    - Weather (required) - what type of weather during your visit?
    - Park Scenery (required) - what type of landscape?
    - Activities (required) - what did you do during your stay?
    - Wildlife - what wildlife did you see?

+ `ReportView`
  - A table that shows a record of submitted reports 
  - Is rendered on `ParkView` to show all reports for one park, and on `ProfileView` to show all reports from one user

+ `CampgroundOptions` 
  - When camping is specified as an interest, this component is accessible both from the `Dashboard` (where it renders camping options for the entire state), and from the `ParkView` (rendering options for only one park)
  - When a campground is selected from the options view, `CampgroundView` is rendered

+ `CampgroundView`
  - Renders `CampgroundViewMap`, showing the location of the campground within the park
  - Shows the user relevant travel information related to the campground

+ `CampgroundViewMap` - see above


## Testing