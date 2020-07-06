# 2cents Overview
  2cents is an expense tracker that will keep track of expenses by month and year. A user can create projects where they can track their contributions towards paying a debt off or saving up for something. The homepage will be built out and display what the projects and overall expenses for that month. A user can also search for a specific stock or crypto and save it to the homepage so they can get a quick view of how their favorite stocks or cryptos are doing.

## Getting Started
  * Register an account (*) **Note: this is not true authentication.** Email addresses are saved in clear text in the JSON database, and anyone who knows your email could login to see information inside the database. Do not store any sensitive information.
  * Your homepage will need to be built out
  * Go to the expense tab and start recording expenses and income for a specific month
  * Go to projects and make new entries for things you are trying to track
  * Search Cryptos and Stocks and save some to your homepage (*) **Note: to use this functionality, you must register for an api key. [Follow These Steps.](#Getting-API-Keys)**
  * Now your homepage will be fully built out and you can get the whole 2cents experience!

## Initial Setup of 2cents
  Follow these steps to get started:
  1. `git clone git@github.com:ronaldo1618/2cents.git`
  1. `cd` into 2cents
  1. `npm install` for dependencies
  1. `npm start` Should automatically open in chrome, if not type in 'http://localhost:3000' in your browser.
  Now to get the JSON server up:
  1. Open a new terminal tab
  1. `cd 2cents/api`
  1. `json-server -p 5002 -w database.json`

## Technologies Used
  This app utilizes these technologies:
  * This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
  * [Semantic UI](https://react.semantic-ui.com/) for icons
  * [React Router](https://reacttraining.com/react-router/) for page routing
  * [React-bootstrap](https://react-bootstrap.github.io/) for forms, buttons, cards
  * [chart-js](https://www.chartjs.org/) for charts
  * [moment-js](https://momentjs.com/) for dates

## Skills Utilized
  1. API Calls: POST, PUT, DELETE, GET
  1. JavaScript: Objects, Arrays, Functions, etc.
  1. Persistent data storage with JSON server
  1. Github Scrum workflow
  1. CSS
  1. Semantic HTML
  1. React: hooks, props, routes
  1. Modular code

## Getting API Keys
  1. In your terminal, cd to the modules directory
  1. `touch APIkeys.js`
  1. This file should already be ignored in the .gitignore but double check to make sure. Triple check.
  1. Now you will need to register for two api keys. Get a key from (https://nomics.com/) and (https://finnhub.io/).
  1. Once you have that file and your keys, store them in variables in APIkeys.js and export them to be used in the apiManager.js
  * Store them as `const nomicsKey = <>your key as string here<>`
                  `const finnhubKey = <>your key as string here<>`

## Troubleshooting
  If you are having trouble getting the application running:
  * Double check your file paths to make sure they are in the right directories
  * Make sure all dependencies are installed
  * Check to make sure your servers are correct. Should be `localhost:3000` for app and `localhost:5002` for the JSON server.
  * Contact me through my linkedin and I would be happy to try and help (https://www.linkedin.com/in/ronald-lankford/)