import { addToFavoriteTable, checkUserState, deleteFromFavorite } from "@/db/CRUDquery/users/activityCRUD";
import { checkUserFavoriteExist, getUserFavoriteData } from "@/db/CRUDquery/users/otherCRUD";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/users/activity/userFavorite
 * @desc get favorite list for a user
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
		
		const getFavoriteList = await getUserFavoriteData(userInfo.id);
		if (getFavoriteList === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		return NextResponse.json( getFavoriteList === null ? [] : getFavoriteList, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}

/**
 * @method POST
 * @route ~/api/users/activity/userFavorite
 * @desc add Favorite person to favorite table for a user
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
		const personID = Number(body.person_id) || null;
		if (personID === null || !Number.isInteger(personID)) {
			return NextResponse.json( {message: "person id is not currect"}, {status: 400} );			
		}

		const isExist = await checkUserFavoriteExist(userInfo.id, body.person_id);
		if (isExist === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		if (isExist === null) {
			const addFavorite = await addToFavoriteTable(userInfo.id, body.person_id);
			if (addFavorite === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			return NextResponse.json( {message: "added successfuly"}, {status: 201} );
		} else {
			const deleteFav = await deleteFromFavorite(userInfo.id, body.person_id);
			if (deleteFav === 0 || deleteFav === null) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			return NextResponse.json( {message: "deleted successfuly"}, {status: 200} );
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}