import { getStatistic } from "@/db/CRUDquery/admin/dashboard/dashboardCRUD";
import { checkIfUserIsAdmin } from "@/utils/recurringFunctions";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/admin/showData/statistics
 * @desc get general statistics for dashboard
 * @access private (only admin and helper can access) 
 * */

export async function GET (req) {
	try {
		const userRole = checkIfUserIsAdmin(req);
		if (userRole === null) return NextResponse.json( {message:"your Are not Allowed Access"}, {status: 403} );
		const statistic = await getStatistic();
		if (statistic === null) return NextResponse.json( {message:"internal server error"}, {status: 500} );
		return NextResponse.json( statistic, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}