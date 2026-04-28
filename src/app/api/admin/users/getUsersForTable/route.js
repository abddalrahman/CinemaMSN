import { getMainUserInfo } from "@/db/CRUDquery/admin/dashboard/dashboardCRUD";
import { checkIfUserIsAdmin } from "@/utils/recurringFunctions";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/admin/users/getUsersForTable
 * @desc get main Data About users
 * @access private (only admin and helper can acccess) 
 * */
export async function GET (req) {
	try {
		const isUserAdmin = checkIfUserIsAdmin( req );
		if (isUserAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 10;
		const role = searchParams.get("role") || null;
		const uStatus = searchParams.get("uStatus") || null;
		const userNameEmail = searchParams.get("userNameEmail") || null;
		const filter = {};
		role !== null && role !== "null" ? filter.role = role : '';
		uStatus !== null && uStatus !== "null" ? filter.uStatus = uStatus : '';
		userNameEmail !== null && userNameEmail !== "null" ? filter.userNameEmail = userNameEmail : '';
		const users = await getMainUserInfo(page, limit, Object.keys(filter).length > 0 ? filter : null);
		if (users !== null) {
			return NextResponse.json( {data:users.data, dataLength: users.dataLength}, {status: 200} );
		} else {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}