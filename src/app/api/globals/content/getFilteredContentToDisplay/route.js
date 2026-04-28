import { getContentFilteredToDisplay } from "@/db/CRUDquery/global/display/displayCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/content/getFilteredContentToDisplay
 * @desc get content to display with filtering
 * @access public 
 * */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 10;
		const year = parseInt(searchParams.get("year")) || null;
		const type = searchParams.get("type") || null;
		const genre = parseInt(searchParams.get("genre")) || null;
		const filter = {};
		year !== null ? filter.year = year : '';
		type !== null && type !== "null" ? filter.type = type === "Movie" ? "M" : "S" : '';
		genre !== null ? filter.genre = genre : '';
		const contents = await getContentFilteredToDisplay(page, limit, Object.keys(filter).length > 0 ? filter : null);
		if (contents !== null) {
			return NextResponse.json( {data:contents.data, dataLength: contents.dataLength}, {status: 200} );
		} else {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}