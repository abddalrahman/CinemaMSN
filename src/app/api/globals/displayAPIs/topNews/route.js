import { getTopNews } from "@/db/CRUDquery/global/display/displayCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/displayAPIs/topNews
 * @desc get Top News [most saved news by users]
 * @access public
 */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const page = Number(searchParams.get("page")) || 1;
		const limit = Number(searchParams.get("limit")) || 10;
		const news = await getTopNews(Number.isInteger(page) ? page : 1, Number.isInteger(limit) ? limit : 10);
		if (news === null) {
			return NextResponse.json( {message:"no data"}, {status: 404} );
		} else if (news === 0) {
			return NextResponse.json( {message:"internal server error"}, {status: 500} );
		}
		return NextResponse.json( news, {status: 200} );
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}