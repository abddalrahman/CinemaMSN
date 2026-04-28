import { getContentListFromArray } from "@/db/CRUDquery/global/contentCRUD";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/globals/content/getContentList
 * @desc get content list
 * @access public
 * */

export async function GET ( req ) {
	try {
		const { searchParams } = new URL(req.url);
		const content_IDs = searchParams.get("ids") || null
		if (content_IDs !== null) {
			const IDsList = JSON.parse(content_IDs);
			if (Array.isArray(IDsList)) {
				const contents = await getContentListFromArray(IDsList);
				if (contents !== 0 && contents !== null) {
					return NextResponse.json( contents, {status: 200} );
				} else if (contents === null) {
					return NextResponse.json( {message: "Failed to Get all content"}, {status: 500} );
				} else if (contents === 0) {
					return NextResponse.json( {message: "internal server error"}, {status: 500} );
				}
			}
		} else {
			return NextResponse.json( {message: "Required Data Missing"}, {status: 400} );
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}