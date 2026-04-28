import { addAdminMessage, checkUserMessageExist, deleteMessage, getMessages, updateMessages } from "@/db/CRUDquery/admin/messagesCRUD";
import { checkIfUserIsAdmin } from "@/utils/recurringFunctions";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { adminMessage } from "@/utils/zodValidations";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/admin/messages
 * @desc get users and admins messages
 * @access private [only admin and helper can access]
 * */
export async function GET ( req ) {
	try {
		const userIsAdmin = checkIfUserIsAdmin(req);
		if(userIsAdmin === null) {
			return NextResponse.json({message: "you are not authorized"}, {status: 403})
		}
		const { searchParams } = new URL(req.url);
		const page = Number(searchParams.get("page")) || 1;
		const limit = Number(searchParams.get("limit")) || 10;
		const messageFor = searchParams.get("messageFor");
		const justChecked = searchParams.get("checked") || null;
		if (messageFor !== "users" && messageFor !== "admins") return NextResponse.json( {message: "Invalid Data"}, {status: 400} );
		const messages = await getMessages (page, limit, messageFor, justChecked !== null ? true : false);
		if (messages === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		} else {
			return NextResponse.json( {data: messages.data, dataLength: messages.dataLength}, {status: 200} );
		}
		
	} catch (error){
		console.log(error);
		return NextResponse.json({message: "internal server error"}, {status: 500})
	}
}


/**
 * @method PUT
 * @route ~/api/admin/messages
 * @desc update users messages read state
 * @access private [only admin and helper can access]
 * */
export async function PUT ( req ) {
	try {
		const userIsAdmin = checkIfUserIsAdmin(req);
		if(userIsAdmin === null) {
			return NextResponse.json({message: "you are not authorized"}, {status: 403})
		}
		const body = await req.json();
		const mId = Number(body.id) || null;
		if (mId === null || !Number.isInteger(mId)) return NextResponse.json( {message: "Invalid Data"}, {status: 400} );
		const updatedMessages = await updateMessages (mId);
		if (updatedMessages === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} )
		if (updatedMessages === null) return NextResponse.json( {message: "this message is not Exist"}, {status: 404} );
		return NextResponse.json( {message: "Updated Successfully"}, {status: 200} );
	} catch (error){
		console.log(error);
		return NextResponse.json({message: "internal server error"}, {status: 500})
	}
}

/**
 * @method POST
 * @route ~/api/admin/messages
 * @desc send admin messages to users
 * @access private [only admin and helper can access]
 * */
export async function POST ( req ) {
	try {
		const userInfo = verifyTokenFunc(req);
		if (userInfo === null) return NextResponse.json( {message: "Login to send message"}, {status:"401"} );
		if (userInfo.isAdmin !== "admin" && userInfo.isAdmin !== "helper") return NextResponse.json( {message: "you are not authorized"}, {status:"403"} );

		const data = await req.json();
		const validation = adminMessage.safeParse(data);
		if (!validation.success) return NextResponse.json( {message: "invalid data"}, {status: 400} );
		// check if the message he reply to exist and its sent to him
		if (!data.reply_to_id) {
			const addMessage = await addAdminMessage (userInfo.id, data.resever_id, data.title, data.body, null);
			if (addMessage === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			return NextResponse.json( {message: "Message Sent Successfully"}, {status: 200} );
		}
		const isMessageExist = await checkUserMessageExist(data.reply_to_id, data.resever_id);
		if (isMessageExist === null) return NextResponse.json( {message: "you can't reply to this message"}, {status: 401} ); 
		if (isMessageExist === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} ); 
		const addMessage = await addAdminMessage(userInfo.id, data.resever_id, data.title, data.body, data.reply_to_id);
		if (addMessage === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		return NextResponse.json( {message: "Message Sent Successfully"}, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}

/**
* @method DELETE
* @route ~/api/admin/messages
* @desc delete admin messages
* @access private [only admin or helper can access]
* */

export async function DELETE ( req ) {
	try {
		const userIsAdmin = checkIfUserIsAdmin(req);
		if(userIsAdmin === null) {
			return NextResponse.json({message: "you are not authorized"}, {status: 403})
		}
		const body = await req.json();
		const mId = Number(body.id) || null;
		if (mId === null || !Number.isInteger(mId)) return NextResponse.json( {message: "Invalid Data"}, {status: 400} );
		const deletedMessage = await deleteMessage(mId);
		if (deletedMessage === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} )
		if (deletedMessage === null) return NextResponse.json( {message: "this message is not Exist"}, {status: 404} );
		return NextResponse.json( {message: "Deleted Successfully"}, {status: 200} );
		
	} catch (error){
		console.log(error);
		return NextResponse.json({message: "internal server error"}, {status: 500})
	}
}