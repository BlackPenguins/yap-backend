import dotenv from 'dotenv';
import mysql from 'mysql';

let _db = null;

export const initializeDB = () => {
	dotenv.config();

	console.log('Connecting to database...', {
		host: process.env.MYSQL_HOST,
		port: process.env.MYSQL_PORT,
		database: process.env.MYSQL_DATABASE,
	});

	const db = mysql.createConnection({
		port: process.env.MYSQL_PORT,
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_ROOT_USER,
		password: process.env.MYSQL_ROOT_PASSWORD,
		database: process.env.MYSQL_DATABASE,
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
