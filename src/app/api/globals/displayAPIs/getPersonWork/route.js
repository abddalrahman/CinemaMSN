import { getContentsListPopularity, getPersonContents } from "@/db/CRUDquery/global/display/displayCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/displayAPIs/getPersonWork
 * @desc get person contents with his role in each one ordered by popularity
 * @access public
 */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const pid = Number(searchParams.get("id")) || null;
		if (pid === null || !parseInt(pid)) {
			return NextResponse.json( {message:"Required Data Missing"}, {status: 400} );
		}
		const contentsData = await getPersonContents(pid);
		if (contentsData === null) return NextResponse.json( [], {status: 200} );
		if (contentsData === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		const contentsIDs = contentsData.map((content) => Number(content.content_id));

		const contentsPopularity = await getContentsListPopularity(contentsIDs);
		if (contentsPopularity === 0 || contentsData.length !== contentsPopularity.length) return NextResponse.json( 
			{message: "internal server error"}, {status: 500} 
		);
		const finalResult = [];
		for (let i = 0; i < contentsPopularity.length; i++) {
			const item = contentsData.pop();
			const fromOtherProps = contentsPopularity.filter((content) => content.content_id == item.content_id)[0];
			finalResult.push({...item, ...fromOtherProps});
		}
		finalResult.sort((a, b) => b.popularity - a.popularity);
		return NextResponse.json( finalResult, {status: 200} );

	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}