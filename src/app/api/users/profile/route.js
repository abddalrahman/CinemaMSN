import { getMainUserDate } from "@/db/CRUDquery/users/otherCRUD";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/users/profile
 * @desc get main user Data
 * @access private Only owner user. 
 * */

export async function GET ( req ) {
	try {
		const { searchParams } = new URL(req.url);
		const userId = Number(searchParams.get("id")) || null;
		if (userId !== null) {
			const mainUserData = await getMainUserDate(userId);
			if (mainUserData === 0) {
				return NextResponse.json( {message: "internal server error"}, {status: 500} )
			}
			const {email, ...mainData} = mainUserData;
			return NextResponse.json( mainData, {status: 200} );
		} else {
			return NextResponse.json( {message: "Something is Wrong!!"}, {status: 400} )
		}

	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} )
	}
}