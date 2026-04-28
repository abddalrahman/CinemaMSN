import { verifyTokenFunc } from "@/utils/verifyToken";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/getCookieInfo
 * @desc get user Token Data
 * @access public 
 * */
export async function GET ( req ) {
	try {
		const userData = verifyTokenFunc( req );
		if (userData === null) {
			return NextResponse.json( {message: "no data"}, {status: 401} );
		} 
		return NextResponse.json( userData, {status: 200} );
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}