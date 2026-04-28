import { getHeroContent } from "@/db/CRUDquery/global/display/displayCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/displayAPIs/heroReq
 * @desc get hero content to display
 * @access public
 */
export async function GET (req) {
	try {
		const heroData = await getHeroContent();
		if (heroData === null) {
			return NextResponse.json( {message:"no data"}, {status: 404} );
		} else if (heroData === 0) {
			return NextResponse.json( {message:"internal server error"}, {status: 500} );
		}
		return NextResponse.json( heroData, {status: 200} );
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}