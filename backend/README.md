# NPS-Find - Back-End

<img src="../frontend/src/utils/bison.png" alt="NPS-Find-logo" width="200"/>

**Author: Kris Sakarias**

**Version: 1.0.0**

## Overview

The backend is built with **Node** and **Express**, and uses a **SQL** relational database managed by **PostgreSQL**. It also utilizes the **Sequelize** library, which allows seamless integration with the REST API. 

When necessary, the API retrieves data from the National Park Service API(https://www.nps.gov/subjects/developer/index.htm).

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

There are three models used to structure data for the application.

`State` --> `Park` --> `Campground`

Models hold important relationships with eachother, which makes a relational database ideal for managing the storage and use of such data. The top level model is `State`. One state has a one-to-many relationship with a series of parks, and a single `Park` has a one-to-many relationship with some number of `Campgrounds`.


**Routing and Functionality**

*State Router*

The state router handles two routes that respond with data necessary to render a series of charts to the user, giving a visual representation of state and park statistics.

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

The park router deals with the primary functionality of the app, as it relates to the user's ability to discover parks of interest. 

1. GET /parks/:state

2. PUT /parks/:state

*Campground Router*

The campground router deals with campground related functionality, such as when a user is looking for camping options.

1. GET /campgrounds/parks/:parkKey

2. GET /campgrounds/:state

