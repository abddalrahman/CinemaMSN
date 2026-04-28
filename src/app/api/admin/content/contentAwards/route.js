import { addContentAward, CheckIfContentAwardExist, checkIfContentExist } from "@/db/CRUDquery/admin/contentCRUD";
import { checkIfGenreExist } from "@/db/CRUDquery/admin/genresCRUD";
import { checkIfUserIsAdmin } from "@/utils/recurringFunctions";
import { addContentAwardsValidation } from "@/utils/zodValidations";
import { NextResponse } from "next/server";

/**
 * @method POST
 * @route ~/api/admin/content/contentAwards
 * @desc Add content awards
 * @access private (only admin can access) 
 * */
export async function  POST ( req ) {
	try {
		const isUserAdmin = checkIfUserIsAdmin( req );
		if (isUserAdmin === null) {
			return NextResponse.json( {message: "only admin can access"}, {status: 403} );
		}
		const body = await req.json();
		const validationAwards = addContentAwardsValidation.safeParse(body);
		if (!validationAwards.success) {
			return NextResponse.json( {message: validationAwards.error.issues[0].message}, {status: 400} );
		}
		
		const isContentExist = await checkIfContentExist(body.content_id);
		const isGenresExist = await checkIfGenreExist( {kind: 'content_award', name: body.genre_name} );
		if (isContentExist === 0 || isGenresExist === 0) {
			return NextResponse.json( {
				message: `${isContentExist === 0 ? "Content ID is not Exist, " :''} ${isGenresExist === 0 ? "this Award is not Exist" :''}`},
				{status: 400}
			);
		}

		const isAwardExist = await CheckIfContentAwardExist(body.content_id, isGenresExist.genre_id, body.awarded_at);
		if (isAwardExist === null) {
			return NextResponse.json( {message: "this Award is already Added to this Content"}, {status: 409} );
		}
		if (isAwardExist === 0) {
			return NextResponse.json( {message: "Some Thing Want Wrong Try Again"}, {status: 500} );
		}
		
		const addAward = await addContentAward(body.content_id, isGenresExist.genre_id, body.awarded_at);
		if (addAward === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		return NextResponse.json( {message: "Award Added Successfuly"}, {status: 200} );

	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} )
	}
}