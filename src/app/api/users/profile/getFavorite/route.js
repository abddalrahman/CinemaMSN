import { getUserFavorite } from "@/db/CRUDquery/global/display/displayCRUD";
import { checkUserPrivacySettings } from "@/db/CRUDquery/users/otherCRUD";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/users/profile/getFavorite
 * @desc get user favorite
 * @access private Only owner user or not private user settings. 
 * */

export async function GET ( req ) {
	try {
		const tokenInfo = verifyTokenFunc(req);
		if (tokenInfo === null) {
			return NextResponse.json( {message: "No User Token"}, {status: 401} )
		}
		const { searchParams } = new URL(req.url);
		const userId = Number(searchParams.get("id")) || null;
		const limited = searchParams.get("limited") || null;
		if (userId === null) {
			if (!Number(userId)) return NextResponse.json( {message: "Invalid Data"}, {status: 400} )
			return NextResponse.json( {message: "Missing Data"}, {status: 400} )
		}
		let userSettings = null;
		if (Number(userId) !== Number(tokenInfo.id)) {
			userSettings = await checkUserPrivacySettings(userId);
		}
		if (userSettings === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} )
		}
		if (userSettings === null || userSettings.is_favorite_people_private === false) {
			const favoritesData = await getUserFavorite(userId, limited !== null ? 20 : null);
			if (favoritesData === 0) {
				return NextResponse.json( {message: "internal server error"}, {status: 500} )
			} else {
				return NextResponse.json( favoritesData, {status: 200} )
			}
		}
		return NextResponse.json( {message: "private!!"}, {status: 401} )

	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} )
	}
}