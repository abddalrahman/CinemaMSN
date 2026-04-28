import { getFilteringPeople } from "@/db/CRUDquery/admin/dashboard/dashboardCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/people/getPeopleWithFiltering
 * @desc get people with filtering
 * @access public
 * */

export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 10;
		const pName = searchParams.get("pName") === "null" ? null : searchParams.get("pName") || null;
		const people = await getFilteringPeople(page, limit, pName);
		if (people !== null) {
			return NextResponse.json( {data: people.data, dataLength: people.dataLength}, {status: 200} );
		} else {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}