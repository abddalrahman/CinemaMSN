import { getUserMInfoFromIdsList } from "@/db/CRUDquery/global/display/displayCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/displayAPIs/getUserMInfoFromList
 * @desc get users profile images and names from a list
 * @access public
 */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const IDs = searchParams.get("IDs") || null;
		if (IDs === null) return NextResponse.json( {message:"Required Data Missing"}, {status: 400} );
		const IDsList = JSON.parse(IDs) || null;
		if (!Array.isArray(IDsList) || IDsList === null) return NextResponse.json( {message:"Data Type Error"}, {status: 400} );

		const usersData = await getUserMInfoFromIdsList(IDsList);
		if (usersData === 0) return NextResponse.json( {message:"internal server error"}, {status: 500} );
		if (usersData === null) return NextResponse.json( {message:"invalid data something is wrong"}, {status: 200} );
		return NextResponse.json( usersData, {status: 200} );
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}