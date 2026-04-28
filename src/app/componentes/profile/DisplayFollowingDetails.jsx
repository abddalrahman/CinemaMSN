"use client"
import React, { useEffect, useState } from 'react'
import ShowToast from '../global/smallComp/ShowToast';
import { MdClose } from 'react-icons/md';
import SectionTitle from '../global/smallComp/SectionTitle';
import Link from 'next/link';
import { FaUserAlt } from 'react-icons/fa';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { Spinner } from 'react-bootstrap';
import { DomainPath } from '@/utils/DomainPath';

const DisplayFollowingDetails = ({ data, wantDisplay, id, closeFunc }) => {
	let [resultData, setResultData] = useState([]);
	let [loading, setLoading] = useState(false);
	
	const getData = async () => {
		try {
			setLoading(true);
			const IDs = wantDisplay === "followers" ? [...new Set(data.filter(f => f.follower_id != id))].map(f => f.follower_id) : 
			[...new Set(data.filter(f => f.followed_id != id))].map(f => f.followed_id);
			const usersData = await fetchAPIFunc(`${DomainPath}/api/globals/displayAPIs/getUserMInfoFromList?IDs=${JSON.stringify(IDs)}`, "GET", {});
			const result = await usersData.json();
			if (usersData.status === 200) {
				setResultData(result)
				setLoading(false);
			} else {
				setResultData(null)
				setLoading(false);
				closeFunc({
					want:"",
					show: false
				})
			}
		} catch (error) {
			console.log(error)
			setLoading(false);
			closeFunc({
				want:"",
				show: false
			})
			setResultData(null)
		}
	}
	
	useEffect(() => {
		const run = async () => {
			if (data.length > 0){
				await getData();
			}
		}
		run();
	}, [])
	
	if (resultData === null) return <ShowToast info={{messageText: "something went wrong", type: "error"}}/>
	return (
		<div className='cover following-details d-flex align-items-center justify-content-center'>
			<div className='following-details-box overflow-auto'>
				<div className='d-flex align-items-center justify-content-between'>
					<span className='color-y fs-5 fw-semibold'>Details</span>
					<MdClose size={20} className='color-l c-p' onClick={() => closeFunc({want: "", show: false})}/>
				</div>
				<div className='b-g-d3 mt-4 p-3 rounded-1'>
					<SectionTitle title={wantDisplay === "followers" ? "Followers" : "Following"} inHead={resultData.length}/>
					{
						loading
						?
							<div className='d-flex align-items-center justify-content-center p-5'>
								<Spinner animation="border" variant="danger" />
							</div>
						:
							<ul className='mt-4'>
								{
									resultData.length > 0
									?
									resultData.map((user) => (
										<li key={user.user_id}>
											<Link href={`/profile/${user.user_id}`} className='d-flex align-items-center gap-3 color-l b-g-d2 rounded-1 p-3 mb-2'>
												{
													user.profile_image_url && user.profile_image_url.replace("No Data", "") !== ""
													?
														<img src={user.profile_image_url} alt={user.username} className='rounded-circle' />
													:
													<span className='user-image d-flex align-items-center justify-content-center b-g-gd rounded-circle'>
														<FaUserAlt size={20} className='color-l'/>
													</span>
												}
												<h5 className='mb-0'>{user.username}</h5>
											</Link>
										</li>
									))
									: 
										<li className='color-l b-g-d2 rounded-1 p-3'>
											No {wantDisplay === "followers" ? "followers" : "following"}
										</li>
								}
							</ul>
					}
				</div>
			</div>
		</div>
	)
}

export default DisplayFollowingDetails
