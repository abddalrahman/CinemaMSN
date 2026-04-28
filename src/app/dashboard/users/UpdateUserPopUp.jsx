"use client"
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import { fetchAPIFunc, filterObjectInClient } from '@/utils/clientRandomFunc';
import { DomainPath } from '@/utils/DomainPath';
import { updateUserByAdmin } from '@/utils/zodValidations';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa6';
import { toast } from 'react-toastify';

const UpdateUserPopUp = ({ info }) => {
	const router = useRouter();
	const {updateUserDate, setUpdateUserDate, data, fetchData} = info;
	const {userID, uRole, uStatus, show, tokenData} = updateUserDate;
	const {user_id, username, bio, profile_image_url, email, u_role, u_status} = data.find((userObj) => userObj.user_id == userID) || null;
	const [loading, setLoading] = useState(false);

	const saveNewUpdate = async () => {
		try {
			setLoading(true)
			const newDataObj = {
				u_role: uRole === u_role ? undefined : uRole,
				u_status: uStatus === u_status ? undefined : uStatus
			}
			const objToSend = filterObjectInClient(newDataObj);
			if (Object.keys(objToSend).length > 0) {
				objToSend.user_id = parseInt(user_id);
				const validation = updateUserByAdmin.safeParse(objToSend);
				if (!validation.success) {
					setLoading(false)
					setUpdateUserDate({userID: 0, uRole: "", uStatus: "", show: false, tokenData: tokenData})
					return toast.error("data entered is wrong");
				}
				// update
				const respons = await fetchAPIFunc(`${DomainPath}/api/admin/users/updateUser`, "PUT", objToSend);
				const result = await respons.json();
				if (respons.status === 200) {
					setLoading(false)
					toast.success("updated Successfuly");
					setUpdateUserDate({userID: 0, uRole: "", uStatus: "", show: false, tokenData: tokenData});
					await fetchData();
					return
				} else {
					setLoading(false)
					setUpdateUserDate({userID: 0, uRole: "", uStatus: "", show: false, tokenData: tokenData})
					toast.error("failed To Update User")
				}
			} else {
				setLoading(false)
				setUpdateUserDate({userID: 0, uRole: "", uStatus: "", show: false, tokenData: tokenData})
				return toast.error("nothing To update")
			}
		} catch (error) {
			setLoading(false)
			console.log(error);
			setUpdateUserDate({userID: 0, uRole: "", uStatus: "", show: false, tokenData: tokenData})
			return toast.error("internal server error");
		}
	}

	useEffect(() => {
		if (tokenData !== null && tokenData?.isAdmin === "admin" && u_role === "admin") {
			setUpdateUserDate({
				userID: 0,
				uRole: "",
				uStatus: "",
				show: false,
				tokenData: tokenData
			});
			toast.warning("This is a protected user");
		}

		if (tokenData !== null && tokenData?.isAdmin !== "admin") {
			setUpdateUserDate({
				userID: 0,
				uRole: "",
				uStatus: "",
				show: false,
				tokenData: tokenData
			});
			toast.warning("only admin");
		}
	}, [tokenData, u_role]);

	if (tokenData !== null && tokenData?.isAdmin === "admin") {
		if (u_role !== "admin") {
			return (
				<>
					{
						loading ? <CoverL/> : ''
					}
					<div className='position-fixed w-100 h-100 top-0 start-0 update-u-pop-container d-flex align-items-center justify-content-center'>
						<div className='p-4 update-u-pop'>
							<div className='d-flex align-items-center gap-3 mb-4'>
								{
									profile_image_url.replace("No Data", "") !== ""
									?
										<img src={profile_image_url} alt={username} className='rounded-circle'/>
									: 
										<span className='b-g-gd rounded-circle d-flex align-items-end overflow-hidden justify-content-center profile-span'>
											<FaUser size={34} color='#fff'/>
										</span>
								}
								<div className='d-flex flex-column gap-1'>
									<h3 className='mb-0 color-l fw-semibold fs-mdl'>{username}</h3>
									<p className='mb-0 color-l opacity-50 fs-main'>{bio.replace("No Data", "") !== "" ? bio : "No Bio Added"}</p>
								</div>
							</div>
							<div className='user-status-container mb-4'>
								<div className=' d-flex align-items-center gap-3 mb-2'>
									<h5 className='color-l fw-medium mb-0'>User Status:</h5> <span className='color-g fw-medium'>{u_status}</span>
								</div>
								<div className='d-flex align-items-center gap-3 flex-wrap'>
									<button className={`link-btn flex-grow-1 ${uStatus == "active" ? "borderd-btn" : ""}`}
										onClick={() => setUpdateUserDate({...updateUserDate, uStatus: "active"})}
									>active</button>
									<button className={`link-btn flex-grow-1 ${uStatus == "banned" ? "borderd-btn" : ""}`}
										onClick={() => setUpdateUserDate({...updateUserDate, uStatus: "banned"})}
									>banned</button>
									<button className={`link-btn flex-grow-1 ${uStatus == "nactive" ? "borderd-btn" : ""}`}
										onClick={() => setUpdateUserDate({...updateUserDate, uStatus: "nactive"})}
									>nactive</button>
								</div>
							</div>
							<div className='user-role-container'>
								<div className=' d-flex align-items-center gap-3 mb-2'>
									<h5 className='color-l fw-medium mb-0'>User Role:</h5> <span className='color-g fw-medium'>{u_role}</span>
								</div>
								<div className='d-flex align-items-center gap-3 flex-wrap mb-5'>
									<button className={`link-btn flex-grow-1 ${uRole=="admin" ? "borderd-btn" : ""}`}
										onClick={() => setUpdateUserDate({...updateUserDate, uRole: "admin"})}
									>admin</button>
									<button className={`link-btn flex-grow-1 ${uRole=="helper" ? "borderd-btn" : ""}`}
										onClick={() => setUpdateUserDate({...updateUserDate, uRole: "helper"})}
									>helper</button>
									<button className={`link-btn flex-grow-1 ${uRole=="user" ? "borderd-btn" : ""}`}
										onClick={() => setUpdateUserDate({...updateUserDate, uRole: "user"})}
									>user</button>
								</div>
							</div>
							<div className='d-flex align-items-center gap-3 active-btns'>
								<button className='main-gray-btn' onClick={() => {
									setUpdateUserDate({
										userID: 0,
										uRole: "",
										uStatus: "",
										show: false,
										tokenData: tokenData
									})
								}}>Cansle</button>
								{
									uStatus !== u_status || uRole !== u_role
									?
										<button className='main-red-btn' onClick={saveNewUpdate}>Save</button>
									: 
										<button className='main-red-btn disabled'>Save</button>
								}
							</div>
						</div>
					</div>
				</>
			)
		}
	}
}

export default UpdateUserPopUp
