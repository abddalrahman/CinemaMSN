import { addResetPassToken, checkNotExpiredResPassExist, deleteResetPassToken } from "@/db/CRUDquery/users/otherCRUD";
import { checkIfUserExist } from "@/db/CRUDquery/users/registerAndLogin";
import { checkEmail } from "@/utils/zodValidations";
import { NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import sendResetPasswordEmail from "@/utils/resetPasswordEmail";

/**
 * @method POST
 * @route ~/api/users/sensitive/forgotPass
 * @desc send link to user email to reset password
 * @access private Only users have account. 
 * */
export async function POST ( req ) {
	try {
		const body = await req.json();
		const validation = checkEmail.safeParse(body);
		if (!validation.success) return NextResponse.json( {message: "Email is Not Currect"}, {status: 400} );
		const userEmail = body.email
		const isAccountExist = await checkIfUserExist(userEmail);
		if (isAccountExist === 0) return NextResponse.json( {message: "This Email is Not Exist"}, {status: 400} );

		const checkActiveResPassExist = await checkNotExpiredResPassExist(userEmail);
		if (checkActiveResPassExist === 0) NextResponse.json( {message: "internal server error"}, {status: 500} );
		if (checkActiveResPassExist !== 0 && checkActiveResPassExist !== null) return NextResponse.json( {message: "Check Your Email To Reset Password"}, 
			{status: 200} 
		);

		const tokenId = crypto.randomBytes(32).toString("hex");
		await deleteResetPassToken(userEmail);
		const addToDB = await addResetPassToken(userEmail, tokenId);
		if (addToDB === 0) NextResponse.json( {message: "internal server error"}, {status: 500} );
		const resetID = addToDB.reset_id;
		const jwtData = {
			email: userEmail,
			token_id: tokenId,
			reset_id: resetID
		}
		const token = jwt.sign(jwtData, process.env.JWT_SECRET, {expiresIn: "5m"}); 
		const sendEmailResult = await sendResetPasswordEmail(userEmail, token);
		if (sendEmailResult !== 200) {
			const deleteResetPT = await deleteResetPassToken(userEmail);
			return NextResponse.json( {message: sendEmailResult}, {status: 500} );
		}
		return NextResponse.json( {message: "Check Your Email To Reset Password"}, {status: 200} );
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}