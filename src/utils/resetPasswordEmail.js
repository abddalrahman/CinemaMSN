import nodemailer from "nodemailer";
import { DomainPath } from "./DomainPath";

const sendResetPasswordEmail = async (email, token) => {
	try {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.USER_EMAIL,
				pass: process.env.USER_PASS,
			},
		});

		const info = await transporter.sendMail({
			from: process.env.USER_EMAIL,
			to: email,
			subject: "Reset Password",
			html:`
				<div style="padding: 10px;">
					<h2 style="font-size: 28px; margin-bottom: 10px; color: #f71616;">Reset PassWord</h2>
					<p style="color: #ffffff; font-size: 24px">This Link Will Take You to Reset Password Page</p>
					<a href="${DomainPath}/forgotPassReset/${token}" style="margin-block: 10px; color: #ffffff; background-color: #f71616; padding: 6px 14px; display: inline-block;">
						Reset Your Password
					</a>
					<p style="color: #64676d; margin-top: 10px;">
						<b style="color: #d6b629">Note: </b> It is for single use only and expires in 5 minutes.
					</p>
				</div>
			`
		});
		if (info.accepted.length === 0) {
			throw new Error("Failed To send Email")
		} else {
			return 200
		}

	} catch(error) {
		console.log(error)
		return error.message
	}
}

export default sendResetPasswordEmail;