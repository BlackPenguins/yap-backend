import express from 'express';
import { getAll, getAllPlans, getByName, update, insert } from '../database/location.js';
import { insert as insertFrequency } from '../database/frequency.js';
import { getByName as getCategoryByName } from '../database/category.js';
import { getByName as getDistanceByName } from '../database/distance.js';
import { checkAuthMiddleware } from '../utils/auth.js';

const router = express.Router();

router.get('/locations', (req, res) => {
	const selectPromise = getAll();

	selectPromise.then(
		(result) => {
			res.status(200).json(result);
		},
		(error) => {
			res.status(500).json({ message: error });
		}
	);
});

router.post('/locations/addVisit', async (req, res) => {
	let locationName = req.body.name;
	if (!locationName) {
		res.status(422).json({ message: 'You must provide a location!' });
	} else {
		const locations = await getByName(locationName);

		if (locations.length === 0) {
			res.status(422).json({ message: `Could not find a location with **${locationName}** for a location name.` });
		} else {
			const insertPromise = insertFrequency(locations[0].LocationID);

			insertPromise.then(
				(result) => {
					res.status(200).json({ message: `A visit today has been added for **${locationName}**.` });
				},
				(error) => {
					res.status(500).json({ message: error });
				}
			);
		}
	}
});

router.get('/locations/plan', (req, res) => {
	const selectPromise = getAllPlans();

	selectPromise.then(
		(result) => {
			let returnArray = [];
			for (const location of result) {
				let latestDateFormatted = null;

				if (location.FrequencyLatest) {
					latestDateFormatted = location.FrequencyLatest.toISOString().slice(0, 10);
				}
				const locationObject = {
					name: location.Name,
					visit_count: location.FrequencyCount,
					latest_visit_date: latestDateFormatted,
					time_ago_label: getFrequencyFormatted(location.FrequencyCount, location.FrequencyLatest),
				};
				returnArray.push(locationObject);
			}
			res.status(200).json(returnArray);
		},
		(error) => {
			res.status(500).json({ message: error });
		}
	);
});

router.get('/locations/plan/random', (req, res) => {
	const selectPromise = getAllPlans();

	selectPromise.then(
		(result) => {
			let randomLocation = Math.floor(Math.random() * result.length);
			const message = `You should go to **${result[randomLocation].Name}**! YapBot has spoken. Thumbs up if you would be fine with this.`;
			res.status(200).json({ message });
		},
		(error) => {
			res.status(500).json({ message: error });
		}
	);
});

router.use(checkAuthMiddleware);

router.put('/locations/quick', async (req, res) => {
	console.log('Incoming New Quick Location', req.body);

	const locationName = req.body.name;
	const author = req.body.author;

	if (!locationName) {
		res.status(422).json({ message: 'You must provide a location!' });
	} else {
		if (!author) {
			res.status(422).json({ message: 'You must provide an author! We need someone to blame.' });
		} else {
			const categorySelect = await getCategoryByName('Sit Down');
			const distanceSelect = await getDistanceByName('Long Drive');

			if (categorySelect.length === 0) {
				res.status(404).json({ message: 'Could not find a **Sit Down** category. Yell at Matt!' });
			} else if (distanceSelect.length === 0) {
				res.status(404).json({ message: 'Could not find a **Long Drive** distance. Yell at Matt!' });
			} else {
				console.log('RES', categorySelect);
				const categoryID = categorySelect[0].CategoryID;
				const distanceID = distanceSelect[0].DistanceID;

				// We need a middleman object so the person using the API can't change whichever columns they want
				const newLocation = {
					name: locationName,
					CategoryID: categoryID,
					DistanceID: distanceID,
					cost: 1,
					description: `Added through YapBot by ${author}`,
					quadrant: 'Henrietta',
					isPlan: 1,
				};

				const insertPromise = insert(newLocation);

				insertPromise.then(
					(result) => {
						res.status(200).json({ message: `Location **${locationName}** was added.` });
					},
					(error) => {
						res.status(500).json({ message: error });
					}
				);
			}
		}
	}
});

