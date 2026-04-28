import { checkIfContentExist } from "@/db/CRUDquery/admin/contentCRUD";
import { addToWatchTable, checkUserState, deleteFromWatch, updateWatchStatus } from "@/db/CRUDquery/users/activityCRUD";
import { checkUserWatchingExist, getUserWatchingData } from "@/db/CRUDquery/users/otherCRUD";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { addWatchListAndWatched } from "@/utils/zodValidations";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/users/activity/userWatching
 * @desc get watching list for a user or get watchlist or watched
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
		const getWatchingList = await getUserWatchingData(userInfo.id);
		if (getWatchingList === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		return NextResponse.json( getWatchingList === null ? [] : getWatchingList, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}

/**
 * @method POST
 * @route ~/api/users/activity/userWatching
 * @desc add content to watching list or watched list
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
		const validation = addWatchListAndWatched.safeParse(body);
		if (!validation.success) {
			return NextResponse.json( {message: validation.error.issues[0].message}, {status: 400} );
		}
		const contentExist = await checkIfContentExist(body.content_id);
		if (contentExist === 0) return NextResponse.json( {message: "this content is not Exist"}, {status: 404} );
		if (body.wl_status === "watched" && contentExist.c_status === "upcoming") {
			return NextResponse.json( {message: "It's Upcoming Content you can't added to watched yet"}, {status: 400} );
		}
		const isExist = await checkUserWatchingExist(userInfo.id, body.content_id);
		if (isExist === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		if (isExist === null) {
			const addWatchingStatus = await addToWatchTable(userInfo.id, body.content_id, body.wl_status);
			if (addWatchingStatus === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			return NextResponse.json( {message: "added successfuly"}, {status: 201} );

		} else {
			const statusIs = isExist.wl_status;
			if (statusIs === body.wl_status) {
				const deleteWatch = await deleteFromWatch(userInfo.id, body.content_id);
				if (deleteWatch === 0 || deleteWatch === null) return NextResponse.json( {message: "internal server error"}, {status: 500} );
				return NextResponse.json( {message: "deleted successfuly"}, {status: 200} );
			
			} else {
				const updateWatch = await updateWatchStatus(userInfo.id, body.content_id, body.wl_status);
				if (updateWatch === 0 || updateWatch === null) return NextResponse.json( {message: "internal server error"}, {status: 500} );
				return NextResponse.json( {message: "updated successfuly"}, {status: 200} );
			}
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}