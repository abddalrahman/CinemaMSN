import { getCommentsWithFiltering } from "@/db/CRUDquery/admin/dashboard/dashboardCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/admin/comments
 * @desc get comments with filtering
 * @access public
 * */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 10;
		const spoiler = parseInt(searchParams.get("spoiler")) === 0 ? null : parseInt(searchParams.get("spoiler")) || null;
		const report = parseInt(searchParams.get("report")) === 0 ? null : parseInt(searchParams.get("report")) || null;
		const filter = {};
		spoiler !== null ? filter.spoiler = spoiler : '';
		report !== null ? filter.report = report : '';
		const comments = await getCommentsWithFiltering(page, limit, Object.keys(filter).length > 0 ? filter : null);
		if (comments !== null) {
			return NextResponse.json( {data:comments.data, dataLength: comments.dataLength}, {status: 200} );
		} else {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}