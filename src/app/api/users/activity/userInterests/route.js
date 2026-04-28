import { addToInterestTable, checkUserState, deleteFromInterest } from "@/db/CRUDquery/users/activityCRUD";
import { checkUserInterestsExist, getUserInterestsData } from "@/db/CRUDquery/users/otherCRUD";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/users/activity/userInterests
 * @desc get user interests list
 * @access private (only user himself can access)
 */
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
		const userId = Number(searchParams.get("id")) || null;
		const getInterestsList = await getUserInterestsData(userId === null ? userInfo.id : userId);
		if (getInterestsList === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		return NextResponse.json( getInterestsList === null ? [] : getInterestsList, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}

/**
 * @method POST
 * @route ~/api/users/activity/userInterests
 * @desc add user interests
 * @access private (only user himself can access)
 */
export async function POST ( req ) {
	try {
		const userInfo = verifyTokenFunc(req);
		if (userInfo === null) {
			return NextResponse.json( {message: "you have to Login and activate your account"}, {status:"401"} );
		}
		const isActive = await checkUserState(userInfo.id);
		if (isActive === false) {
			return NextResponse.json( {message: "This User is not Exist"}, {status:"400"} );
		}
		if (isActive !== "active") {
			return NextResponse.json( {message: "your account is not active"}, {status:"403"} );
		}

		const body = await req.json();
		const GenreID = Number(body.genre_id) || null;
		if (GenreID === null || !Number.isInteger(GenreID)) {
			return NextResponse.json( {message: "genre id is not currect"}, {status: 400} );			
		}

		const isExist = await checkUserInterestsExist(userInfo.id, body.genre_id);
		if (isExist === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		if (isExist === null) {
			const addInterests = await addToInterestTable(userInfo.id, body.genre_id);
			if (addInterests === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			return NextResponse.json( {message: "added successfuly"}, {status: 201} );
		} else {
			const deleteInterests = await deleteFromInterest(userInfo.id, body.genre_id);
			if (deleteInterests === 0 || deleteInterests === null) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			return NextResponse.json( {message: "deleted successfuly"}, {status: 200} );
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}