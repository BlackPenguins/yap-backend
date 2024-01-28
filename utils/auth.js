export const checkAuthMiddleware = async (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}

	if (req.headers.botbypasstoken) {
		if (req.headers.botbypasstoken == process.env.DISCORD_CLIENT_TOKEN) {
			console.log('BOT ACCESS GRANTED');
			return next();
		}
	}

	if (!req.headers.authorization) {
		console.log('No header.');
		return res.status(401).json({
			message: 'Not Authorized. No authentication header.',
		});
	}
	const authFragments = req.headers.authorization.split(' ');

	if (authFragments.length !== 2) {
		console.log('No token.');
		return res.status(401).json({
			message: 'Not Authorized. Authentication header is invalid.',
		});
	}
	const authToken = authFragments[1];

	// Make a call to the auth server to get the details of this user
	const response = await fetch(`http://authentication:${process.env.AUTH_PORT}/auth/checkuser`, {
		method: 'POST',
		headers: {
			// This is required. NodeJS server won't know how to read it without it.
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + authToken,
		},
	});

	console.log('Response from Auth Server', response.status);

	const data = await response.json();

	if (response.status !== 200) {
		return res.status(401).json({
			message: 'Not Authorized. Token is invalid.',
		});
	}

	next();
};
