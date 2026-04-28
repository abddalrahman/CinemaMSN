import SectionTitle from '@/app/componentes/global/smallComp/SectionTitle';
import ShowToast from '@/app/componentes/global/smallComp/ShowToast';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import React from 'react'
import UpdateProfileForm from '../UpdateProfileForm';
import { cookies } from 'next/headers';
import "../../profile.css";
import { DomainPath } from '@/utils/DomainPath';

export const metadata = {
	title: 'CinemaMSN - Edit Profile',
	description: "Edit your profile Data like name, bio, password, and more",
}

const EditProfile = async ({ params }) => {
	const getParams = await params;
	const userId = Number(getParams.id) || null;
	const getCookies = await cookies();
	const userInfoCookie = getCookies.get("jwtToken")?.value || null;
	if (userId === null || !Number.isInteger(userId)) {
		return <ShowToast info={{messageText: "invalid Data", type: "error", changePath: "/"}}/>
	}
	let getUserData = null;
	try {
		const respons = await fetchAPIFunc(`${DomainPath}/api/users/sensitive`, "GET", {}, userInfoCookie, false, "no-store");
		const result = await respons.json();
		if (respons.status === 200) {
			getUserData = result
		} else {
			getUserData = null
		}
	} catch (error) {
		console.log(error);
		getUserData = null
	}
	if (getUserData === null) {
		return <ShowToast info={{messageText: "failed to get your data may be your account in not active or banned", type: "error", 
			changePath: `/profile/${userId}`
		}}/>
	}
	return (
		<div className='edit-profile-page pt-120'>
			<div className="main-container">
				<SectionTitle title={"Edit Profile"} subtitle={`you can update your profile information like username, password, 
					profile image... but you can not change your email. Enter your old password only if you want to change your password. Leave the fields you 
					don't want to change as they are.`}
				/>
				<UpdateProfileForm data={getUserData}/>
			</div>
		</div>
	)
}

export default EditProfile
