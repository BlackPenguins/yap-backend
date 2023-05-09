export const checkAuthMiddleware = async (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}
	if (!req.headers.authorization) {
		return res.status(401).json({
			message: 'Not Authorized. No authentication header.',
		});
	}
	const authFragments = req.headers.authorization.split(' ');

	if (authFragments.length !== 2) {
		return res.status(401).json({
			message: 'Not Authorized. Authentication header is invalid.',
		});
	}
	const authToken = authFragments[1];

	// Make a call to the auth server to get the details of this user
	const response = await fetch(`http://localhost:4591/checkuser`, {
		headers: {
			Authorization: 'Bearer ' + authToken,
		},
	});

	const data = await response.json();

	console.log('D', data);
	if (response.status !== 200) {
		return res.status(401).json({
			message: 'Not Authorized. Token is invalid.',
		});
	}

	next();
};
