import { getAllMainContentData } from "@/db/CRUDquery/global/contentCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/getMainContentData
 * @desc get all main Data About Content
 * @access public 
 * */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const contentID = parseInt(searchParams.get("id")) || null;
		if (contentID !== null) {
			const content = await getAllMainContentData(contentID);
			if (content?.data === null || content?.genres === null) {
				return NextResponse.json( {message: "this Content is not Exist"}, {status: 200} );
			} else if (content === 0) {
				return NextResponse.json( {message: "internal server error"}, {status: 500} );
			}
			return NextResponse.json( content, {status: 200} );
		}
		return NextResponse.json( {message: "content ID is missing"}, {status: 400} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}