import express from 'express';
import { getAll } from '../database/distance.js';

const router = express.Router();

router.get('/distances', (_req, res) => {
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
