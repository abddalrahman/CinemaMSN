import { checkUserState } from "@/db/CRUDquery/users/activityCRUD";
import { addToFollowingData, checkFollowingExist, deleteFromFollowing, getUserFollowingData } from "@/db/CRUDquery/users/otherCRUD";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/users/activity/userFollowing
 * @desc get user following list
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
		const getFollowingList = await getUserFollowingData(userId === null ? userInfo.id : userId);
		if (getFollowingList === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		return NextResponse.json( getFollowingList === null ? [] : getFollowingList, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}

/**
 * @method POST
 * @route ~/api/users/activity/userFollowing
 * @desc add or delete user following
 * @access private (only user himself can access)
 */
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
		const currentU = Number(body.currentU) || null;
		const visitorU = Number(body.visitorU) || null;
		if (currentU === null || !Number.isInteger(currentU) || visitorU === null || !Number.isInteger(visitorU)) {
			return NextResponse.json( {message: "invalid data"}, {status: 400} );			
		}
		const isExist = await checkFollowingExist(currentU, visitorU);
		if (isExist === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		if (isExist === null) {
			const addFollowing = await addToFollowingData(visitorU, currentU);
			if (addFollowing === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			return NextResponse.json( {message: "Following Success"}, {status: 200} );
		}
		const deleteFollowing = await deleteFromFollowing(visitorU, currentU);
		if (deleteFollowing === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		return NextResponse.json( {message: "UnFollowing Success"}, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}