"use client"
import React, { useEffect, useState } from 'react'
import { FaUserAlt} from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { IoMdShare } from "react-icons/io";
import Link from 'next/link';
import { FaUserPlus, FaUserCheck } from "react-icons/fa6";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { calcAge, fetchAPIFunc } from '@/utils/clientRandomFunc';
import ConfirmComp from '../global/smallComp/ConfirmComp';
import CoverL from '../global/smallComp/CoverL';
import { MdDashboardCustomize } from "react-icons/md";
import SharComp from '../global/smallComp/SharComp';
import { DomainPath } from '@/utils/DomainPath';

const ProfileHead = ({data, token}) => {
	const router = useRouter();
	const [VisitorFollowData, setVisitorFollowData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [deleteControle, setDeleteControle] = useState(false);
	const [loadingCover, setLoadingCover] = useState(false);
	const [openShar, setOpenShar] = useState(false);
	
	const getVisitorFollowingData = async () => {
		try {
			setLoading(true);
			const response = await fetchAPIFunc(`${DomainPath}/api/users/activity/userFollowing`, "GET", {});
			const result = await response.json();
			if (response.status === 200) {
				setVisitorFollowData(result);
			} else{
				setVisitorFollowData(false);
			}
			setLoading(false);
			return;
		} catch (error) {
			console.log(error);
			setLoading(false);
			setVisitorFollowData(false);
			return;
		}
	}

	const updateVisitorFollowing = async () => {
		try {
			setLoading(true);
			const response = await fetchAPIFunc(`${DomainPath}/api/users/activity/userFollowing`, "POST", {currentU: data.user_id, visitorU: token.id});
			const result = await response.json();
			if (response.status === 200) {
				toast.success(result.message);
				await getVisitorFollowingData();
				setLoading(false);
				return;
			} else{
				setLoading(false);
				return toast.error("something went wrong");
			}
		} catch (error) {
			setLoading(false);
			console.log(error);
			return toast.error("something went wrong");
		}
	}

	const deleteAccount = () => {
		setDeleteControle(true);
	}
	
	const handleConfirm = async () => {
		try {
			setLoadingCover(true)
			setDeleteControle(false);
			const respons = await fetchAPIFunc(`${DomainPath}/api/users/sensitive`, "DELETE", {id: data.user_id});
			const result = await respons.json();
			if (respons.status === 200) {
				setLoadingCover(false);
				toast.success(result.message);
				router.replace("/");
				router.refresh();
			} else if (respons.status === 401) {
				setLoadingCover(false);
				toast.error(result.message);
				router.replace('/');
			} else {
				setLoadingCover(false);
				return toast.error(result.message);
			}
		} catch (error) {
			setLoadingCover(false);
			return toast.error("something went wrong");
		}
	}

	const handleCansle = () => {
		setLoadingCover(false);
		setDeleteControle(false);
		return;
	}

	const resendOTP = async () => {
		try {
			setLoadingCover(true);
			const respons = await fetchAPIFunc(`${DomainPath}/api/users/register/resendOTP`, "POST", {});
			const result = await respons.json();
			if (respons.status === 200) {
				setLoadingCover(false);
				toast.success(result.message);
				router.replace('/verifyOTP');
			} else if (respons.status === 429) {
				setLoadingCover(false);
				return toast.warning(result.message);
			} else {
				setLoadingCover(false);
				return toast.error(result.message);
			}
		} catch (error) {
			console.log(error)
			setLoadingCover(false);
			return toast.error("something went wrong");
		}
	}

	useEffect(() => {
		if (data === null || token === null) {
			toast.error("missing data")
			router.replace("/")
		}
		const run = async () => {
			if (data.user_id !== token.id) {
				await getVisitorFollowingData();
			}
		}
		run();
	}, []);

	return (
		<>
			{loadingCover ? <CoverL/> : ""}
			{
				deleteControle
				?
					<ConfirmComp data={{title: "Delete Your Account", body: "You will lose all your associated data, including reviews, lists, and more.", 
						noBtn: "No", yesBtn: "Delete", bg: "d"}}
						callFuncs={{confirmFunc:handleConfirm, cansleFunc: handleCansle}}
					/>
				:
					''
			}
			{
				openShar 
				? <SharComp title={"Share Your Profile"} text={data?.username || "my profile"} urlT={`${DomainPath}/profile/${data.user_id}`} 
						closeFunc={setOpenShar}
					/> 
				: ''
			}
			<div className='profile-head pb-4 pt-120'>
				<div className='main-container'>
					<div>
						<div className='main-user-info'>
							<div className='d-flex flex-wrap gap-2 justify-content-between align-items-end'>
								<div className='d-flex gap-3'>
									<span className={`profile-image d-flex align-items-center justify-content-center ${
										data.profile_image_url && data.profile_image_url.replace("No Data", "") !== "" ? "" : "b-g-r"
									}`}>
										{
											data.profile_image_url && data.profile_image_url.replace("No Data", "") !== ""
											?
												<img src={data.profile_image_url} alt={data.username} className='rounded-circle' />
											:
												<FaUserAlt size={40} className='color-l'/>
										}
									</span>
									<div className='d-flex flex-column justify-content-between'>
										<h1 className='color-l fs-xl'>{data.username}</h1>
										<div className='d-flex align-items-center gap-2 color-g fs-sm'>
											<FaCalendarDays size={18}/> <span>joined {calcAge(data.created_at)}</span>
											{
												data.user_id === token.id && <span className='color-r c-p' onClick={deleteAccount}>Delete Account</span>
											}
										</div>
									</div>
								</div>
								<div className='d-flex align-items-center gap-2 gap-md-4 color-l controle-profile-icons'>
									{
										data.user_id === token.id
										?
										<>
											<Link href={`/profile/EditProfile/${data.user_id}`} className='d-flex align-items-center justify-content-center color-l gap-2'>
												<CiEdit size={18}/>
												<span>Edit Your Profile</span>
											</Link> 
											<button className='d-flex align-items-center justify-content-center color-l gap-2 c-p' onClick={() => setOpenShar(true)}>
												<IoMdShare size={18}/> <span>Share</span>
											</button>
										</>
										:
											VisitorFollowData !== false
											?
												loading
												?
													<button className='d-flex align-items-center justify-content-center color-l gap-2 c-p disabled'>
														{
															VisitorFollowData.length > 0 && 
															VisitorFollowData.filter((item) => item.follower_id == token.id && item.followed_id == data.user_id).length > 0
															?
																<>
																	<FaUserCheck size={18}/> <span>Following</span>
																</>
															:
																<>
																	<FaUserPlus size={18}/> <span>Follow</span>
																</>
														}
													</button>
												:
													<button className={`d-flex align-items-center justify-content-center color-l gap-2 c-p ${VisitorFollowData.length > 0 && 
															VisitorFollowData.filter((item) => item.follower_id == token.id && item.followed_id == data.user_id).length > 0 
															? "color-y" : "color-l"}`} 
															onClick={updateVisitorFollowing}>
														{
															VisitorFollowData.length > 0 && 
															VisitorFollowData.filter((item) => item.follower_id == token.id && item.followed_id == data.user_id).length > 0
															?
																<>
																	<FaUserCheck size={18}/> <span>Following</span>
																</>
															:
																<>
																	<FaUserPlus size={18}/> <span>Follow</span>
																</>
														}
													</button>
											:''
									}
								</div>
							</div>
							{data.bio && data.bio.replace("No Data", "") !== "" && <p className='color-g opacity-75 mt-3 mb-0 small'>{data.bio}</p>}
							{
								data.user_id === token.id && data.u_status === "nactive"
								?
								<button className='main-y-btn mt-4' onClick={resendOTP}>Activate Your Account</button>
								:
									data.user_id === token.id && data.u_status === "banned"
									?
										<span className='color-r d-block fw-bold w-f-c mt-4'>Your Account is Banned</span>
									:''
							}
							{
								data.user_id === token.id && (data.u_role === "admin" || data.u_role === "helper")
								?
									<Link href={'/dashboard'} className='main-red-btn w-f-c mt-4 d-flex align-items-center gap-1' >
										<MdDashboardCustomize size={16}/> Dashboard
									</Link>
								:''
							}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ProfileHead