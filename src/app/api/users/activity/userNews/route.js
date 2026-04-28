import { addToNewsSaved, checkUserNewsExist, checkUserState, deleteFromNewsSaved, getUserNewsSaves } from "@/db/CRUDquery/users/activityCRUD";
import { checkUserPrivacySettings } from "@/db/CRUDquery/users/otherCRUD";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/users/activity/userNews
 * @desc get user saved news
 * @access private (only user himself can access)
 */
export async function GET ( req ) {
	try {
		const userInfo = verifyTokenFunc(req);
		if (userInfo === null) {
			return NextResponse.json( {message: "internal server error"}, {status:"500"} );
		}
		const { searchParams } = new URL(req.url);
		const needJustIDs = searchParams.get("JustIDs") || null;
		const userId = Number(searchParams.get("id")) || null;
		let userSettings = null;
		if (Number(userId) !== Number(userInfo.id) && needJustIDs === null) {
			userSettings = await checkUserPrivacySettings(userId);
		}
		if (userSettings === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} )
		}
		if (userSettings === null || userSettings.is_news_saved_private === false) {
			const getNewsSaved = await getUserNewsSaves(userId === null ? userInfo.id : userId, needJustIDs !== null);
			if (getNewsSaved === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			return NextResponse.json( getNewsSaved === null ? [] : getNewsSaved, {status: 200} );
		}
		return NextResponse.json( {message: "private!!"}, {status: 401} )
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}

/**
 * @method POST
 * @route ~/api/users/activity/userNews
 * @desc add or remove news from saved news
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
		const newsID = Number(body.news_id) || null;
		if (newsID === null || !parseInt(newsID)) {
			return NextResponse.json( {message: "news id is not currect"}, {status: 400} );			
		}

		const isExist = await checkUserNewsExist(userInfo.id, body.news_id);
		if (isExist === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		if (isExist === null) {
			const addNews = await addToNewsSaved(userInfo.id, body.news_id);
			if (addNews === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			return NextResponse.json( {message: "added successfuly"}, {status: 201} );
		} else {
			const deleteNews = await deleteFromNewsSaved(userInfo.id, body.news_id);
			if (deleteNews === 0 || deleteNews === null) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			return NextResponse.json( {message: "Deleted successfuly"}, {status: 200} );
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}