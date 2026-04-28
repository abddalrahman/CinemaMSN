import { NextResponse } from "next/server";


export async function middleware (req) {
	const authToken = req.cookies.get('jwtToken');
	const token = authToken ? authToken.value : null;

	if(token === null) {
		if (req.nextUrl.pathname.startsWith("/api/users/activity") 
			|| req.nextUrl.pathname === "/api/users/getActiveWithComment" || req.nextUrl.pathname === "/api/users/logout" 
			|| req.nextUrl.pathname === "/api/users" || req.nextUrl.pathname.startsWith("/api/users/profile")){
			return NextResponse.json({message: 'you are not logged in. Access denide from middleware'}, {status: 401})
		} else if (req.nextUrl.pathname === "/verifyOTP" || req.nextUrl.pathname.startsWith("/profile") || req.nextUrl.pathname.startsWith("/dashboard")) {
			return NextResponse.redirect( new URL('/', req.url))
		}
		
	}else {
		if(req.nextUrl.pathname === "/login" || req.nextUrl.pathname.startsWith("/forgotPassReset")){
			return NextResponse.redirect( new URL('/', req.url))
		}
	}
}

export const config = {
	matcher: ['/api/users/profile/:path*',
		'/api/users/activity/:path*',
		'/api/users/getActiveWithComment',
		'/api/users/logout',
		'/api/users',
		'/login',
		'/verifyOTP',
		'/forgotPassReset/:path*',
		'/profile/:path*',
		'/dashboard/:path*'
	]
}