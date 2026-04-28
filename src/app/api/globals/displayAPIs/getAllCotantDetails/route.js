import { getAllContentInfoWithRelations, getContentRatings, getContentReviews } from "@/db/CRUDquery/global/display/displayCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/displayAPIs/getAllCotantDetails
 * @desc get all content details
 * @access public
 * 
*/
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const contentId = Number(searchParams.get("id")) || null;
		if (contentId === null || !parseInt(contentId)) {
			return NextResponse.json( {message: "Content Id is Not Currect"}, {status: 400} );
		}
		const contentWithRelations = await getAllContentInfoWithRelations(contentId);
		if (contentWithRelations === null) {
			return NextResponse.json( {message: "this Content is not Exist"}, {status: 404} );
		} else if (contentWithRelations === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		const rating = await getContentRatings(contentId);
		const reviews = await getContentReviews(contentId, true);
		if (rating === 0 || reviews === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		contentWithRelations.allRating = rating;
		contentWithRelations.allReviews = reviews;
		return NextResponse.json( contentWithRelations, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}