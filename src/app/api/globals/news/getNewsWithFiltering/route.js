import { getfilteringNews } from "@/db/CRUDquery/admin/dashboard/dashboardCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/news/getNewsWithFiltering
 * @desc get News with filtering
 * @access public
 * */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 10;
		const TBtext = searchParams.get("TBtext") || null;
		const about = searchParams.get("about") || null;
		const filter = {};
		TBtext !== null && TBtext !== "null" ? filter.TBtext = TBtext : '';
		about !== null && about !== "null" ? filter.about = about : '';
		const news = await getfilteringNews(page, limit, Object.keys(filter).length > 0 ? filter : null);
		if (news !== null) {
			return NextResponse.json( {data:news.data, dataLength: news.dataLength}, {status: 200} );
		} else {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}