import ProfileBody from '@/app/componentes/profile/ProfileBody';
import ProfileHead from '@/app/componentes/profile/ProfileHead';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { cookies } from 'next/headers';
import React from 'react'
import "../profile.css"
import { getTokenData } from '@/utils/verifyToken';
import ShowToast from '@/app/componentes/global/smallComp/ShowToast';
import { DomainPath } from '@/utils/DomainPath';

export const metadata = {
	title: 'CinemaMSN - Profile',
	description: `Explore CinemaMSN user profiles. Discover favorite movie lists, personal ratings, and the latest cinema reviews from our community 
		members.`,
	openGraph: {
		title: 'User Profile - CinemaMSN Community',
		description: 'Check out the cinematic taste of our community members and share your passion for movies and series.',
		type: 'profile',
	},
}

export const dynamic = 'force-dynamic';

const Profile = async ({params}) => {
	const getParams = await params;
	const userId = Number(getParams.id) || null;
	let userCookie = await cookies();
	const userInfoCookie = userCookie.get("jwtToken")?.value || null;
	if (!userInfoCookie) {
		return <ShowToast info={{messageText: "You are Not Loged In", type: "error", changePath: "/"}}/>
	}
	
	const tokenDataObj = userInfoCookie ? getTokenData(userInfoCookie) : null;
	let usermainData, result = null;
	try {
		usermainData = await fetchAPIFunc(`${DomainPath}/api/users/profile?id=${userId}`, "GET", {}, userInfoCookie, false, "no-store");
		result = await usermainData.json();
	} catch (error) {
		console.log(error);
		return (
			<div className='main-container pt-120'>
				<div className='mt-5 p-3 color-l b-g-d3'>
					Failed to Get Data
				</div>
			</div>
		)
	}
	if (usermainData.status !== 200) {
		return (
			<div className='main-container py-5'>
				<div className='b-g-d3 color-l p-3 mt-5 rounded-1'>
					Failed to Get Data
				</div>
			</div>
		)
	}

	return (
		<div className='profile-page'>
			<ProfileHead data={usermainData?.status === 200 ? result : null} token={tokenDataObj}/>
			<ProfileBody data={usermainData?.status === 200 ? result : null} token={tokenDataObj}/>
		</div>
	)
}

export default Profile