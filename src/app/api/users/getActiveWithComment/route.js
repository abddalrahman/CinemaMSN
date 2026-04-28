import { } from "@/db/CRUDquery/global/display/displayCRUD";
import { addActiveWithComment, checkActiveWithComment, checkUserState, deleteActiveWithComment, getActiveWithCommentData } from "@/db/CRUDquery/users/activityCRUD";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { addActiveWithCommentValidation } from "@/utils/zodValidations";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/users/getActiveWithComment
 * @desc get user active with comments
 * @access private (only user himself can access)
 * 
*/
export async function GET ( req ) {
	try {
		const tokenInfo = verifyTokenFunc(req);
		if (tokenInfo === null) {
			return NextResponse.json( {message: "No User Token"}, {status: 401} )
		}
		const { searchParams } = new URL(req.url);
		const contentId = Number(searchParams.get("contentId")) || null;
		const getALl = searchParams.get("get") || null;
		if (contentId === null || !parseInt(contentId)) {
			if (getALl !== "all") {
				return NextResponse.json( {message: "Missing Data"}, {status: 400} )
			}
			const activeData = await getActiveWithCommentData(tokenInfo.id, "all");
			if (activeData === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} )
			return NextResponse.json( activeData === null ? [] : activeData, {status: 200} )
		} else {
			const activeData = await getActiveWithCommentData(tokenInfo.id, contentId);
			if (activeData === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} )
			return NextResponse.json( activeData === null ? [] : activeData, {status: 200} )
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} )
	}
}

/**
 * @method POST
 * @route ~/api/users/getActiveWithComment
 * @desc Add and Delete user active with comments
 * @access private (only user himself can access)
 * 
*/
export async function POST ( req ) {
	try {
		const tokenInfo = verifyTokenFunc(req);
		if (tokenInfo === null) {
			return NextResponse.json( {message: "you are Not Logged in"}, {status: 401} )
		}
		const isActive = await checkUserState(tokenInfo.id);
		if (isActive === false) {
			return NextResponse.json( {message: "This User is not Exist"}, {status:"401"} );
		}
		if (isActive !== "active") {
			return NextResponse.json( {message: "your account is not active"}, {status:"401"} );
		}
		const body = await req.json();
		const validation = addActiveWithCommentValidation.safeParse(body);
		if (!validation.success) return NextResponse.json( {message: validation.error.issues[0].message}, {status: 400} );
		if (body.user_id == tokenInfo.id) return NextResponse.json( {message: "You Cant interactive with Your Comments"}, {status: 403} );

		const isActiveExist = await checkActiveWithComment(tokenInfo.id, body.comment_id, body.active);
		if (isActiveExist === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		if (isActiveExist === null) {
			const addActive = await addActiveWithComment(tokenInfo.id, body.comment_id, body.content_id, body.active, body.user_id);
			if (addActive === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			return NextResponse.json( {message: "Success"}, {status: 200} );
		} else {
			const deleteActive = await deleteActiveWithComment(tokenInfo.id, body.comment_id, body.content_id, body.active, body.user_id);
			if (deleteActive === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			return NextResponse.json( {message: "Success"}, {status: 200} );
		}

	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} )
	}
}

