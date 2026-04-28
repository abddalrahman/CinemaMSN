import pool from "@/db/connection/pool";

// get users and admins messages
export async function getMessages ( page, limit, messageFor, justChecked ) {
	try {
		const offset = (page - 1) * limit;
		if (messageFor === "users") {
			const messages = await pool.query(`SELECT * FROM users_messages WHERE m_checked = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;`, 
				[justChecked, limit, offset]
			);
			const count = await pool.query(`SELECT COUNT(*) AS total FROM users_messages WHERE m_checked = $1;`, [justChecked]);
			if (messages.rowCount === 0) return {data: [], dataLength: count.rows[0].total};
			return {data: messages.rows, dataLength: count.rows[0].total};
		} else if (messageFor === "admins") {
			const messages = await pool.query(`SELECT * FROM admins_messages WHERE m_checked = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;`, 
				[justChecked, limit, offset]
			);
			const count = await pool.query(`SELECT COUNT(*) AS total FROM admins_messages WHERE m_checked = $1;`, [justChecked]);
			if (messages.rowCount === 0) return {data: [], dataLength: count.rows[0].total};
			return {data: messages.rows, dataLength: count.rows[0].total};
		} else return 0;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// update users messages read state
export async function updateMessages ( mID ) {
	try {
		const updatedMessages = await pool.query(`UPDATE users_messages SET m_checked = NOT m_checked WHERE m_id = $1 RETURNING created_at;`, [mID]);
		if (updatedMessages.rowCount === 0) return null;
		return updatedMessages.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// send admin messages
export async function addAdminMessage ( admin, uID, title, body, replyM ) {
	try {
		const addMessage = await pool.query(`INSERT INTO admins_messages (sender_id, resever_id, title, body, reply_to_id) VALUES ($1, $2, $3, $4, $5) 
			RETURNING created_at`, [admin, uID, title, body, replyM]
		);
		if (addMessage.rowCount === 0) return 0;
		return addMessage.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// check if user messages exist
export async function checkUserMessageExist ( mId, uID ) {
	try {
		const messageExist = await pool.query(`SELECT * FROM users_messages WHERE m_id = $1 AND user_id = $2;`, 
			[mId, uID]
		);
		if (messageExist.rowCount === 0) return 0;
		return messageExist.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// delete admin messages
export async function deleteMessage ( mID ) {
	try {
		const deletedMessage = await pool.query(`Delete FROM admins_messages WHERE m_id = $1 RETURNING created_at;`, [mID]);
		if (deletedMessage.rowCount === 0) return null;
		return deletedMessage.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}