router.patch('/locations/:locationID', (req, res) => {
	const locationID = req.params.locationID;
	console.log(`Incoming Update Location for ${locationID}`, req.body);

	// We need a middleman object so the person using the API can't change whichever columns they want
	const updatedLocation = {};

	if (req.body.name !== null) {
		updatedLocation.name = req.body.name;
	}

	if (req.body.categoryID) {
		updatedLocation.categoryID = req.body.categoryID;
	}

	if (req.body.distanceID) {
		updatedLocation.distanceID = req.body.distanceID;
	}

	if (req.body.cost) {
		updatedLocation.cost = req.body.cost;
	}

	if (req.body.description !== null) {
		updatedLocation.description = req.body.description;
	}

	if (req.body.punchline !== null) {
		updatedLocation.punchline = req.body.punchline;
	}

	if (req.body.abbreviation !== null) {
		updatedLocation.abbreviation = req.body.abbreviation;
	}

	if (req.body.travelTime) {
		updatedLocation.travelTime = req.body.travelTime;
	}

	if (req.body.waitTime) {
		updatedLocation.waitTime = req.body.waitTime;
	}

	if (req.body.deathDate !== null) {
		updatedLocation.DeathDate = req.body.deathDate;
	}

	if (req.body.foodType !== null) {
		updatedLocation.foodType = req.body.foodType;
	}

	if (req.body.parkingType !== null) {
		updatedLocation.parkingType = req.body.parkingType;
	}

	if (req.body.quadrant !== null) {
		updatedLocation.quadrant = req.body.quadrant;
	}

	if (req.body.latitude !== null) {
		updatedLocation.latitude = req.body.latitude;
	}

	if (req.body.longitude !== null) {
		updatedLocation.longitude = req.body.longitude;
	}

	if (req.body.menuFileName !== null) {
		updatedLocation.menuFileName = req.body.menuFileName;
	}

	if (req.body.hasVegan !== null) {
		updatedLocation.hasVegan = req.body.hasVegan;
	}

	if (req.body.hasVegetarian !== null) {
		updatedLocation.hasVegetarian = req.body.hasVegetarian;
	}

	if (req.body.hasGlutenFree !== null) {
		updatedLocation.hasGlutenFree = req.body.hasGlutenFree;
	}

	if (req.body.hasLactoseFree !== null) {
		updatedLocation.hasLactoseFree = req.body.hasLactoseFree;
	}

	if (req.body.hasTakeout !== null) {
		updatedLocation.hasTakeout = req.body.hasTakeout;
	}

	if (req.body.hasWifi !== null) {
		updatedLocation.hasWifi = req.body.hasWifi;
	}

	if (req.body.hasCashOnly !== null) {
		updatedLocation.hasCashOnly = req.body.hasCashOnly;
	}

	if (req.body.isPlan !== null) {
		updatedLocation.isPlan = req.body.isPlan;
	}

	console.log(`Update Location for ${locationID}`, req.body);
	const updatePromise = update(updatedLocation, locationID);

	updatePromise.then(
		(result) => {
			console.log(`Update Location for ${locationID}`, result);
			res.status(200).json(result);
		},
		(error) => {
			res.status(500).json({ message: error });
		}
	);
});

router.put('/locations', (req, res) => {
	console.log('Incoming New Location', req.body);
	// We need a middleman object so the person using the API can't change whichever columns they want
	const newLocation = {
		name: req.body.name,
		categoryID: req.body.categoryID,
		distanceID: req.body.distanceID,
		cost: req.body.cost,
		description: req.body.description,
		punchline: req.body.punchline,
		abbreviation: req.body.abbreviation,
		travelTime: req.body.travelTime,
		waitTime: req.body.waitTime,
		DeathDate: req.body.deathDate,
		foodType: req.body.foodType,
		parkingType: req.body.parkingType,
		quadrant: req.body.quadrant,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		menuFileName: req.body.menuFileName,
		hasVegan: req.body.hasVegan,
		hasVegetarian: req.body.hasVegetarian,
		hasGlutenFree: req.body.hasGlutenFree,
		hasLactoseFree: req.body.hasLactoseFree,
		hasTakeout: req.body.hasTakeout,
		hasWifi: req.body.hasWifi,
		hasCashOnly: req.body.hasCashOnly,
		isPlan: req.body.isPlan,
	};

	// We can pass an object as long as the properties of the object match the column names in the DB table
	const insertPromise = insert(newLocation);

	insertPromise.then(
		(result) => {
			res.status(200).json(result);
		},
		(error) => {
			res.status(500).json({ message: error });
		}
	);
});

const getFrequencyFormatted = (frequencyCount, frequencyLatest) => {
	let frequencyFormatted = 'No Visits';

	if (frequencyCount > 0) {
		let today = new Date();
		let latestDay = new Date(frequencyLatest);
		let dateDifference = today.getTime() - latestDay.getTime();
		let hours = Math.floor(dateDifference / 1000 / 60 / 60);
		let days = Math.floor(hours / 24);
		let weeks = Math.floor(days / 7);
		let months = Math.floor(days / 30);

		if (months > 3) {
			frequencyFormatted = `${months} months ago`;
		} else if (weeks > 0) {
			frequencyFormatted = `${weeks} weeks ago`;
		} else if (days > 0) {
			frequencyFormatted = `${days} days ago`;
		} else {
			frequencyFormatted = `Today`;
		}
	}
	return frequencyFormatted;
};

export default router;
