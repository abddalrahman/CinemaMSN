import { checkIfUserExist, createNewAccount } from "@/db/CRUDquery/users/registerAndLogin";
import { SetTokenCookie } from "@/utils/generateToken";
import sendEmailFunc from "@/utils/sendEmail";
import { registerUserValidation } from "@/utils/zodValidations";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";



/**
 * @method POST
 * @route ~/api/users/register
 * @desc create user account
 * @access public 
 * */ 
export async function POST ( req ) {
	
	try {
		const body = await req.json();
		const validation = registerUserValidation.safeParse(body);
		if(!validation.success) {
			return NextResponse.json({ message: validation.error.issues[0].message }, { status: 400 })
		}
	
		const isUserExist = await checkIfUserExist(body.email);
		if(isUserExist !== 0) {
			return NextResponse.json( {message: "this account is already exist"}, {status: 400});
		}
	
		const salt = await bcrypt.genSalt(10);
		const hashedPass = await bcrypt.hash(body.password, salt);
	
		const data = {
			username: body.username,
			email: body.email,
			password: hashedPass
		}
		const newUser = await createNewAccount(data)
		if(!newUser) return NextResponse.json({message: 'internal server error'}, {status: 500});
	
		const jwtData = {
			id: newUser.user_id,
			username: newUser.username,
			isAdmin: newUser.u_role
		}
		
		const cookie = SetTokenCookie(jwtData);
	
		const sendingEmail = await	sendEmailFunc({userId: newUser.user_id, email: body.email, subject: 'Email verification', codeLength: 6});
		if (sendingEmail === "201") {
			return NextResponse.json(
				{message: "Check Your Email and Enter OTP Code to Activate Your Account. The code expires in 3 minutes", otpSended: true},
				{status: 201, headers: { "Set-Cookie": cookie }
			});
		} else {
			return NextResponse.json(
				{ 
					message: "Regestered Successfuly. Requist OTP code to activate your account",
					otpSended: false,
					id: newUser.user_id
				},
				{status: 201, headers: { "Set-Cookie": cookie }
			});
		}

		
	} catch(error) {
		console.log(error);
		return NextResponse.json({ message: 'internal server error'}, {status: 500});
	}
	
}