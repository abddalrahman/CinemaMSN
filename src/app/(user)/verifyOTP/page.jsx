import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { redirect } from 'next/navigation';
import React from 'react'
import VerifyForm from './VerifyForm';
import { cookies } from 'next/headers';
import { DomainPath } from '@/utils/DomainPath';

export const metadata = {
	title: 'CinemaMSN - Verify OTP',
	description: `Verify your account by entering the OTP sent to your email.`,
	openGraph: {
		title: 'Activate account - CinemaMSN',
		description: 'Verify your account by entering the OTP sent to your email.',
		type: 'website',
	},
}

const VerifyOtpCode = async () => {
	const getCookies = await cookies();
	const token = getCookies.get("jwtToken")?.value;
	if (!token) redirect('/');
	
	let respons, result = null;
	try {
		respons = await fetchAPIFunc(`${DomainPath}/api/users`, "GET", {}, token, false, "no-store");
		result = await respons.json();
	} catch (error) {
		console.log(error);
		return (
			<div className='main-container pt-120'>
				<div className='mt-5 p-3 color-l b-g-d3'>
					Something Went Wrong
				</div>
			</div>
		)
	}

	if (respons?.status === 200 && result?.uStatus === "nactive") {
		return (
			<div className='verify-otp-page h-100vh w-100vw d-flex align-items-center justify-content-center position-relative'>
				{
					<VerifyForm/>
				}
			</div>
		)
	} else {
		redirect('/');
	}

}

export default VerifyOtpCode
