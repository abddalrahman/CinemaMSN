import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/users/logout
 * @desc logout [delete token]
 * @access public
 */

export async function GET (req) {
	try {
		const respons = NextResponse.json({message: "Logout"}, {status: 200});
		respons.cookies.delete('jwtToken');
		return respons;

	} catch (error) {
		console.log(error);
		return NextResponse.json({message: "internal server error"}, {status: 500});
	}
}