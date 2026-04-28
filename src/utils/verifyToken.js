import jwt from "jsonwebtoken"

export function verifyTokenFunc (req) {
	try {
		const jwtToken = req.cookies.get('jwtToken');
		const token = jwtToken ? jwtToken.value : null;
		const userData = getTokenData(token);
		if (userData === null) return null;
		return userData;

	} catch (error) {
		console.log(error);
		return null
	}
}

export function getTokenData (token) {
	try {
		if (token === null) return null;
		const privateKey = process.env.JWT_SECRET;
		const userData = jwt.verify(token, privateKey);
		return userData;

	} catch (error) {
		console.log(error);
		return null
	}
}