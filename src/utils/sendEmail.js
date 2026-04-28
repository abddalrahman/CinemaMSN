import nodemailer from "nodemailer";
import FuncCreateOTP from "./createOTP";
import { addOTP } from "@/db/CRUDquery/users/registerAndLogin";

const sendEmailFunc = async (userRegisterData) => {
	const {userId, email, subject, codeLength} = userRegisterData
	
	try {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.USER_EMAIL,
				pass: process.env.USER_PASS,
			},
		});
	
		const otpConde = FuncCreateOTP(codeLength);
		
		const otpId =	addOTP(userId, otpConde);
	
		if(otpId !== "error happend") {
			await transporter.sendMail({
				from: process.env.USER_EMAIL,
				to: email,
				subject: subject,
				html:`
					<div style="padding: 10px;">
						<h2 style="font-size: 28px; margin-bottom: 10px; color: #94a3b8;">${otpConde}</h2>
						<span style="color: #94a3b8; font-size: 24px">This is your verification code</span>
						<p style="color: #64676d; margin-top: 10px;">
							<b style="color: #f71616">Note: </b> It is for single use only and expires in 3 minutes.
						</p>
					</div>
				`
			});
		}else {
			return "000"
		}

		return "201"

	} catch(error) {
		console.log(error)
		return "error"
	}
	
}

export default sendEmailFunc;