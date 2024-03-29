import { getDB } from './utils.js';

const db = getDB();

export const getByCategory = (categoryID) => {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT l.*,  MAX(a.FrequencyCount), MAX(a.FrequencyVisit) From location l LEFT JOIN frequency f on l.locationid  = f.locationid LEFT JOIN (SELECT count(locationid) as FrequencyCount, max(datevisited) as FrequencyVisit, locationid from frequency group by locationid) a ON a.locationid = l.locationid WHERE l.CategoryID = ? group by l.locationid',
			[categoryID],
			(error, result) => {
				if (error) {
					return reject(error.sqlMessage);
				} else {
					return resolve(result);
					L;
				}
			}
		);
	});
};

export const getByName = (name) => {
	return new Promise((resolve, reject) => {
		db.query('SELECT * FROM location WHERE Name = ?', [name], (error, result) => {
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
		db.query('SELECT l.*, c.Name as CategoryName FROM location l LEFT JOIN category c on l.CategoryID = c.CategoryID ORDER BY Name', (error, result) => {
			if (error) {
				return reject(error.sqlMessage);
			} else {
				return resolve(result);
			}
		});
	});
};

export const getAllPlans = () => {
	return new Promise((resolve, reject) => {
		db.query(
			'SELECT l.LocationID, l.Name, l.Description, l.Punchline, l.Abbreviation, ' +
				'l.Latitude, l.Longitude, l.MenuFileName, l.HasVegan, l.HasVegetarian, l.HasGlutenFree, l.HasLactoseFree, l.HasTakeout, ' +
				'l.DeathDate, l.FoodType, l.TravelTime, l.HasWifi, l.HasCashOnly, l.ParkingType, l.WaitTime, l.Quadrant, l.Cost, l.IsPlan, ' +
				'l.CategoryID, c.Name as CategoryName, ' +
				'MAX(f.dateVisited) as FrequencyLatest, ' +
				'COUNT(f.LocationID) as FrequencyCount, ' +
				'l.DistanceID, d.Name as DistanceName ' +
				'FROM location l ' +
				'JOIN distance d ON l.DistanceID = d.DistanceID ' +
				'JOIN category c ON l.CategoryID = c.CategoryID ' +
				'LEFT JOIN frequency f ON l.LocationID = f.LocationID WHERE l.IsPlan = 1 GROUP BY l.LocationID ORDER BY FrequencyLatest ASC, l.Name ASC',
			(error, result) => {
				if (error) {
					return reject(error.sqlMessage);
				} else {
					return resolve(result);
				}
			}
		);
	});
};

export const update = (updatedLocation, locationID) => {
	return new Promise((resolve, reject) => {
		db.query('UPDATE location SET ? WHERE LocationID = ?', [updatedLocation, locationID], (error) => {
			if (error) {
				return reject(error.sqlMessage);
			} else {
				return resolve();
			}
		});
	});
};

export const insert = (newLocation) => {
	return new Promise((resolve, reject) => {
		db.query('INSERT INTO location SET ?', newLocation, (error, result) => {
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
