import { getContentListFromArray, getContentsRatingAvg, getLikeGenresContent } from "@/db/CRUDquery/global/contentCRUD";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/globals/content/getContentWithFiltering
 * @desc get semiler content or content filtering by genres
 * @access public
 * */

export async function GET ( req ) {
	try {
		const { searchParams } = new URL(req.url);
		const likeList = searchParams.get("like_list") || null;
		const type = searchParams.get("type") || null
		const cId = Number(searchParams.get("cid")) || null
		const genreFilterID = Number(searchParams.get("genreid")) || null
		if (likeList === null && genreFilterID === null) {
			return NextResponse.json( {message: "Required Data Missing"}, {status: 400} );
		}
		if (likeList !== null && (type === "M" || type === "S") && cId !== null && parseInt(cId)) {
			const IDsList = JSON.parse(likeList);
			if (!Array.isArray(IDsList)) return NextResponse.json( {message: "Data format error"}, {status: 400} );
			const contents = await getLikeGenresContent(IDsList, type, cId);
			
			if (contents === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			if (contents === null) return NextResponse.json( [], {status: 200} );
			
			const contentRatings = await getContentsRatingAvg(contents.map((c) => Number(c.content_id)));
			if (contentRatings === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			return NextResponse.json( {contents, contentRatings}, {status: 200} );
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}