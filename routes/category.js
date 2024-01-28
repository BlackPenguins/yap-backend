import express from 'express';
import { getAll } from '../database/category.js';
import { getByCategory } from '../database/location.js';

const router = express.Router();

router.get('/api/categoryGroups', async (req, res) => {
	const categories = await getAll();

	let returnArray = [];

	for (const category of categories) {
		let categoryObject = {
			categoryName: category.Name,
			locations: [],
		};

		const locations = await getByCategory(category.CategoryID);

		for (const location of locations) {
			if (location.DeathDate) {
				const deathDate = new Date(location.DeathDate);
				location['DeathDateFormatted'] = deathDate.getMonth() + 1 + '/' + deathDate.getDate() + '/' + deathDate.getFullYear();
			}
			categoryObject.locations.push(location);
		}

		returnArray.push(categoryObject);
	}

	res.status(200).json(returnArray);
});

router.get('/api/categories', (_req, res) => {
	const selectPromise = getAll();

	selectPromise.then(
		(result) => {
			res.status(200).json(result);
		},
		(error) => {
			res.status(500).json({ sqlmessage: error });
		}
	);
});

export default router;
