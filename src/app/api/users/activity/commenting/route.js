import { checkIfContentExist } from "@/db/CRUDquery/admin/contentCRUD";
import { addComment, checkCommentIfExist, checkUserState, deleteCommentFunc, updateComment } from "@/db/CRUDquery/users/activityCRUD";
import { checkIfUserIsAdmin } from "@/utils/recurringFunctions";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { addCommentValidation, updateCommentValidation } from "@/utils/zodValidations";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/users/activity/commenting
 * @desc get specific comment
 * @access public 
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
		const { searchParams } = new URL(req.url) 
		const getCurrentUser = searchParams.get("needCheck") || null;
		const userId = getCurrentUser === null ? Number(searchParams.get("uId")) || null : userInfo.id;
		const contentId = Number(searchParams.get("cId")) || null;
		if (userId === null || contentId === null || !parseInt(userId) || !parseInt(contentId)) {
			return NextResponse.json( {message: "Missing Data"}, {status: 400} );
		}

		const getCommentData = await checkCommentIfExist(userId, contentId);
		if (getCommentData === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		if (getCommentData === null) return NextResponse.json( {message: "This Comment is not Exist"}, {status: 404} );
		return NextResponse.json( getCommentData, {status: 200} );

	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}


/**
 * @method POST
 * @route ~/api/users/activity/commenting
 * @desc Add comment
 * @access private (only loged in and active users can comment) 
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
	
		const data = await req.json();
		const validation = addCommentValidation.safeParse(data);
		if (!validation.success) {
			return NextResponse.json( {message: validation.error.issues[0].message}, {status: 400} );
		}
		const isContentExist = await checkIfContentExist(data.content_id);
		if (isContentExist === 0) {
			return NextResponse.json( {message: "internal error or content id is not exist"}, {status: 500} );
		}
		if (isContentExist.c_status === "upcoming") return NextResponse.json( {message: "can't add comment to upcoming content"}, {status: 400} );
		const isCommentExist = await checkCommentIfExist(userInfo.id, data.content_id);
		if (isCommentExist !== null) {
			if (isCommentExist === 0) {
				return NextResponse.json( {message: "internal server error"}, {status: 500} );
			}
			return NextResponse.json( {message: "You are Alredy Review this Content"}, {status: 409} );
		}
		
		const addNewComment = await addComment(userInfo.id, data.content_id, data.title, data.body, data.is_spoiler_by_author);
		if (addNewComment === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		return NextResponse.json( {message: "Review added successfuly"}, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}

/**
 * @method PUT
 * @route ~/api/users/activity/commenting
 * @desc update comment
 * @access private (only loged in and active users can comment) 
 * */

export async function PUT ( req ) {
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
	
		const data = await req.json();
		const validation = updateCommentValidation.safeParse(data);
		if (!validation.success) {
			return NextResponse.json( {message: validation.error.issues[0].message}, {status: 400} );
		}
		const isCommentExist = await checkCommentIfExist(userInfo.id, data.content_id);
		if (isCommentExist === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		if (isCommentExist === null) {
			return NextResponse.json( {message: "This Comment is not Exist"}, {status: 404} );
		}
		
		const {content_id, ...otherData} = data
		const updatedComment = await updateComment(userInfo.id, content_id, otherData);
		if (updatedComment === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		return NextResponse.json( {message: "Review Updated successfuly"}, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}

/**
 * @method DELETE
 * @route ~/api/users/activity/commenting
 * @desc delete comment
 * @access private (only [loged in and active users] himself can access) 
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
		const userIsAdmin = checkIfUserIsAdmin(req);

		const data = await req.json();
		const commentID = Number(data.id) || null;
		if (commentID === null || !Number.isInteger(commentID)) return NextResponse.json( {message: "invalid Data"}, {status: 400} );
		const deleteComment = await deleteCommentFunc(userInfo.id, commentID, userIsAdmin !== null);
		if (deleteComment === 0 || deleteComment === null) return NextResponse.json( {message: "Failed to Delete Comment"}, {status: 500} );
		return NextResponse.json( {message: "Deleted Successfully"}, {status: 200} );
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}