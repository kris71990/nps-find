# NPS-Find - Back-End

<img src="../frontend/src/utils/bison.png" alt="NPS-Find-logo" width="200"/>

**Author: Kris Sakarias**

**Version: 1.0.0**

## Overview

The backend is built with **Node** and **Express**, and uses a **SQL** relational database managed by **PostgreSQL**. It also utilizes the **Sequelize** library, which allows seamless integration with the REST API. 

When necessary, the API utilizes data from the National Park Service API(https://www.nps.gov/subjects/developer/index.htm).

## Getting Started

1. Clone the parent repo: `git clone https://github.com/kris71990/nps-find.git`
2. Create a `.env` file in this (backend) directory for server environment variables
3. `npm i` to install necessary node modules

**Environment variables**

An API key from the National Park Service API is required. In the `.env` file, set `NPS_API_KEY` to the value of your NPS Api key. Other environment variables necessary to run the application are:

- `NODE_ENV=development`
- `PORT=3000`
- `CLIENT_URL=http://localhost:8080`
- `DATABASE_URL=postgres://localhost:5432/nps`

**Create Local Database**

In the **PostgreSQL** shell (psql), create a local database for the application: `CREATE DATABASE nps;`.

**Start the Server**

From the root of the backend directory, start the server with `npm run start`.


## Documentation

**Database Models**

Several models are used to structure data for the application.

`Account` -- (1:1) --> `Profile` -- (1:many) --> `Report`

`State` -- (1:many) --> `Park` -- (1:many) --> `Campground`

Models hold important relationships with eachother, which makes a relational database ideal for managing the storage and use of such data. 

Two main model branches are used. The `Account`, `Profile`, and `Report` models govern user interaction with the application. However, a user is not required to be logged in to access basic functionality. The second model branch exists to serve base functionality - this includes the `State`, `Park`, and `Campground` models.


**Routing and Functionality**

*Account Router*

The account router handles account creation and login. All account and profile data are secured through the use of encrypted access tokens (see [JWT](https://jwt.io/)). 

1. POST /signup
  - Creates a user account
  - Request requires a username, password, and email

A valid signup request will hash the password and store this hash for login purposes. It will then generate a token seed and sign this seed with a secret key to generate an authentication token, which is then sent back to the user in the form of a cookie.

1. GET /login
  - Logs in a user account
  - Request requires username and password

A valid login request will hash the password and compare this hash with the stored password hash, logging in the user with a fresh authentication token if the password is correct.


*Profile Router*

The profile router handles all profile related functions. The data that users supply in their profiles is used to reccommend parks, both to the root user and potentially to other non-logged-in users. Profile data, of course, is completely secure to each individual user.

1. POST /profile
  - Creates a profile
  - Fields
    - Name (required)
    - Age (required)
    - Home State (required, in the form of an abbreviation, e.g. 'WA')
    - Interests
    - Residential Locale Type
    - Favored Climate
    - Favored Landscape 

A valid request will create a profile for the user.

2. GET /profile/me
  - Returns a user's profile, if it exists
  - Also returns all reports the user has submitted

3. PUT /profile/:id
  - Allows the user to update any of the fields on their profile and returns the updated profile

4. DELETE /profile/:id
  - Allows the user to delete their profile


*Report Router*

The report router is where logged-in users can contribute to the functionality of the rest of the app. User reports are an important way not only to inform other users of personal experiences, but also to enhance the performance of the app itself and the decisions that it makes. 

1. POST /report
  - Submits a report for a specific user for a specific park
  - Fields
    - Park Name (required)
    - Rating (required - how was your experience? (1-5 system, 5 is best))
    - Length of Stay (required - how long did you stay in the park (in hours)?)
    - Activities (required - what did you do while in the park?)
    - Park Environment - (requried - what type of area is the park located in?)
      - Urban, Suburban, Rural...
    - Park Landscape - (required - what type of landscape is the park?)
      - Mountains, forest etc...
    - Weather (required - what was the weather like?)
      - Sun, rain, snow etc...
    - Wildlife (not required - what wildlife did you see during your stay?)

A submitted report will hold a reference to the user's profile and to the park for which it was submitted. Only users with an account can submit a report.

2. GET /report/profile/:profileId
  - Retrieves all reports submitted by the specified profile

3. GET /report/park/:parkId
  - Retrieves all reports submitted for the specified park

4. DELETE /report/:id
  - Allows a user to delete one of their reports


*State Router*

The state router handles two routes that respond with data necessary to render a series of charts to the user, giving a visual representation of state and park statistics. All routes public.

1. GET /states
  - Returns an array of objects, each object representing a state 
  - Each state includes `stateId`, `total`, and `types` properties
    - `stateId` is a String of the particular state's abbreviation, ex. `'CA'` for California
    - `total` is a Number, which is the number of total parks in the state, ex. `34`
      * `stateId` and `total` is data stored in the `State` table
    - `types` is an Object, which is constructed by querying the `Park` table by `stateId` to define the different types of parks and the total number of each per state.
      * ex. `{ 'National Park' : 7, 'National Monument': 5, 'National Battlefield': 3 ... }`

The data returned from a request to this endpoint is ordered by total number of parks. 

2. GET /states/types
  - Returns an array of park types
  - ex. `['National Park', 'National Monument', 'National Reserve' ...]`
  - The park types that this endpoint returns includes every type of park in the database, across all states in the database.

This route is primarily used for chart rendering on the front-end. For specific front-end functionality that utilizes this data, consult the front-end README.


*Park Router*

The park router deals with the primary functionality of the app, as it relates to the user's ability to discover parks of interest. All routes public unless specified.

1. GET /parks/:state
  - Takes in a query object of user preferences for specific or nonspecific types of parks in a particular state. If the data needed does not exist in the database, it is fetched from the external API and saved to the database to minimize dependence on external data and maximize performance. 
  - All relevant data for the state, parks, and campgrounds related to the user query is fetched, entered, and retrieved in this process.
  - Returns an object of park specific data to aid in the retrieval of all park data 
    * ex. `{ camping: true, parkTypes: ['National Monument', 'National Preserve'] }`
    * This example is a response to a user query expressing interest in camping as well as activities that may be found in those types of parks.

2. PUT /parks/:state
  - All functionality could be handled in the above endpoint, but a user request also triggers an update request to data in the `Park` table to improve handling of camping related requests. 
  - This route accepts the user query object returned from the above route and, after all data is updated, returns an array of parks to satisfy the user's preferences.
  - Each park in the response also includes a quick reference to the number of user reports associated with it, via a join with the `Report` table
  - Data returned depends entirely on the user query object

3. GET /park/:parkId
  - Retrieves a single existing park from the database
  - As above, this response also includes a quick reference to the number of user reports associated with it, via a join with the `Report` table

4. GET /parks/all/top
  - Returns parks in descending order of most reviewed 
  - Joined with `Report` table as above

5. GET /parks/all/random
  - Returns a random set of fifteen parks that have not yet been reviewed 
  - Joined with `Report` table as above

6. GET /parks/region/:regionId 
  - Private user endpoint
  - Returns all parks within a given geographic region
  - The geographic region is determined by the user's home state, and returns parks from states that are in the same general area

7. GET /parks/userprefs/all
  - Private user endpoint
  - Handles three different user searches - by climate, park landscape type, and park environment type - type is determined by user query data passed from frontend 
  - Dynamically generates a regular expression that is used to match data from `Park` and `Report` tables based on user preferences
  - Dynamically generates a SQL query to join `Park` and `Report` tables based on user preferences
  - Returns all parks that match the user's search preferences and relevant data in their profile


*Campground Router*

The campground router deals with the retrieval of campground information. Campground data is procured and handled in the user query process detailed above in the *Park Router*. All routes public.

1. GET /campgrounds/parks/:parkKey
  - Returns an array of campgrounds for a specific park
  - Each campground is an object of data specific to each campground

2. GET /campgrounds/:state
  - Returns an array of all campgrounds present in a specific state
  - Each campground is an object of data specific to each campground


## Testing

*Unit Testing*

All functionality is tested using the Jest library.

1. Create a `.env` file in `src/__test__/lib` that contains all variables found in the main `.env` file (NPS API KEY required)
2. To run unit tests: `npm run test`
