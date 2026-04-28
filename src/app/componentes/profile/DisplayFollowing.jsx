"use client"
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import React, { useEffect, useState } from 'react'
import DisplayFollowingDetails from './DisplayFollowingDetails';
import { DomainPath } from '@/utils/DomainPath';

const DisplayFollowing = ({ id }) => {
	const [followingData, setFollowingData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showFollowingDetails, setShowFollowingDetails] = useState({
		want: "",
		show: false
	});

	const getFollowingData = async () => {
		try {
			setLoading(true);
			const response = await fetchAPIFunc(`${DomainPath}/api/users/activity/userFollowing?id=${id}`, "GET", {});
			const result = await response.json();
			if (response.status === 200) {
				setFollowingData(result);
			} else{
				setFollowingData(false);
			}
			setLoading(false);
			return;
		} catch (error) {
			console.log(error);
			setLoading(false);
			setFollowingData(false);
			return;
		}
	}

	useEffect(() => {
		const run = async () => {
			await getFollowingData();
		}
		run();
	}, [])

	if (followingData === null) {
		return (
			<div className='p-3 color-l rounded-1 b-g-d3'>
				Failed To Get Data
			</div>
		)
	}

	return (
		<>
			{
				showFollowingDetails.show 
				&&
				<DisplayFollowingDetails data={followingData} wantDisplay={showFollowingDetails.want} id={id} closeFunc={setShowFollowingDetails}/>
			}
			<div className='following-part d-flex align-items-center gap-5'>
				<div className={`d-flex flex-column gap-1 color-l fw-medium c-p ${loading ? "disabled" : ""}`} onClick={() => setShowFollowingDetails({
					want:"following",
					show: true
				})}>
					<span>{followingData.length > 0 ? followingData.filter(following => following.follower_id == id).length : 0}</span>
					<span>Following</span>
				</div>
				<div className={`d-flex flex-column gap-1 color-l fw-medium c-p ${loading ? "disabled" : ""}`} onClick={() => setShowFollowingDetails({
					want:"followers",
					show: true
				})}>
					<span>{followingData.length > 0 ? followingData.filter(following => following.followed_id == id).length : 0}</span>
					<span>Followers</span>
				</div>
			</div>
		</>
	)
}

export default DisplayFollowing
