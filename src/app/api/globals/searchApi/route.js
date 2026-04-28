import { searchContentNewsPeople } from "@/db/CRUDquery/global/searchCRUD";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/globals/searchApi
 * @desc search about content and news and people [about: {people: bool, content: bool, news: bool}]
 * @access public
 * */

export async function GET ( req ) {
	try {
		const { searchParams } = new URL(req.url);
		const searchTitle = searchParams.get("title") || null;
		const searchAbout = searchParams.get("about") || null;
		if (searchAbout !== null && searchTitle !== null) {
			const results = await searchContentNewsPeople(searchTitle, JSON.parse(searchAbout));
			if (results !== 0) {
				return NextResponse.json( results, {status: 200} );
			}
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		return NextResponse.json( {message: "Required Data Missing"}, {status: 400} );

	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}