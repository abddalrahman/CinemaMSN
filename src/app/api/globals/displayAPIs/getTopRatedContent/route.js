import { getTopRatedContent } from "@/db/CRUDquery/global/display/displayCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/displayAPIs/getTopRatedContent
 * @desc get top rated content this year
 * @access public
 */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const type = searchParams.get("type") || false;
		if (type !== false && type !== "null" && type !== "M" && type !== "S") return NextResponse.json( {message:"Invalid Data"}, {status: 400} );
		const allYear = searchParams.get("allY") || false;
		const content = await getTopRatedContent(type, allYear);
		if (content === null) {
			return NextResponse.json( {message:"no data"}, {status: 404} );
		} else if (content === 0) {
			return NextResponse.json( {message:"internal server error"}, {status: 500} );
		}
		return NextResponse.json( content, {status: 200} );
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}