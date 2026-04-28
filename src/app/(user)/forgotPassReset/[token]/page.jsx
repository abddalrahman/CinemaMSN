import React from 'react'
import jwt from "jsonwebtoken";
import ShowToast from '@/app/componentes/global/smallComp/ShowToast';
import { checkResPassTokenData } from '@/db/CRUDquery/users/otherCRUD';
import ResetPassForm from '../ResetPassForm';

export const metadata = {
	title: 'Reset Password',
	description: 'Reset Password Page',
}

const ResetPassword = async ({ params }) => {
	const getParams = await params;
	const tokenVal = getParams.token;
	let decoded = {} 
	try {
		decoded = jwt.verify(tokenVal, process.env.JWT_SECRET);
	} catch (error) {
		console.log(error);
		return <ShowToast info={{messageText: "The link has expired. Please try again.", type: "error", changePath:"/login"}}/>
	}
	const {email, token_id , reset_id} = decoded
	if (!email || !token_id || !reset_id) {
		return <ShowToast info={{messageText: "The link has expired. Please try again.", type: "error", changePath:"/login"}}/>
	}
	
	let checkTokenData = null
	try {
		checkTokenData = await checkResPassTokenData(email, token_id, reset_id);
	} catch (error) {
		console.log(error)
		return <ShowToast info={{messageText: "internal server error.", type: "error"}}/>
	}
	if (checkTokenData === 0) return <ShowToast info={{messageText: "internal server error.", type: "error"}}/>
	if (checkTokenData === null) return <ShowToast info={{messageText: "The link has expired. Please try again.", type: "error", changePath:"/login"}}/>

	return (
		<div className='pt-120 reset-pass-page'>
			<div className="main-container">
				<ResetPassForm token={tokenVal}/>
			</div>
		</div>
	)
}

export default ResetPassword
