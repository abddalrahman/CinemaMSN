import { getUserReviews } from "@/db/CRUDquery/global/display/displayCRUD";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/users/profile/getMyReviews
 * @desc get user reviews
 * @access public 
 * */

export async function GET ( req ) {
	try {
		const { searchParams } = new URL(req.url);
		const userId = Number(searchParams.get("id")) || null;
		const limited = searchParams.get("limited") || null;
		if (userId === null) {
			if (!Number(userId)) return NextResponse.json( {message: "Invalid Data"}, {status: 400} )
			return NextResponse.json( {message: "Missing Data"}, {status: 400} )
		}
		
		let reviews = await getUserReviews(userId, limited !== null ? 10 : null);
		if (reviews === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} )
		} else {
			return NextResponse.json( reviews, {status: 200} )
		}

	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} )
	}
}