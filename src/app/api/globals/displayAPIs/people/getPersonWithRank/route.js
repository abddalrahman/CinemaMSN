import { getPersonDataWithRanking } from "@/db/CRUDquery/global/display/displayCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/displayAPIs/people/getPersonWithRank
 * @desc get person data with its popularity ranking
 * @access public
 */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const uid = Number(searchParams.get("id")) || null;
		if (uid === null || !parseInt(uid)) {
			return NextResponse.json( {message:"Required Data Missing"}, {status: 400} );
		}
		const person = await getPersonDataWithRanking(uid);
		if (person === null) {
			return NextResponse.json( {message:"no data"}, {status: 404} );
		} else if (person === 0) {
			return NextResponse.json( {message:"internal server error"}, {status: 500} );
		}
		return NextResponse.json( person, {status: 200} );
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}