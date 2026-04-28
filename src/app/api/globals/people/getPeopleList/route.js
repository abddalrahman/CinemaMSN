import { getPeopleListFromArray } from "@/db/CRUDquery/global/peopleCRUD";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/globals/people/getPeopleList
 * @desc get people list
 * @access public
 * */

export async function GET ( req ) {
	try {
		const { searchParams } = new URL(req.url);
		const people_IDs = searchParams.get("ids") || null
		if (people_IDs !== null) {
			const IDsList = JSON.parse(people_IDs);
			if (Array.isArray(IDsList)) {
				const FilteredArray = [...new Set(IDsList)];
				const people = await getPeopleListFromArray(FilteredArray);
				if (people !== 0 && people !== null) {
					return NextResponse.json( people, {status: 200} );
				} else if (people === null) {
					return NextResponse.json( {message: "Failed to Get all people"}, {status: 500} );
				} else if (people === 0) {
					return NextResponse.json( {message: "internal server error"}, {status: 500} );
				}
			} else {
				return NextResponse.json( {message: "Data Type Error"}, {status: 500} );
			}
		} else {
			return NextResponse.json( {message: "Required Data Missing"}, {status: 400} );
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}