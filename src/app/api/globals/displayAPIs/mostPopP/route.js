import { getPopulerPeople } from "@/db/CRUDquery/global/display/displayCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/displayAPIs/mostPopP
 * @desc get most popular celebrities and most premium cast
 * @access public
 */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const limit = Number(searchParams.get("limit")) || 30;
		const people = await getPopulerPeople(limit);
		if (people === null) {
			return NextResponse.json( {message:"no data"}, {status: 404} );
		} else if (people === 0) {
			return NextResponse.json( {message:"internal server error"}, {status: 500} );
		}
		return NextResponse.json( people, {status: 200} );
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}