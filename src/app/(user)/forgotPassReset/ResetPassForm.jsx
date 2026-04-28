"use client"
import CoverL from '@/app/componentes/global/smallComp/CoverL'
import FormLableInp from '@/app/componentes/global/smallComp/FormLableInp'
import SectionTitle from '@/app/componentes/global/smallComp/SectionTitle'
import { fetchAPIFunc } from '@/utils/clientRandomFunc'
import { DomainPath } from '@/utils/DomainPath'
import { checkPass } from '@/utils/zodValidations'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const ResetPassForm = ({ token }) => {
	const [newPass, setNewPass] = useState({
		password_hash: ""
	});
	const router = useRouter();
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			setLoading(true);
			const validation = checkPass.safeParse({password: newPass.password_hash.trim()})
			if (!validation.success) {
				setLoading(false);
				return toast.error(validation.error.issues[0].message);
			} 
			const respons = await fetchAPIFunc(`${DomainPath}/api/users/sensitive?useToken=${token}`, "PUT", newPass);
			const result = await respons.json();
			if (respons.status === 401) {
				toast.error(result.message);
				router.replace('/');
			} else if (respons.status === 200) {
				toast.success(result.message);
				setLoading(false);
				router.replace('/login');
			} else {
				toast.error(result.message);
				setLoading(false);
				return
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
			return toast.error("something want wrong");
		}
	}

	return (
		<>
			{loading ? <CoverL/> : ""}
			<div>
				<SectionTitle title={"Enter Your New Password"}/>
				<form onSubmit={(e) => handleSubmit(e)}>
					<FormLableInp data={{ req: true, lableT: "Your New Password", placeH: "password", sendData: newPass, setSendDataFunc: setNewPass, 
						keyIs: "password_hash", inpType:"password" }}
					/>
					<button className='main-red-btn w-f-c py-2 mt-3'>Update My Password</button>
				</form>
			</div>
		</>
	)
}

export default ResetPassForm
