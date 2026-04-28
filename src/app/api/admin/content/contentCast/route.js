import { addContentPeople, checkIfContentExist, deleteCastMemeber } from "@/db/CRUDquery/admin/contentCRUD";
import { checkGenreList } from "@/db/CRUDquery/admin/genresCRUD";
import { checkListOfPeolpe } from "@/db/CRUDquery/admin/peopleCRUD";
import { checkIfUserIsAdmin } from "@/utils/recurringFunctions";
import { addContentPeopleConnectionValidation, deletContentCastMemberValidation } from "@/utils/zodValidations";
import { NextResponse } from "next/server";

/**
 * @method POST
 * @route ~/api/admin/content/contentCast
 * @desc add cast members to the content
 * @access private [only admin and helper can access]
*/
export async function POST ( req ) {
	const isAdmin = checkIfUserIsAdmin( req );
	if (isAdmin === null) {
		return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
	}
	
	const body = await req.json();
	const validationBody = addContentPeopleConnectionValidation.safeParse(body);
	if (!validationBody.success) {
		return NextResponse.json( {message: validationBody.error.issues[0].message}, {status: 400} );
	}
	
	const isContentExist = await checkIfContentExist(Number(body[0].content_id));
	if (isContentExist === 0) {
		return NextResponse.json( {message: "this content is not exist"}, {status: 404} );
	}

	const peopleIDs = []
	const rolesIDs = [];
	body.map((obj) => {
		peopleIDs.includes(obj.people_id) ? '' : peopleIDs.push(obj.people_id);
		rolesIDs.includes(obj.role_id) ? '' : rolesIDs.push(obj.role_id);
	});
	const pIDsCurrect = await checkListOfPeolpe(peopleIDs);
	const rIDsCurrect = await checkGenreList(rolesIDs, 'person_role');
	if (pIDsCurrect === 0 || rIDsCurrect === 0) {
		return NextResponse.json( {message: "data entered is wrong"}, {status: 400} );
	}

	const addConnetions = await addContentPeople(isContentExist.content_id, body);
	if (addConnetions === 0) {
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	} else if (addConnetions === false) {
		return NextResponse.json( {message: "some cast member is already exist"}, {status: 200} );
	}
	return NextResponse.json( {message: "Relations Added Successfuly"}, {status: 200} );
}

/**
 * @method DELETE
 * @route ~/api/admin/content/contentCast
 * @desc delete cast member (one member in every time)
 * @access private [only admin and helper can access]
*/
export async function DELETE ( req ) {
	try {
		const isAdmin = checkIfUserIsAdmin(req);
		if (isAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} ) 
		}
		const body = await req.json();
		const validationIDs = deletContentCastMemberValidation.safeParse(body);
		if (!validationIDs.success) {
			return NextResponse.json( {message: validationIDs.error.issues[0].message}, {status: 400} ) 
		}
		const {person_id, content_id, role_genre_id} = body
		const deleteMember = await deleteCastMemeber(person_id, content_id, role_genre_id);
		if (deleteMember === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		} else if (deleteMember === null) {
			return NextResponse.json( {message: "No Data Deleted. Data sent is wrong"}, {status: 400} );
		}
		return NextResponse.json( {message: "Deleted Successfuly"}, {status: 200} );
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}