import { getContentPeople } from "@/db/CRUDquery/admin/contentCRUD";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/globals/getContentCast
 * @desc get content cast and crew
 * @access public
 * */

export async function GET ( req ) {
	try {
		const { searchParams } = new URL(req.url);
		const content_ID = parseInt(searchParams.get("cid")) || null
		if (content_ID !== null) {
			const cast = await getContentPeople(content_ID);
			if (cast !== 0) {
				return NextResponse.json( cast, {status: 200} );
			} else {
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