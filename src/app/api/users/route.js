import { checkUserState } from "@/db/CRUDquery/users/activityCRUD";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/users
 * @desc Check user status
 * @access private Only loged in users. 
 * */
export async function GET ( req ) {
	try {
		const userData = verifyTokenFunc(req);
		if (userData === null) return NextResponse.json( {message: "no user Token Provided"}, {status: 403} )
		
		if (userData?.id) {
			const userStatus = await checkUserState(userData.id);
			if (userStatus === false || userStatus === 0) {
				return NextResponse.json( {message: "Something is Wrong"}, {status: 400} );
			}
			return NextResponse.json( {message: "done", uStatus: userStatus}, {status: 200} );
		} else {
			return NextResponse.json( {message: "no data in token"}, {status: 400} );
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}