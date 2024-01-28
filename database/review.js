import { getDB } from './utils.js';

const db = getDB();

export const createTable = () => {
	return new Promise((resolve, reject) => {
		db.query(
			'CREATE TABLE review (ReviewID INT AUTO_INCREMENT PRIMARY KEY, LocationID INT NOT NULL, Likes VarChar(500), Dislikes VarChar(500), Rating TINYINT, Notes VARCHAR(2000), UserID INT, FOREIGN KEY (LocationID) REFERENCES Location(LocationID) )',
			(error, result) => {
				if (error) {
					return reject(error);
				} else {
					return resolve(result);
				}
			}
		);
	});
};

export const getByLocationID = (locationID) => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM review WHERE LocationID  = ?', [locationID], (error, result) => {
			if (error) {
				return reject(error.message);
			} else {
				return resolve(result);
			}
		});
	});
};

export const update = (updatedReview, reviewID) => {
	return new Promise((resolve, reject) => {
		db.query('UPDATE review SET ? WHERE ReviewID = ?', [updatedReview, reviewID], (error) => {
			if (error) {
				return reject(error.sqlMessage);
			} else {
				return resolve();
			}
		});
	});
};

export const insert = (newReview) => {
	return new Promise((resolve, reject) => {
		db.query('INSERT INTO review SET ?', newReview, (error, result) => {
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
