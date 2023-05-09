import dotenv from 'dotenv';
import mysql from 'mysql';

let _db = null;

export const initializeDB = () => {
	dotenv.config();

	const db = mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.YAP_DATABASE,
	});

	db.connect((error) => {
		if (error) {
			throw error;
		}
		console.log('Yap Server connected to database.');
	});

	_db = db;
};

export const getDB = () => {
	if (_db === null) {
		initializeDB();
	}

	return _db;
};
