import { geteopleGenres } from "@/db/CRUDquery/global/display/displayCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/displayAPIs/getPersonGenres
 * @desc get person genres
 * @access public
 */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const pid = Number(searchParams.get("id")) || null;
		if (pid === null || !parseInt(pid)) {
			return NextResponse.json( {message:"Required Data Missing"}, {status: 400} );
		}
		const genres = await geteopleGenres(pid);
		if (genres === 0 && genres === null) {
			return NextResponse.json( {message:"internal server error"}, {status: 500} );
		}
		return NextResponse.json( genres, {status: 200} );
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}