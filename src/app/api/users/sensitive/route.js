import { checkUserState } from "@/db/CRUDquery/users/activityCRUD";
import { checkResPassTokenData, deleteUserAccount, getAllUserData, updateResPassTokenData, updateUserData } from "@/db/CRUDquery/users/otherCRUD";
import { checkIfUserExist } from "@/db/CRUDquery/users/registerAndLogin";
import { addFileFunc, deleteFile, filterObject } from "@/utils/recurringFunctions";
import { verifyTokenFunc } from "@/utils/verifyToken";
import { updateUserValidation } from "@/utils/zodValidations";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";

/**
 * @method GET
 * @route ~/api/users/sensitive
 * @desc get all user data
 * @access private Only (loged in and active) users himself can access. 
 * */
export async function GET ( req ) {
	try {
		const userInfo = verifyTokenFunc(req);
		if (userInfo === null) return NextResponse.json( {message: "Login to accesss"}, {status: 401} );
		const isActive = await checkUserState(userInfo.id);
		if (isActive === false) return NextResponse.json( {message: "This User is not Exist"}, {status: 400} );
		if (isActive !== "active") return NextResponse.json( {message: "your account is not active"}, {status: 400} );
		
		const allUserData = await getAllUserData(userInfo.id);
		if (allUserData === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		return NextResponse.json( allUserData, {status: 200} );
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}

/**
 * @method PUT
 * @route ~/api/users/sensitive
 * @desc update user data
 * @access private Only (loged in and active) users himself can access. 
 * */
export async function PUT ( req ) {
	try {
		let tokenData = {
			email: "",
			token_id: "",
			reset_id: ""
		}
		
		const { searchParams } = new URL(req.url);
		const isTokenExist = searchParams.get("useToken") || null;
		let body = null
		if (isTokenExist === null) {
			const userInfo = verifyTokenFunc(req);
			if (userInfo === null) return NextResponse.json( {message: "Login to accesss"}, {status: 401} );
			body = await req.formData();
		} else {
			const decoded = jwt.verify(isTokenExist, process.env.JWT_SECRET);
			const {email, token_id , reset_id} = decoded
			if (!email || !token_id || !reset_id) return NextResponse.json( {message: "Not Allow To Access"}, {status: 401} );
			const checkTokenData = await checkResPassTokenData(email, token_id, reset_id);
			if (checkTokenData === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			if (checkTokenData === null) return NextResponse.json( {message: "The link has expired. Please try again."}, {status: 500} );
			tokenData = {
				email: email,
				token_id: token_id,
				reset_id: reset_id
			}
			const data = await req.json();
			body = {
				password_hash: data.password_hash || undefined,
				email: checkTokenData.email || undefined
			}
		}
		const objData = isTokenExist === null ? {
			username: body.get("username") ? body.get("username") : undefined,
			bio: body.get("bio") ? body.get("bio") : undefined,
			password_hash: body.get("password_hash") ? body.get("password_hash") : undefined,
			profile_image_url: body.get("profile_image_url") ? body.get("profile_image_url") : undefined,
			is_watchlist_private: body.get("is_watchlist_private") ? body.get("is_watchlist_private") === "true" : undefined,
			is_watched_private: body.get("is_watched_private") ? body.get("is_watched_private") === "true" : undefined,
			is_news_saved_private: body.get("is_news_saved_private") ? body.get("is_news_saved_private") === "true" : undefined,
			is_favorite_people_private: body.get("is_favorite_people_private") ? body.get("is_favorite_people_private") === "true" : undefined,
			is_ratings_private: body.get("is_ratings_private") ? body.get("is_ratings_private") === "true" : undefined,
			email: body.get("email") ? body.get("email") : undefined
		} : {
			password_hash: body.password_hash ? body.password_hash : undefined,
			email: body.email ? body.email : undefined 
		}
		const userData = await checkIfUserExist(objData.email);
		if (userData === 0) return NextResponse.json( {message: "This User is not Exist"}, {status: 400} );
		if (userData?.u_status !== "active" && isTokenExist === null) return NextResponse.json( {message: "your account is not active"}, {status: 400} );
		
		const filteredObj = filterObject(objData, [""]);
		const validation = updateUserValidation.safeParse(filteredObj);
		if (!validation.success) return NextResponse.json( {message: validation.error.issues[0].message}, {status: 400} );
		if (Object.keys(filteredObj).length < 2) return NextResponse.json( {message: "No Acceptable Changes"}, {status: 400} );

		if (filteredObj.profile_image_url && filteredObj.profile_image_url !== "") {
			const imageUrl = await addFileFunc(filteredObj.profile_image_url, 'm');
			if (imageUrl === "000") {
				throw new Error("upload failed");
			}else if (imageUrl === "111") {
				return NextResponse.json({ message: "image type must be one of this ['.png', '.jpg', '.web', '.jpeg']" }, {status: 400});
			}else if (imageUrl === "222") {
				return NextResponse.json({ message: "image name is too long" }, {status: 400});
			}else {
				filteredObj.profile_image_url= imageUrl;
				if (userData.profile_image_url && userData.profile_image_url.replace("No Data", "") !== "")
				await deleteFile(userData.profile_image_url);
			}
		}
		if (filteredObj.password_hash) {
			const salt = await bcrypt.genSalt(10);
			const hashedPass = await bcrypt.hash(filteredObj.password_hash, salt);
			filteredObj.password_hash = hashedPass;
		}
		const {email, ...data} = filteredObj;
		const updateUserInfo = await updateUserData(email, data);
		if (updateUserInfo === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
		if (isTokenExist !== null) {
			await updateResPassTokenData(tokenData.email, tokenData.token_id, tokenData.reset_id);
		}
		return NextResponse.json( {message: "Updated Successfuly"}, {status: 200} );

	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error or time expired"}, {status: 500} );
	}
}

/**
 * @method DELETE
 * @route ~/api/users/sensitive
 * @desc delete user account
 * @access private Only (loged) user himself can access. 
 * */
export async function DELETE ( req ) {
	try {
		const userInfo = verifyTokenFunc(req);
		if (userInfo === null) return NextResponse.json( {message: "Login to accesss"}, {status: 401} );
		const body = await req.json();
		const userID = Number(body.id) || null;
		if (userID === null || !Number.isInteger(userID)) return NextResponse.json( {message: "Missing Data"}, {status: 401} );
		if (userID === Number(userInfo.id)){
			const deletedUser = await deleteUserAccount(userInfo.id);
			if (deletedUser === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );
			const response = NextResponse.json( {message: "Deleted Successfully"}, {status: 200} );
			response.cookies.delete('jwtToken');
			return response;
		}
		return NextResponse.json( {message: "Error"}, {status: 401} );
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}