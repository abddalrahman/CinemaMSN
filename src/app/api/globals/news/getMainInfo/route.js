import { checkNewsIfExist } from "@/db/CRUDquery/admin/newsCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/news/getMainInfo
 * @desc get Main News Data
 * @access public
 * */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const id = Number(searchParams.get("id")) || null;
		if (id === null || !parseInt(id)) {
			return NextResponse.json( {message: "Missing Data"}, {status: 400} );
		}
		const news = await checkNewsIfExist(id);
		if (news === null) {
			return NextResponse.json( {message: "This News is not Exist"}, {status: 404} );
		} else if (news === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		} else {
			return NextResponse.json( news, {status: 200} );
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}