import { getGenresWithFiltering } from "@/db/CRUDquery/admin/dashboard/dashboardCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/getGenresForTable
 * @desc get genres with filtering
 * @access public
 * */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 10;
		const gKind = searchParams.get("gKind") || null;
		const gName = searchParams.get("gName") || null;
		const filter = {};
		gKind !== null && gKind !== "null" ? filter.gKind = gKind : '';
		gName !== null && gName !== "null" ? filter.gName = gName : '';
		const genres = await getGenresWithFiltering(page, limit, Object.keys(filter).length > 0 ? filter : null);
		if (genres !== null) {
			return NextResponse.json( {data:genres.data, dataLength: genres.dataLength}, {status: 200} );
		} else {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}