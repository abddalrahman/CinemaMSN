import pool from "@/db/connection/pool";

// update user
export async function editUserByAdmin ( data ) {
	try {
		const {user_id, ...otherData} = data;
		const keys = Object.keys(otherData); 
		const values = Object.values(otherData); 
		let setClause = keys.map((key, index) => `${key}=$${index + 1}`).join(", ");
		setClause += `, updated_at = NOW()`;
		values.push(user_id); 
		const query = `UPDATE users SET ${setClause} WHERE user_id=$${keys.length + 1} RETURNING user_id`; 
		const updatedUser = await pool.query(query, values);
		if (updatedUser.rowCount === 0) return null;
		return updatedUser.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}