import express from 'express';
import { createTable, getByLocationID, insert, update } from '../database/review.js';
import { checkAuthMiddleware } from '../utils/auth.js';

const router = express.Router();

router.post('/api/review/setup', (_req, res) => {
	const selectPromise = createTable();

	selectPromise.then(
		(result) => {
			res.status(200).json(result);
		},
		(error) => {
			res.status(500).json({ sqlmessage: error });
		}
	);
});

router.get('/api/review/:locationID', (req, res) => {
	const locationID = req.params.locationID;
	const selectPromise = getByLocationID(locationID);

	selectPromise.then(
		(result) => {
			res.status(200).json(result);
		},
		(error) => {
			res.status(500).json({ sqlmessage: error });
		}
	);
});

router.patch('/api/review/:reviewID', (req, res) => {
	const reviewID = req.params.reviewID;
	console.log(`Incoming Update Review for ${reviewID}`, req.body);

	// We need a middleman object so the person using the API can't change whichever columns they want
	const updatedReview = {};

	if (req.body.likes !== null) {
		updatedReview.Likes = req.body.likes;
	}

	if (req.body.dislikes) {
		updatedReview.Dislikes = req.body.dislikes;
	}

	if (req.body.rating) {
		updatedReview.Rating = req.body.rating;
	}

	if (req.body.notes) {
		updatedReview.Notes = req.body.notes;
	}

	const updatePromise = update(updatedReview, reviewID);

	updatePromise.then(
		(result) => {
			console.log(`Update Review for ${reviewID} is SUCCESS`);
			res.status(200).json({ reviewID });
		},
		(error) => {
			res.status(500).json({ message: error });
		}
	);
});

router.put('/api/review', (req, res) => {
	console.log('Incoming New Review', req.body);
	// We need a middleman object so the person using the API can't change whichever columns they want
	const newReview = {
		Likes: req.body.likes,
		Dislikes: req.body.dislikes,
		Notes: req.body.notes,
		Rating: req.body.rating,
		UserID: req.body.userID,
		LocationID: req.body.locationID,
	};

	if (!newReview.UserID) {
		return res.status(500).json({ message: 'You are not logged in!' });
	}

	// We can pass an object as long as the properties of the object match the column names in the DB table
	const insertPromise = insert(newReview);

	insertPromise.then(
		(result) => {
			res.status(200).json(result);
		},
		(error) => {
			res.status(500).json({ message: error });
		}
	);
});

export default router;
