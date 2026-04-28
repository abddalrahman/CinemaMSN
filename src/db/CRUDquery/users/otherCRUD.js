import pool from "@/db/connection/pool";
import { deleteFile } from "@/utils/recurringFunctions";

// get main User Data
export async function getMainUserDate ( userId ) {
	try {
		const user = await pool.query(`SELECT user_id, username, bio, email, profile_image_url, u_role, created_at, is_watchlist_private, is_watched_private,
			is_news_saved_private, is_favorite_people_private, is_ratings_private, u_status FROM users WHERE user_id = $1`, [userId]);
		if(user.rowCount === 0) return 0;
		return user.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0
	}
}

// check user privacy settings 
export async function checkUserPrivacySettings ( uID ) {
	try {
		const user = await pool.query(`SELECT is_watchlist_private, is_watched_private, is_news_saved_private, is_favorite_people_private, is_ratings_private 
			FROM users WHERE user_id = $1`, [uID]
		);
		if(user.rowCount === 0) return 0;
		return user.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0
	}
}

// get user watching list 
export async function getUserWatchingData ( uID ) {
	try {
		const WList = await pool.query(`SELECT * FROM watchlist WHERE user_id = $1`, [uID]);
		if(WList.rowCount === 0) return null;
		return WList.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// check user watching exist 
export async function checkUserWatchingExist ( uID, cID ) {
	try {
		const isExist = await pool.query(`SELECT * FROM watchlist WHERE user_id = $1 AND content_id = $2`, [uID, cID]);
		if(isExist.rowCount === 0) return null;
		return isExist.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get user favorite list 
export async function getUserFavoriteData ( uID ) {
	try {
		const FList = await pool.query(`SELECT * FROM favorite_people WHERE user_id = $1`, [uID]);
		if(FList.rowCount === 0) return null;
		return FList.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}
	
// check user favorite exist 
export async function checkUserFavoriteExist ( uID, pID ) {
	try {
		const isExist = await pool.query(`SELECT * FROM favorite_people WHERE user_id = $1 AND person_id = $2`, [uID, pID]);
		if(isExist.rowCount === 0) return null;
		return isExist.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// intersts----------

// get user interests list 
export async function getUserInterestsData ( uID ) {
	try {
		const GList = await pool.query(`SELECT * FROM user_genre_interests WHERE user_id = $1`, [uID]);
		if(GList.rowCount === 0) return null;
		return GList.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}
	
// check user interest exist 
export async function checkUserInterestsExist ( uID, gID ) {
	try {
		const isExist = await pool.query(`SELECT * FROM user_genre_interests WHERE user_id = $1 AND genre_id = $2`, [uID, gID]);
		if(isExist.rowCount === 0) return null;
		return isExist.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get user ratings list 
export async function getUserRatingsData ( uID, limit= null ) {
	try {
		const limitStr = limit ? `LIMIT ${limit}` : `OFFSET ${limit}`;
		const RList = await pool.query(`SELECT c.content_id, c.title, c.poster_url, r_user.score AS user_rating, COALESCE(r_avg.avg_rating, 0) 
			AS average_rating FROM content c JOIN ratings r_user ON r_user.content_id = c.content_id AND r_user.user_id = $1
			LEFT JOIN (SELECT content_id, AVG(score) AS avg_rating FROM ratings GROUP BY content_id) r_avg 
	    ON r_avg.content_id = c.content_id ORDER BY r_user.created_at DESC ${limitStr};`, [uID]
		);
		const countAll = await pool.query(`SELECT COUNT(*) AS count FROM ratings WHERE user_id = $1`, [uID]);
		if(RList.rowCount === 0) return {data: [], dataLength: 0};
		return {data: RList.rows, dataLength: countAll.rows[0].count};
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get user watchlist and watched 
export async function getUserContentWatchData ( uID, type, limit= null ) {
	try {
		const limitStr = limit ? `LIMIT ${limit}` : `OFFSET ${limit}`;
		const WList = await pool.query(`SELECT c.content_id, c.title, c.poster_url, w.wl_status, COALESCE(r_avg.avg_rating, 0) AS average_rating
			FROM content c JOIN watchlist w ON w.content_id = c.content_id AND w.user_id = $1 LEFT JOIN (SELECT content_id, AVG(score) AS avg_rating FROM 
			ratings GROUP BY content_id) r_avg ON r_avg.content_id = c.content_id WHERE w.wl_status = $2 ORDER BY w.created_at DESC ${limitStr};`, [uID, type]
		);
		const countALl = await pool.query(`SELECT COUNT(*) AS count FROM watchlist WHERE user_id = $1 AND wl_status = $2`, [uID, type]);
		if(WList.rowCount === 0) return {data: [], dataLength: 0};
		return {data: WList.rows, dataLength: countALl.rows[0].count};
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// following -------------
export async function getUserFollowingData ( uID ) {
	try {
		const followingData = await pool.query(`SELECT * FROM following WHERE follower_id = $1 OR followed_id = $1;`, [uID]);
		if (followingData.rowCount === 0) return null;
		return followingData.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// check followin exist 
export async function checkFollowingExist ( uID, visitorID ) {
	try {
		const FollowingExist = await pool.query(`SELECT * FROM following WHERE follower_id = $1 AND followed_id = $2;`, [visitorID, uID]);
		if (FollowingExist.rowCount === 0) return null;
		return FollowingExist.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// add to followin
export async function addToFollowingData ( follower, followed ) {
	try {
		const addedF = await pool.query(`INSERT INTO following (follower_id, followed_id) VALUES ($1, $2) RETURNING created_at;`, [follower, followed]);
		if(addedF.rowCount === 0) return 0;
		return addedF.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// delete from followin 
export async function deleteFromFollowing ( follower, followed ) {
	try {
		const deletedF = await pool.query(`DELETE FROM following WHERE follower_id = $1 AND followed_id = $2 RETURNING created_at;`, [follower, followed]);
		if(deletedF.rowCount === 0) return 0;
		return deletedF.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get all user data "sensitive"
export async function getAllUserData(uID) {
	try {
		const data = await pool.query(`SELECT * FROM users WHERE user_id = $1;`, [uID]);
		if (data.rowCount === 0) return 0;
		return data.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// update user data "sensitive"
export async function updateUserData ( email, data ) {
	try {
		const keys = Object.keys(data); 
		const values = Object.values(data); 
		let setClause = keys.map((key, index) => `${key}=$${index + 1}`).join(", ");
		setClause += `, updated_at = NOW()`;
		values.push(email); 
		const query = `UPDATE users SET ${setClause} WHERE email=$${keys.length + 1} RETURNING *`; 
		const updatedUser = await pool.query(query, values);
		if (updatedUser.rowCount === 0) return 0;
		return updatedUser.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// delete user account "sensitive"
export async function deleteUserAccount ( uID ) {
	try {
		const deletedUser = await pool.query(`DELETE FROM users WHERE user_id = $1 RETURNING *;`, [uID]);
		if (deletedUser.rowCount === 0) return 0;
		const userData = deletedUser.rows[0];
    if (userData.profile_image_url && userData.profile_image_url.replace("No Data", "").trim() !== "") {
      await deleteFile(userData.profile_image_url);
    }
    return userData;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// check if there is not expired reset password
export async function checkNotExpiredResPassExist(email) {
	try {
		const checkResult = await pool.query(`SELECT * FROM password_resets WHERE email = $1 AND expires_at > NOW()`, [email]);
		if (checkResult.rowCount === 0) return null;
		return checkResult.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// check token Data if Currect
export async function checkResPassTokenData(email, tID, resID) {
	try {
		const checkResult = await pool.query(`SELECT * FROM password_resets WHERE email = $1 AND expires_at > NOW() AND token_id = $2 AND reset_id = $3 
			AND used = FALSE`, [email, tID, resID]);
		if (checkResult.rowCount === 0) return null;
		return checkResult.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// add reset password token to DB
export async function addResetPassToken (email, tID) {
	try {
		const addedToken = await pool.query(`INSERT INTO password_resets (email, token_id) VALUES ($1, $2) RETURNING reset_id`, [email, tID]);
		if (addedToken === 0) return 0;
		return addedToken.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// delete reset password token
export async function deleteResetPassToken (email) {
	try {
		const deletedTokens = await pool.query(`DELETE FROM password_resets WHERE email = $1`, [email]);
		if (deletedTokens === 0) return null;
		return deletedTokens.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// update reset password token
export async function updateResPassTokenData (email, tID, resID) {
	try {
		const updatedTokens = await pool.query(`UPDATE password_resets SET used = TRUE WHERE email = $1 AND token_id = $2 AND reset_id = $3`, 
			[email, tID, resID]
		);
		if (updatedTokens === 0) return null;
		return updatedTokens.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}