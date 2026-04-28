import { checkIfUserExist } from "@/db/CRUDquery/users/registerAndLogin";
import { loginUserValidation } from "@/utils/zodValidations"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { SetTokenCookie } from "@/utils/generateToken";


/**
 * @method POST
 * @route ~/api/users/login
 * @desc login [add token]
 * @access public
 */


export async function POST (req) {

	try {
		const body = await req.json()
		const validationLogin = loginUserValidation.safeParse(body);
		if(!validationLogin.success) {
			return NextResponse.json({message: validationLogin.error.issues[0].message}, {status: 400});
		}
	
		const isUserExist = await checkIfUserExist(body.email);
		if(isUserExist === 0) return NextResponse.json({message:"invalid email or password"}, {status: 400})
	
		const isPasswordMatches = await bcrypt.compare(body.password, isUserExist.password_hash);
		if(!isPasswordMatches) return NextResponse.json({message: "invalid email or password"}, {status: 400});
	
		const jwtData = {
			id: isUserExist.user_id,
			username: isUserExist.username,
			isAdmin: isUserExist.u_role
		}
		
		const cookie = SetTokenCookie(jwtData);
		return NextResponse.json({ message: "Loged in successfuly" }, { status: 200, headers: {'Set-Cookie': cookie} });
	
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "internal server error" }, { status: 500 });
	}

}
