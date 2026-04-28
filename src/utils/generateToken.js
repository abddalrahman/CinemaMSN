import { serialize } from "cookie";
import jwt from "jsonwebtoken";


export function generateToken ( jwtData ) {
	const privateKey = process.env.JWT_SECRET;
	const token = jwt.sign(jwtData, privateKey, {
		expiresIn: '30d'
	});

	return token
}

export function SetTokenCookie ( jwtData ) {
	const token = generateToken(jwtData);

	const cookie = serialize("jwtToken", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: 'strict',
		path: '/',
		maxAge: 60 * 60 * 24 * 30 // 30 d
	});

	return cookie
}