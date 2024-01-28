/**
 * Create Node Server
 * 1) Create new yap-server directory
 * 2) cd into it
 * 3) npm install mysql
 * 4) File > Add Folder to Workspace
 * 5) npm install dotenv --save
 * 6) npm install -g nodemon
 * 7) npm install cors
 * 8) npm install express
 * 9) npm install multer
 * 10) Create .env file
 *
 */

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();
const port = process.env.SERVER_PORT;

import locationRoutes from './routes/location.js';
import categoryRoutes from './routes/category.js';
import distanceRoutes from './routes/distance.js';
import reviewRoutes from './routes/review.js';

// We start the client-side by running: npm run start
// We start the server-side by running: nodemon (something that runs an auto-updating nodejs)

// This is the server that runs on NodeJS. It will be our API talks to our database. Requests from react come in, NodeJS processes the type of API call, it gets
// the data from MySQL, and the data is returned

// React should NOT have direct access with a database because all that code is client-side and viewable by the user.

// We start the server typing 'nodemon'. A special package that will start NodeJS but if the file changes it will update the server without a restart needed.
// We installed nodemon with 'npm install -g nodemon' - the global flag so it's added to our path and can be accessible from command line in Windows
// Each time you do something like 'npm install mysql' it's installing the module for this project only, you'll see the added dependencies in the package.json file.

// Use DotEnv to keep all sensitive data in a separate git ignored file

const app = express();

// We are sending this back in all responses saying it's allowed to be used by our client
// If we didn't provide this, the browser would see the origins were different ports and immediately reject it
// This is like our stamp of approval in the response: "Hey Browser, we allow things to be sent back to port 3700."
app.use(
	cors({
		origin: `http://yap-frontend:${process.env.REACT_PORT}`,
	}),
	cors({
		origin: `http://penguinore:${process.env.REACT_PORT}`,
	})
);

// Does the parsing for the req.body
app.use(express.json());

app.use(reviewRoutes);
app.use(categoryRoutes);
app.use(distanceRoutes);
app.use(locationRoutes);

app.listen(port, () => {
	console.log(`Yap Server is now running on ${port}`);
});
