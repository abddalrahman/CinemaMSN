import { checkUserPrivacySettings, getUserContentWatchData, getUserRatingsData } from "@/db/CRUDquery/users/otherCRUD";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/users/profile/getSectionsData
 * @desc get profile Sections Data [ratings, watchlist, watched]
 * @access private Only owner user or not private user settings. 
 * */

export async function GET ( req ) {
	try {
		const tokenInfo = verifyTokenFunc(req);
		if (tokenInfo === null) {
			return NextResponse.json( {message: "No User Token"}, {status: 401} )
		}
		const { searchParams } = new URL(req.url);
		const section = searchParams.get("section") || null;
		const userId = Number(searchParams.get("id")) || null;
		const limited = searchParams.get("limited") || null;
		if (section === null || userId === null || !Number(userId)) {
			if (!Number(userId)) return NextResponse.json( {message: "Invalid Data"}, {status: 400} )
			if (!["Ratings", "Watchlist", "Watched"].includes(section)) return NextResponse.json( {message: "Invalid Data List"}, {status: 400} )
			return NextResponse.json( {message: "Missing Data"}, {status: 400} )
		}
		let userSettings = null;
		if (Number(userId) !== Number(tokenInfo.id)) {
			userSettings = await checkUserPrivacySettings(userId);
		}
		if (userSettings === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} )
		}
		let dataToReturn = null
		if (section === "Ratings" && (userSettings === null || userSettings.is_ratings_private === false)) {
			dataToReturn = await getUserRatingsData(userId, limited !== null ? 20 : null);
		} else if (section === "Watchlist" && (userSettings === null || userSettings.is_watchlist_private === false)) {
			dataToReturn = await getUserContentWatchData(userId, "queued", limited !== null ? 20 : null);
		} else if (section === "Watched" && (userSettings === null || userSettings.is_watchlist_private === false)) {
			dataToReturn = await getUserContentWatchData(userId, "watched", limited !== null ? 20 : null);
		}

		if (dataToReturn === 0 || dataToReturn === null) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} )
		} else {
			return NextResponse.json( dataToReturn, {status: 200} )
		}

	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} )
	}
}