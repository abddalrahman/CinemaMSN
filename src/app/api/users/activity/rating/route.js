import { checkIfContentExist } from "@/db/CRUDquery/admin/contentCRUD";
import { addRating, checkRatingIfExist, checkUserState, deleteRating, editRating } from "@/db/CRUDquery/users/activityCRUD";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { addRatingValidation } from "@/utils/zodValidations";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/users/activity/rating
 * @desc get user rating for a content
 * @access private (only loged in and active users can rating) 
 * */

export async function GET ( req ) {
	try {
		const userInfo = verifyTokenFunc(req);
		if (userInfo === null) {
			return NextResponse.json( {message: "internal server error"}, {status:"500"} );
		}
		const isActive = await checkUserState(userInfo.id);
		if (isActive === false) {
			return NextResponse.json( {message: "This User is not Exist"}, {status:"400"} );
		}
		if (isActive !== "active") {
			return NextResponse.json( {message: "your account is not active"}, {status:"400"} );
		}
		const { searchParams } = new URL(req.url);
		const contentID = Number(searchParams.get("cid")) || null;
		if (contentID === null || !parseInt(contentID)) {
			return NextResponse.json( {message: "Content Id is Not Currect"}, {status: 400} );
		}
		const rating = await checkRatingIfExist(contentID, userInfo.id);
		if (rating === false) return NextResponse.json( {message: "rating not found"}, {status: 404} );
		if (rating === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		return NextResponse.json( rating, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}

/**
 * @method POST
 * @route ~/api/users/activity/rating
 * @desc Add content rating
 * @access private (only loged in and active users can rating) 
 * */

export async function POST ( req ) {
	try {
		const userInfo = verifyTokenFunc(req);
		if (userInfo === null) {
			return NextResponse.json( {message: "internal server error"}, {status:"500"} );
		}
		const isActive = await checkUserState(userInfo.id);
		if (isActive === false) {
			return NextResponse.json( {message: "This User is not Exist"}, {status:"400"} );
		}
		if (isActive !== "active") {
			return NextResponse.json( {message: "your account is not active"}, {status:"400"} );
		}
	
		const body = await req.json();
		const validationRating = addRatingValidation.safeParse(body);
		if (!validationRating.success) {
			return NextResponse.json( {message: validationRating.error.issues[0].message}, {status: 400} );
		}
		const isContentExist = await checkIfContentExist(body.content_id);
		if (isContentExist === 0) {
			return NextResponse.json( {message: "internal error or content id is not exist"}, {status: 500} );
		}
		if (isContentExist.c_status === "upcoming") return NextResponse.json( {message: "can't add rating to upcoming content"}, {status: 400} );
		const isRatingExist = await checkRatingIfExist(body.content_id, userInfo.id);
		if (isRatingExist !== false) {
			if (isRatingExist === 0) {
				return NextResponse.json( {message: "internal server error"}, {status: 500} );
			}
			const updatedRating = await editRating(body.content_id, userInfo.id, body.score);
			if (updatedRating === 0) {
				return NextResponse.json( {message: "internal server error"}, {status: 500} );
			}
			return NextResponse.json( {message: "RAting Updated Successfuly"}, {status: 200} );
		}
		
		const addNewRating = await addRating(body.content_id, userInfo.id, body.score);
		if (addNewRating === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		return NextResponse.json( {message: "Rating Added Successfuly"}, {status: 201} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}

/**
 * @method DELETE
 * @route ~/api/users/activity/rating
 * @desc delete content rating
 * @access private (only loged in and active users can rating) 
 * */

export async function DELETE ( req ) {
	try {
		const userInfo = verifyTokenFunc(req);
		if (userInfo === null) {
			return NextResponse.json( {message: "internal server error"}, {status:"500"} );
		}
		const isActive = await checkUserState(userInfo.id);
		if (isActive === false) {
			return NextResponse.json( {message: "This User is not Exist"}, {status:"400"} );
		}
		if (isActive !== "active") {
			return NextResponse.json( {message: "your account is not active"}, {status:"400"} );
		}
	
		const body = await req.json();
		const contentID = Number(body?.content_id) || null;
		if (contentID === null || !parseInt(contentID)) {
			return NextResponse.json( {message: "Content Id is Not Currect"}, {status: 400} );
		}

		const deletedRating = await deleteRating(body.content_id, userInfo.id);
		if (deletedRating === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		if (deletedRating === null) {
			return NextResponse.json( {message: "Rating not found"}, {status: 404} );
		}
		return NextResponse.json( {message: "Rating Deleted Successfuly"}, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}