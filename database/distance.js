import { getDB } from './utils.js';

const db = getDB();

export const getByName = (distanceName) => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM distance WHERE Name = ? ORDER BY Position', [distanceName], (error, result) => {
			if (error) {
				return reject(error.sqlMessage);
			} else {
				return resolve(result);
			}
		});
	});
};

export const getAll = () => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM distance ORDER BY Position', (error, result) => {
			if (error) {
				return reject(error.message);
			} else {
				return resolve(result);
			}
		});
	});
};
