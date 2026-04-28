import { getPeopleNamesAndRolesData } from "@/db/CRUDquery/global/display/displayCRUD";
import { PeopleAndRolesLists } from "@/utils/zodValidations";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/displayAPIs/getPeoplesNamesAndRoles
 * @desc get names and roles for people from array of pIDs and gIDs
 * @access public
 * 
*/
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const pIDs = searchParams.get("pIDs") || null;
		const gIDs = searchParams.get("gIDs") || null; // roles ids
		if (pIDs === null || gIDs === null) {
			return NextResponse.json( {message: "Required Data Missing"}, {status: 400} );
		}
		const peopleIDs = JSON.parse(pIDs) || null;
		const rolesIDs = JSON.parse(gIDs) || null;
		const rolesIDsSet = [...new Set(rolesIDs)];

		// validation 
		const validation = PeopleAndRolesLists.safeParse({peopleIDs, rolesIDsSet});
		if (!validation.success) {
			return NextResponse.json( {message: validation.error.issues[0].message}, {status: 400} );
		}
		const dataToReturn = await getPeopleNamesAndRolesData(peopleIDs, rolesIDsSet);
		if (dataToReturn === 0) return NextResponse.json( {message:"internal server error"}, {status: 500} );
		if (dataToReturn === null) return NextResponse.json( {message:"failed to finde some data"}, {status: 404} );
		return NextResponse.json( dataToReturn, {status: 200} );

	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}