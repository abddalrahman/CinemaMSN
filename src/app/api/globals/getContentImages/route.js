import { getContentImages } from "@/db/CRUDquery/admin/contentCRUD";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/globals/getContentImages
 * @desc get content images
 * @access public
 * */

export async function GET ( req ) {
	try {
		const { searchParams } = new URL(req.url);
		const content_ID = parseInt(searchParams.get("id")) || null
		const isWantFeatured = parseInt(searchParams.get("featured")) || false
		if (content_ID !== null) {
			const images = await getContentImages(content_ID, isWantFeatured);
			if (images !== 0) {
				return NextResponse.json( images, {status: 200} );
			} else {
				return NextResponse.json( {message: "internal server error"}, {status: 500} );
			}
		} else {
			return NextResponse.json( {message: "Content Id is Not Currect"}, {status: 400} );
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}