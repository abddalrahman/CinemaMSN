import { editUserByAdmin } from "@/db/CRUDquery/admin/usersCRUD";
import { checkIfUserIsAdmin } from "@/utils/recurringFunctions";
import { updateUserByAdmin } from "@/utils/zodValidations";
import { NextResponse } from "next/server";

/**
 * @method PUT
 * @route ~/api/admin/users/updateUser
 * @desc Update user role and status
 * @access private (only admin can acccess) 
 * */
export async function PUT (req) {
	try {
		const isUserAdmin = checkIfUserIsAdmin( req, true );
		if (isUserAdmin === null) {
			return NextResponse.json( {message: "only admin can access"}, {status: 403} );
		}
		
		const data = await req.json();
		const validation = updateUserByAdmin.safeParse(data);
		if (!validation.success) {
			return NextResponse.json( {message: validation.error.issues[0].message}, {status: 400} );
		}
		
		const updatedUser = await editUserByAdmin(data);
		if (updatedUser !== null && updatedUser !== 0) {
			return NextResponse.json( updatedUser, {status: 200} );
		} else if (updatedUser === 0){
			return NextResponse.json( {message: "this user is not exist"}, {status: 400} );
		} else {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}