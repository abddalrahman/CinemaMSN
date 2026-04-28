import { getMostPopulerContent } from "@/db/CRUDquery/global/display/displayCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/displayAPIs/mostPopC
 * @desc get most popular content
 * @access public
 */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const type = searchParams.get("type") || null;
		const newPopuler = searchParams.get("newPopuler") || false;
		if (type === null) return NextResponse.json( {message:"Required Data Missing"}, {status: 400} );
		const content = await getMostPopulerContent(type, newPopuler === false ? false : true);
		if (content === null) {
			return NextResponse.json( {message:"no data"}, {status: 404} );
		} else if (content === 0) {
			return NextResponse.json( {message:"internal server error"}, {status: 500} );
		}
		return NextResponse.json( content, {status: 200} );
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}