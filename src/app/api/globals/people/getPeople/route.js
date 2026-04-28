import { getMainPeopleInfo } from "@/db/CRUDquery/admin/dashboard/dashboardCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/people/getPeople
 * @desc get general statistics for dashboard
 * @access public
 * */

export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 10;
		const people = await getMainPeopleInfo(page, limit);
		if (people !== null) {
			return NextResponse.json( {data: people, dataLength: people.length}, {status: 200} );
		} else {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}