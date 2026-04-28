import { getContentGenres } from "@/db/CRUDquery/global/contentCRUD";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/globals/content/getContentGenres
 * @desc get content genres
 * @access public
 * */

export async function GET ( req ) {
	try {
		const { searchParams } = new URL(req.url);
		const cID = Number(searchParams.get("id")) || null
		if (cID !== null) {
			const genres = await getContentGenres(cID);
			if (genres !== 0 && genres !== null) {
				return NextResponse.json( genres, {status: 200} );
			} else if (genres === null) {
				return NextResponse.json( {message: "content not found"}, {status: 404} );
			} else if (genres === 0) {
				return NextResponse.json( {message: "internal server error"}, {status: 500} );
			}
		} else {
			return NextResponse.json( {message: "Required Data Missing"}, {status: 400} );
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}