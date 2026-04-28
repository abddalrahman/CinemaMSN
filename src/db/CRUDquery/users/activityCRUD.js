import pool from "@/db/connection/pool";

// check if user active
export async function checkUserState (userID) {
	try {
		const userState = await pool.query(`SELECT u_status FROM users WHERE user_id = $1`, [userID]);
		if (userState.rowCount === 0) return false;
		return userState.rows[0].u_status;
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// rating -----

// check if rating already exist
export async function checkRatingIfExist (contentID, userID) {
	try {
		const userState = await pool.query(`SELECT score FROM ratings WHERE content_id = $1 AND user_id = $2`, [contentID, userID]);
		if (userState.rowCount === 0) return false;
		return userState.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// add rating
export async function addRating (contentID, userID, score) {
	try {
		const addingRating = await pool.query(`INSERT INTO ratings (content_id, user_id, score) VALUES ($1, $2, $3) RETURNING created_at`,
			[contentID, userID, score]
		);
		if (addingRating.rowCount === 0) return 0;
		return addingRating.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0;
	}
	
}

// edit rating
export async function editRating (contentID, userID, score) {
	try {
		const updatedRating = await pool.query(`UPDATE ratings SET score = $1, updated_at = NOW() WHERE content_id = $2 AND user_id = $3 RETURNING created_at`, 
			[score, contentID, userID])
		if (updatedRating.rowCount === 0) return 0;
		return updatedRating.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0;
	}
	
}

// delete rating
export async function deleteRating (contentID, userID) {
	try {
		const deletedRating = await pool.query(`DELETE FROM ratings WHERE content_id = $1 AND user_id = $2 RETURNING score`, [contentID, userID])
		if (deletedRating.rowCount === 0) return null;
		return deletedRating.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0;
	}
	
}


// commenting -----

// check if comment already exist
export async function checkCommentIfExist (userID, contentID) {
	try {
		const comment = await pool.query(`SELECT * FROM comments WHERE user_id = $1 
			AND content_id = $2`, [userID, contentID]
		);
		if (comment.rowCount === 0) return null;
		return comment.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// add comment
export async function addComment (userID, contentID, title, body, is_spoiler_by_author) {
	try {
		const addingcomment = await pool.query(`INSERT INTO comments (user_id, content_id, title, body, is_spoiler_by_author) 
			VALUES ($1, $2, $3, $4, $5) RETURNING created_at`, [userID, contentID, title, body, is_spoiler_by_author]
		);
		if (addingcomment.rowCount === 0) return 0;
		return addingcomment.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0;
	}
	
}

// update comment
export async function updateComment ( uid, cid, data ) {
	try {
		const keys = Object.keys(data); 
		const values = Object.values(data); 
		let setClause = keys.map((key, index) => `${key}=$${index + 1}`).join(", ");
		setClause += `, updated_at = NOW()`;
		values.push(uid, cid); 
		const query = `UPDATE comments SET ${setClause} WHERE user_id=$${keys.length + 1} AND content_id=$${keys.length + 2} RETURNING *`; 
		const updatedCotent = await pool.query(query, values);
		if (updatedCotent.rowCount === 0) return 0;
		return updatedCotent.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// delete comment
export async function deleteCommentFunc ( uid, cid, isAdmin= false ) {
	try {
		let deletedComment = null;
		deletedComment = !isAdmin ? await pool.query(`DELETE FROM comments WHERE user_id = $1 AND comment_id = $2 RETURNING *`, [uid, cid]) :
			await pool.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [cid]);
		if (deletedComment.rowCount === 0) return null;
		return deletedComment.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get active with comments
export async function getActiveWithCommentData (uId, cId) {
	try {
		if (cId === "all") {
			const acticeData = await pool.query(`SELECT * FROM active_with_comments WHERE user_id = $1`, [uId]);
			if (acticeData.rowCount === 0) return null;
			return acticeData.rows;
		}
		const acticeData = await pool.query(`SELECT * FROM active_with_comments WHERE user_id = $1 AND content_id = $2`, [uId, cId]);
		if (acticeData.rowCount === 0) return null;
		return acticeData.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// check if an active with comment exist
export async function checkActiveWithComment (uId, cId, active) {
	try {
		const activeData = await pool.query(`SELECT * FROM active_with_comments WHERE user_id = $1 AND comment_id = $2 AND active = $3`, 
			[uId, cId, active]
		);
		if (activeData.rowCount === 0) return null;
		return activeData.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// add active with comment
export async function addActiveWithComment (uId, comId, conID, active, commentWriter) {
	const longConnection = await pool.connect();
	try {
		await longConnection.query('BEGIN');
		const addedActive = await longConnection.query(`INSERT INTO active_with_comments (user_id, comment_id, content_id, active) VALUES ($1, $2, $3, $4) 
			RETURNING created_at`, [uId, comId, conID, active]
		);
		if (addedActive.rowCount === 0) throw new Error('Failed to add active with comment');
		const activeCol = active === 'like' ? "likes_count" : active === 'spoiler' ? "spoiler_reports_count" : "abuse_reports_count";
		const updateCommentData = await longConnection.query(`UPDATE comments SET ${activeCol} = ${activeCol} + 1 WHERE user_id = $1 
			AND content_id = $2`, [commentWriter, conID]
		);
		if (updateCommentData.rowCount === 0) throw new Error('Failed to update comment');
		await longConnection.query('COMMIT');

		return addedActive.rows[0];
	} catch (error) {
		await longConnection.query('ROLLBACK');
		console.log(error);
		return 0;
	} finally {
		longConnection.release();
	}
}

// delete active with comment
export async function deleteActiveWithComment (uId, comId, conID, active, commentWriter) {
	const longConnection = await pool.connect();
	try {
		await longConnection.query('BEGIN');
		const deletedActive = await longConnection.query(`DELETE FROM active_with_comments WHERE user_id = $1 AND comment_id = $2 AND active = $3 
			RETURNING created_at`, [uId, comId, active]
		);
		if (deletedActive.rowCount === 0) throw new Error('Failed to add active with comment');

		const activeCol = active === 'like' ? "likes_count" : active === 'spoiler' ? "spoiler_reports_count" : "abuse_reports_count";
		const updateCommentData = await longConnection.query(`UPDATE comments SET ${activeCol} = ${activeCol} - 1 WHERE user_id = $1 
			AND content_id = $2`, [commentWriter, conID]
		);
		if (updateCommentData.rowCount === 0) throw new Error('Failed to update comment');
		await longConnection.query('COMMIT');
		
		return deletedActive.rows[0];
	} catch (error) {
		await longConnection.query('ROLLBACK');
		console.log(error);
		return 0;
	} finally {
		longConnection.release();
	}
}

// add to watch table
export async function addToWatchTable (uId, cId, status) {
	try {
		const addWatch = await pool.query(`INSERT INTO watchlist (user_id, content_id, wl_status) VALUES ($1, $2, $3) RETURNING created_at`, [uId, cId, status]);
		if (addWatch.rowCount === 0) return 0;
		return addWatch.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// delete from watch table
export async function deleteFromWatch (uId, cId) {
	try {
		const deletedWatch = await pool.query(`DELETE FROM watchlist WHERE user_id = $1 AND content_id = $2 RETURNING created_at`, [uId, cId]);
		if (deletedWatch.rowCount === 0) return null;
		return deletedWatch.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// update watch status
export async function updateWatchStatus (uId, cId, status) {
	try {
		const updateWatch = await pool.query(`UPDATE watchlist SET wl_status = $1 WHERE user_id = $2 AND content_id = $3 RETURNING created_at`, 
			[status, uId, cId]
		);
		if (updateWatch.rowCount === 0) return null;
		return updateWatch.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// add to favorite table
export async function addToFavoriteTable (uId, pId) {
	const longConnection = await pool.connect();
	try {
		await longConnection.query('BEGIN');
		const addFavorite = await longConnection.query(`INSERT INTO favorite_people (user_id, person_id) VALUES ($1, $2) RETURNING created_at`, [uId, pId]);
		if (addFavorite.rowCount === 0) throw new Error('Failed to add to favorite');
		const updatePersonPopularity = await longConnection.query(`UPDATE people SET popularity = popularity + 1 WHERE person_id = $1`, [pId]);
		if (updatePersonPopularity.rowCount === 0) throw new Error('Failed to update popularity');
		await longConnection.query('COMMIT');
		return addFavorite.rows[0];
	} catch (error) {
		await longConnection.query('ROLLBACK');
		console.log(error);
		return 0;
	} finally {
		longConnection.release();
	}
}

// delete from favorite table
export async function deleteFromFavorite (uId, pId) {
	const longConnection = await pool.connect();
	try {
		await longConnection.query('BEGIN');
		const deletedFavorite = await longConnection.query(`DELETE FROM favorite_people WHERE user_id = $1 AND person_id = $2 RETURNING created_at`, 
			[uId, pId]
		);
		if (deletedFavorite.rowCount === 0) throw new Error('Failed to remove from favorite');
		const updatePersonPopularity = await longConnection.query(`UPDATE people SET popularity = popularity - 1 WHERE person_id = $1`, [pId]);
		if (updatePersonPopularity.rowCount === 0) throw new Error('Failed to update popularity');
		await longConnection.query('COMMIT');
		return deletedFavorite.rows[0];
	} catch (error) {
		await longConnection.query('ROLLBACK');
		console.log(error);
		return 0;
	} finally {
		longConnection.release();
	}
}

// add to interrests table
export async function addToInterestTable (uId, gId) {
	try {
		const addInterest = await pool.query(`INSERT INTO user_genre_interests (user_id, genre_id) VALUES ($1, $2) RETURNING created_at`, [uId, gId]);
		if (addInterest.rowCount === 0) return 0;
		return addInterest.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// delete from interrests table
export async function deleteFromInterest (uId, gId) {
	try {
		const deletedInterest = await pool.query(`DELETE FROM user_genre_interests WHERE user_id = $1 AND genre_id = $2 RETURNING created_at`, [uId, gId]);
		if (deletedInterest.rowCount === 0) return null;
		return deletedInterest.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// news ------

// get saved news
export async function getUserNewsSaves (uId, justSavedIDs= false) {
	try {
		if (justSavedIDs) {
			const savedNewsIds = await pool.query(`SELECT news_id FROM saved_news WHERE user_id = $1;`, [uId]);
			if (savedNewsIds.rowCount === 0) return null;
			const newsIDs = savedNewsIds.rows.map(row => Number(row.news_id));
			return newsIDs;
		}
		const savedNews = await pool.query(`SELECT n.* FROM saved_news sn JOIN news n ON sn.news_id = n.news_id WHERE sn.user_id = $1;`, [uId]);
		if (savedNews.rowCount === 0) return null;
		return savedNews.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// check news saved exist 
export async function checkUserNewsExist (uId, nId) {
	try {
		const savedNews = await pool.query(`SELECT * FROM saved_news WHERE user_id = $1 AND news_id = $2;`, [uId, nId]);
		if (savedNews.rowCount === 0) return null;
		return savedNews.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// add to news saved
export async function addToNewsSaved (uId, nId) {
	try {
		const addNews = await pool.query(`INSERT INTO saved_news (news_id, user_id) VALUES ($1, $2) RETURNING saved_at`, [nId, uId]);
		if (addNews.rowCount === 0) return 0;
		return addNews.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// delete from news save
export async function deleteFromNewsSaved (uId, nId) {
	try {
		const deletedNews = await pool.query(`DELETE FROM saved_news WHERE news_id = $1 AND user_id = $2 RETURNING saved_at`, [nId, uId]);
		if (deletedNews.rowCount === 0) return null;
		return deletedNews.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// messages ----- 

// add user message
export async function addUserMessage (title, body, replyM, uID) {
	try {
		const addMessage = await pool.query(`INSERT INTO users_messages (user_id, title, body, reply_to_id) VALUES ($1, $2, $3, $4) RETURNING created_at`, 
			[uID, title, body, replyM]
		);
		if (addMessage.rowCount === 0) return 0;
		return addMessage.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}
// check if admin message exist and if its for this user
export async function checkAdminMessageExist (mID, uID) {
	try {
		const message = await pool.query(`SELECT * FROM admins_messages WHERE m_id = $1 AND resever_id = $2;`, [mID, uID]);
		if (message.rowCount === 0) return null;
		return message.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get all user messages (he sent it or sent to him)
export async function getAllUserMessaegs (uID) {
	try {
		const userMessages = await pool.query(`SELECT * FROM users_messages WHERE user_id = $1 ORDER BY created_at DESC;`, [uID]);
		const messagesToUser = await pool.query(`SELECT * FROM admins_messages WHERE resever_id = $1 ORDER BY created_at DESC;`, [uID]);
		const objToReturn = {
			yourMessages: userMessages.rowCount === 0 ? [] : userMessages.rows,
			messagesToYou: messagesToUser.rowCount === 0 ? [] : messagesToUser.rows
		};
		return objToReturn;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// update admin messages read state
export async function updateAdminMessages ( mID ) {
	try {
		const updatedMessages = await pool.query(`UPDATE admins_messages SET m_checked = TRUE WHERE m_id = $1 RETURNING created_at;`, [mID]);
		if (updatedMessages.rowCount === 0) return null;
		return updatedMessages.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// delete user messages 
export async function deleteUserMessages ( mID ) {
	try {
		const deletedMessages = await pool.query(`DELETE FROM users_messages WHERE m_id = $1 RETURNING created_at;`, [mID]);
		if (deletedMessages.rowCount === 0) return null;
		return deletedMessages.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}