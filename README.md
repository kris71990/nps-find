# NPS-Find

**Author: Kris Sakarias**

**Version: 1.0.0**

## Overview

This is a full-stack application that allows the user to search for a national park or other national point of interest that they would be most interested in visiting, given a number of different variables that the user supplies. Proximity, outdoor interests, and other factors will be analyzed to inform the user of places they would most likely be interested in visiting. 

The application is built with **Node** and **Express** on the server, and uses a **SQL** database managed by **PostgreSQL**. It also utilizes the **Sequelize** library, which allows seamless integration with the API.

The frontend is built with **Vue** and **Vuex**.

The API also utilizes data from the National Park Service API (https://www.nps.gov/subjects/developer/index.htm)

## Usage

**Starting the Server**:

```
git clone https://github.com/kris71990/nps-find.git
cd front-end npm i
cd back-end npm i
```

Configure environment variables in both directores - information in sub-directory READMEs.

```
/back-end: npm run start
/front-end: npm run watch
```

## Testing

Unit Testing is performed with the Jest library.

To run server tests, navigate to the back-end directory and run `npm run test`
