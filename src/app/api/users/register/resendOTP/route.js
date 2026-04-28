import { checkUserState } from "@/db/CRUDquery/users/activityCRUD";
import { getMainUserDate } from "@/db/CRUDquery/users/otherCRUD";
import { checkOTP, deleteOTP } from "@/db/CRUDquery/users/registerAndLogin";
import sendEmailFunc from "@/utils/sendEmail";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { NextResponse } from "next/server";


/**
 * @method POST
 * @route ~/api/users/register/resendOTP
 * @desc resend OTP Code
 * @access private Only the registered user, whose account is inactive, and whose last OTP code was sent 3 minutes ago. 
 * */ 
export async function POST (req) {
	try {
		const userData = verifyTokenFunc(req);
		if (userData === null || !userData?.id) return NextResponse.json({message: "not data in token"}, {status: 400});
		const userStatus = await checkUserState(userData.id);
		if (userStatus === 0 || userStatus === false) return NextResponse.json({message: "something is Wrong"}, {status: 400});
		if (userStatus !== "nactive") {
			return NextResponse.json({message: `${userStatus === "banned" ? "your account is banned" : "your account is already active"}`}, {status: 400});
		}
		const newCodeExist = await checkOTP(userData.id, true);
		if (newCodeExist !== null && newCodeExist !== "error"){
			return NextResponse.json({message: "You must wait 3 minutes after the last verification code you requested."}, {status: 429});
		}
	
		await deleteOTP(userData.id);
		const allUserData = await getMainUserDate(userData.id);
		if (allUserData !== 0) {
			const userEmail = allUserData.email;
			const sendingEmail = await	sendEmailFunc({userId: userData.id, email: userEmail, subject: 'Email verification', codeLength: 6});
			if (sendingEmail === "201") {
				return NextResponse.json( {message: "Check Your Email. OTP code sent Successfuly"}, {status: 200} );
			} else {
				return NextResponse.json( {message: "Something Went Wrong Try Again"}, {status: 500} );
			}
		} else {
			return NextResponse.json( {message: "Something Went Wrong Try Again"}, {status: 500} );
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "Something Went Wrong Try Again"}, {status: 500} );
	}

}