import { getReportedComments } from "@/db/CRUDquery/admin/dashboard/dashboardCRUD";
import { checkIfUserIsAdmin } from "@/utils/recurringFunctions";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/admin/showData/getReportedComments
 * @desc get general statistics for dashboard
 * @access private (only admin and helper can access) 
 * */

export async function GET (req) {
	try {
		const userRole = checkIfUserIsAdmin(req);
		if (userRole === null) return NextResponse.json( {message:"your Are not Allowed Access"}, {status: 403} );
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 10;
		const comments = await getReportedComments(page, limit);
		if (comments === null) {
			return NextResponse.json( {message:"internal server error"}, {status: 500} );
		}
		return NextResponse.json( {data:comments, dataLength: comments.length}, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}