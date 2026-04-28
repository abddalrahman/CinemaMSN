import { checkIfGenreExist } from "@/db/CRUDquery/admin/genresCRUD";
import { addPersonAward, CheckIfPersonAwardExist, checkIfPersonExist, DeletePeopleAward } from "@/db/CRUDquery/admin/peopleCRUD";
import { checkIfUserIsAdmin } from "@/utils/recurringFunctions";
import { addPeopleAwardsValidation, deletePeopleAwardsValidation } from "@/utils/zodValidations";
import { NextResponse } from "next/server";

/**
 * @method POST
 * @route ~/api/admin/people/pAward
 * @desc Add people awards
 * @access private (only admin and helper can access) 
 * */
export async function  POST ( req ) {
	try {
		const isUserAdmin = checkIfUserIsAdmin( req );
		if (isUserAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
		const body = await req.json();
		const validationAwards = addPeopleAwardsValidation.safeParse(body);
		if (!validationAwards.success) {
			return NextResponse.json( {message: validationAwards.error.issues[0].message}, {status: 400} );
		}
		
		const isPersonExist = await checkIfPersonExist(body.person_id);
		const isGenresExist = await checkIfGenreExist( {kind: 'person_award', name: body.genre_name} );
		if (isPersonExist === 0 || isGenresExist === 0) {
			return NextResponse.json( {
				message: `${isPersonExist === 0 ? "Person ID is not Exist, " :''} ${isGenresExist === 0 ? "this Award is not Exist" :''}`},
				{status: 400}
			);
		}

		const isAwardExist = await CheckIfPersonAwardExist(body.person_id, isGenresExist.genre_id, body.awarded_at);
		if (isAwardExist === null) {
			return NextResponse.json( {message: "this Award is already Added to this Person in that time"}, {status: 409} );
		}
		if (isAwardExist === 0) {
			return NextResponse.json( {message: "Some Thing Went Wrong Try Again"}, {status: 500} );
		}
		
		const addAward = await addPersonAward(body.person_id, isGenresExist.genre_id, body.awarded_at);
		if (addAward === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		return NextResponse.json( {message: "Award Added Successfuly"}, {status: 200} );

	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} )
	}
}

/**
 * @method DELETE
 * @route ~/api/admin/people/pAward
 * @desc delete people awards
 * @access private (only admin and helper can access) 
 * */
export async function DELETE ( req ) {
	try {
		const isUserAdmin = checkIfUserIsAdmin( req );
		if (isUserAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
		const body = await req.json();
		const validationAwards = deletePeopleAwardsValidation.safeParse(body);
		if (!validationAwards.success) {
			return NextResponse.json( {message: validationAwards.error.issues[0].message}, {status: 400} );
		}
		const {person_id, genre_id, awarded_at} = body;
		const deletedPeople = await DeletePeopleAward(person_id, genre_id, awarded_at);
		if (deletedPeople === 0) {
			return NextResponse.json({ message: "internal server error"}, {status: 500});
		} else if (deletedPeople === null){
			return NextResponse.json({ message: "Award not Found"}, {status: 404});
		}else {
			return NextResponse.json({ message: "Award Deleted Successfuly"}, {status: 200});
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} )
	}
}