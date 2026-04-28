import { getRelatedNews } from "@/db/CRUDquery/global/display/displayCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/news/getRelatedNewsData
 * @desc get news related with person or content
 * @access public
 * */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const id = Number(searchParams.get("id")) || null;
		const relatedW = searchParams.get("relatedW") || null;
		if (!id || !relatedW || !parseInt(id) || (relatedW !== "content" && relatedW !== "person")) {
			return NextResponse.json( {message: "Missing Data"}, {status: 400} );
		}
		const newsData = await getRelatedNews(id, relatedW);
		if (newsData === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		return NextResponse.json( newsData === null ? [] : newsData, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}