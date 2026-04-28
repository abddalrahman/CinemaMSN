import { activeUserAccount, checkOTP, deleteOTP } from "@/db/CRUDquery/users/registerAndLogin";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { codeOTPValidation } from "@/utils/zodValidations";
import { NextResponse } from "next/server";


/**
 * @method POST
 * @route ~/api/users/register/verifyOTP
 * @desc verify OTP to active user account
 * @access private  [only owner user (and its account not active)]
 */

export async function POST (req) {
	const userInfo = verifyTokenFunc(req);
	if(userInfo === null || !userInfo.id) return NextResponse.json({message: "no token provided access denide"}, {status:401});
	
	const body = await req.json();

	const validationCode = codeOTPValidation.safeParse(body);
	if(!validationCode.success){
		return NextResponse.json({message: validationCode.error.issues[0].message}, {status: 400});
	}

	const otpCodeInfo = await checkOTP(userInfo.id);
	if(otpCodeInfo === "error") return NextResponse.json({message: "internal server error"}, {status: 500});
	if(otpCodeInfo === null) return NextResponse.json({message: "No valid OTP code. Please request a new code."}, {status: 404});

	if(otpCodeInfo.otp_code !== body.sendingCode) return NextResponse.json({message: "The code you entered is incorrect"}, {status: 400});

	// delete otp code from database
	await deleteOTP(userInfo.id);

	// active user account
	const updateUserStatus = await activeUserAccount(userInfo.id);
	if(updateUserStatus === 'updated') {
		return  NextResponse.json({message: "your Account Activated Successfuly"}, {status: 200});
	}else{
		return  NextResponse.json({message: "internal server error"}, {status: 500});
	}
}