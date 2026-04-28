import { checkUserMessageExist } from "@/db/CRUDquery/admin/messagesCRUD";
import { addUserMessage, checkAdminMessageExist, checkUserState, deleteUserMessages, getAllUserMessaegs, updateAdminMessages } from "@/db/CRUDquery/users/activityCRUD";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { userMessage } from "@/utils/zodValidations";
import { NextResponse } from "next/server";


/**
 * @method GET
 * @route ~/api/users/activity/sendMessage
 * @desc get all user messages [he sent it or sent to him]
 * @access private (only loged in and active users can access ites messages) 
 * */
export async function GET ( req ) {
	try {
		const userInfo = verifyTokenFunc(req);
		if (userInfo === null) return NextResponse.json( {message: "Login to accesss"}, {status:"401"} );
		const allUserMessages = await getAllUserMessaegs(userInfo.id);
		if (allUserMessages === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		return NextResponse.json( allUserMessages, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}


/**
 * @method POST
 * @route ~/api/users/activity/sendMessage
 * @desc add user message
 * @access private (only loged in and active users can sent messages) 
 * */
export async function POST ( req ) {
	try {
		const userInfo = verifyTokenFunc(req);
		if (userInfo === null) return NextResponse.json( {message: "Login to send message"}, {status:"401"} );
		
		const isActive = await checkUserState(userInfo.id);
		if (isActive === false) return NextResponse.json( {message: "invalid User Data"}, {status:"400"} );
		if (isActive !== "active") return NextResponse.json( {message: "your account is not active"}, {status:"401"} );

		const data = await req.json();
		const validation = userMessage.safeParse(data);
		if (!validation.success) return NextResponse.json( {message: "invalid data"}, {status: 400} );
		// check if the message he reply to exist and its sent to him
		if (!data.reply_to_id) {
			const addMessage = await addUserMessage(data.title, data.body, null, userInfo.id);
			if (addMessage === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			return NextResponse.json( {message: "Message Sent Successfully"}, {status: 200} );
		}
		const isMessageExist = await checkAdminMessageExist(data.reply_to_id, userInfo.id);
		if (isMessageExist === null) return NextResponse.json( {message: "you can't reply to this message"}, {status: 401} ); 
		if (isMessageExist === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} ); 
		const addMessage = await addUserMessage(data.title, data.body, data.reply_to_id, userInfo.id);
		if (addMessage === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		return NextResponse.json( {message: "Message Sent Successfully"}, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}

/**
 * @method PUT
 * @route ~/api/users/activity/sendMessage
 * @desc update admins messages read state
 * @access private [only user how the message sent to him can access]
 * */
export async function PUT ( req ) {
	try {
		const userInfo = verifyTokenFunc(req);
		if (userInfo === null) return NextResponse.json( {message: "Login to send message"}, {status:"401"} );

		const body = await req.json();
		const mId = Number(body.id) || null;
		if (mId === null || !Number.isInteger(mId)) return NextResponse.json( {message: "Invalid Data"}, {status: 400} );
		const checkMessage = await checkAdminMessageExist(mId, userInfo.id);
		if (checkMessage === null) return NextResponse.json( {message: "Invalid Data"}, {status: 404} );
		if (checkMessage === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );

		const updatedMessages = await updateAdminMessages (mId);
		if (updatedMessages === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} )
		if (updatedMessages === null) return NextResponse.json( {message: "this message is not Exist"}, {status: 404} );
		return NextResponse.json( {message: "Updated Successfully"}, {status: 200} );
	} catch (error){
		console.log(error);
		return NextResponse.json({message: "internal server error"}, {status: 500})
	}
}

/**
 * @method DELETE
 * @route ~/api/users/activity/sendMessage
 * @desc delete user messages
 * @access private [only user how sent message]
 * */
export async function DELETE ( req ) {
	try {
		const userInfo = verifyTokenFunc(req);
		if (userInfo === null) return NextResponse.json( {message: "Login to send message"}, {status:"401"} );

		const body = await req.json();
		const mId = Number(body.id) || null;
		if (mId === null || !Number.isInteger(mId)) return NextResponse.json( {message: "Invalid Data"}, {status: 400} );
		const checkMessage = await checkUserMessageExist(mId, userInfo.id);
		if (checkMessage === null) return NextResponse.json( {message: "Invalid Data"}, {status: 404} );
		if (checkMessage === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );

		const deletedMessages = await deleteUserMessages (mId);
		if (deletedMessages === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} )
		if (deletedMessages === null) return NextResponse.json( {message: "this message is not Exist"}, {status: 404} );
		return NextResponse.json( {message: "Deleted Successfully"}, {status: 200} );
	} catch (error){
		console.log(error);
		return NextResponse.json({message: "internal server error"}, {status: 500})
	}
}