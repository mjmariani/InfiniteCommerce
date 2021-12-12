## InfiniteCommerce

Link to Project Proposal:

[Project Proposal](https://docs.google.com/document/d/1qNe5WA0dHvYxCPijkAfEw5IEoA-tjDEH2xUYNytCf_s/edit?usp=sharing)

**Links to API:**

[Rainforest API](https://app.rainforestapi.com/playground)

## Installation


Use the package manager [npm](https://docs.npmjs.com/cli/v7/commands/npm-install) to install necessary dependencies for this website. npm will install dependencies from the package.json.

    npm install

To start back-end server:

    cd ./commerce-backend
	npm start

To start React front-end server (development)

	cd ..
	cd ./infinite-commerce
	npm start

Or to start React front-end server (production)

	cd ..
	cd ./infinite-commerce
	npm run build

## Tech Stack

### Server/Backend:

**Language**: Javascript

**Package management**:<br/> npm<br/><br/>
Frameworks:<br/>
Express.js<br/>

### Web/Frontend:

React.js<br/>
Bootstrap 4<br/>
React-Bootstrap<br/>
Material UI<br/>

### Database:

Postgres

### Testing:
Jest<br/>
Supertest
React Testing Library

## Usage

<b>E-commerce App</b>: This site will focus on allowing a user to search for any product on Amazon and later on Ebay, as well. The user can create an account, add items to a shopping cart and checkout items (basic implementation). The front-end will incorporate the use of React.js while the back-end will be built on the node.js environment using the express.js framework. Database will be a SQL database using PostgreSQL.

Future Implementations:</br>
1. Include a recommendation system for users based on the items searched</br>
2. Implement infinite scroll rendering</br>
3. Include more filtering abilities and more stores to search items</br>  

**Steps on how to use:**<br/>
1. Click Sign Up and create an account.<br/>
2. Then click Products, once logged in and go ahead and search for products. You can filter items based on certain preferences on the left filter section.<br/>
3. Add any item to the shopping cart.<br/>
4. Then you can checkout the products once you've selected all your products/items.<br/>

## Testing

To run the tests, we will use jest for back-end and run from the CLI:

	npm test -i

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
