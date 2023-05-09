import { getDB } from './utils.js';

const db = getDB();

export const insert = (locationID) => {
	return new Promise((resolve, reject) => {
		db.query('INSERT INTO Frequency SET LocationID = ?, DateVisited = now()', locationID, (error, result) => {
			if (error) {
				return reject(error.sqlMessage);
			} else {
				const responseObject = {
					id: result.insertId,
				};
				return resolve(responseObject);
			}
		});
	});
};
