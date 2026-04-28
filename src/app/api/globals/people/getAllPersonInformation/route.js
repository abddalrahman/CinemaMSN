import { getAllPersonInfo } from "@/db/CRUDquery/admin/peopleCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/people/getAllPersonInformation
 * @desc get all person information
 * @access public
 * */

export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const id = parseInt(searchParams.get("id")) || null;
		if (!id) {
			return NextResponse.json( {message: "ID is not currect"}, {status: 400} );
		}
		const person = await getAllPersonInfo(id);
		if (person === null) {
			return NextResponse.json( {message: "This Person is not Exist"}, {status: 404} );
		} else if (person === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		return NextResponse.json( {...person}, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}