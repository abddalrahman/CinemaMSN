import { getGenres } from "@/db/CRUDquery/admin/genresCRUD";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/globals/getGenres
 * @desc get genres
 * @access public
 * */

export async function GET ( req ) {
	try {
		const { searchParams } = new URL(req.url);
		const genreType = searchParams.get("type") || null;
		if (genreType !== null) {
			const genres = await getGenres(genreType);
			if (genres !== 0) {
				return NextResponse.json( genres, {status: 200} );
			}
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		return NextResponse.json( {message: "Required Data Missing"}, {status: 400} );

	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}