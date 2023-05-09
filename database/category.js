import { getDB } from './utils.js';

const db = getDB();

export const getAll = () => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM Category ORDER BY Position', (error, result) => {
			if (error) {
				return reject(error.sqlMessage);
			} else {
				return resolve(result);
			}
		});
	});
};

export const getByName = (categoryName) => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM Category WHERE Name = ? ORDER BY Position', [categoryName], (error, result) => {
			if (error) {
				return reject(error.message);
			} else {
				return resolve(result);
			}
		});
	});
};
