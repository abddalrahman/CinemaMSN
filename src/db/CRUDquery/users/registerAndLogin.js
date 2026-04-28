import pool from "../../connection/pool.js";

// -- register

// check if user exist
export async function checkIfUserExist ( userEmail ) {
	try {
		const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [userEmail]);
		if(user.rowCount === 0) return 0
		return user.rows[0]
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// add new user [create account]
export async function createNewAccount ( data ) {
	try {
		const userdata = await pool.query(`INSERT INTO users (username, email, password_hash) 
			VALUES ($1, $2, $3) RETURNING user_id, username, u_role`, [data.username, data.email, data.password]
		);
		if(userdata.rowCount === 0){
			return false
		}else {return userdata.rows[0]}
		
	} catch (error) {
		console.log(error)
		return false
	}
}

// update user status [active account]
export async function activeUserAccount ( userId ) {
	try {
		const userUpdated = await pool.query(`UPDATE users SET u_status = 'active' WHERE user_id = $1`, [userId]);
		if(userUpdated.rowCount === 0) {
			return null
		}else { return 'updated' }

	} catch (error) {
		console.log(error)
		return null
	}
}


// -- OTP

// add otp code
export async function addOTP ( id, code ) {
  try {
		const otpId = await pool.query(`INSERT INTO OTP_CODE (user_id, otp_code) 
			VALUES ($1, $2) RETURNING otp_id`, [id, code]
		);
		return otpId.rows[0].otp_id

	} catch(error) {
		console.log(error)
		return "error happend";
	}
}

// check otp code 
export async function checkOTP(userId, isItNew = null) {
	try {
		const otpCode = await pool.query(`SELECT otp_id, otp_code FROM OTP_CODE WHERE user_id = $1 AND expired_at > NOW() ${isItNew !== null ? 
			"AND created_at >= NOW() - INTERVAL '3 minutes'" : ''}`, [userId]
		);
		if (otpCode.rowCount == 0) return null;
		return otpCode.rows[0]

	} catch(error) {
		console.log(error);
		return "error"
	}
}

// delete otp code 
export async function deleteOTP(userId) {
	try {
		const otpCodeId = await pool.query(`DELETE FROM OTP_CODE WHERE user_id = $1`, [userId]);
	} catch(error) {
		console.log(error)
	}
}