"use client"
import FormLableInp from '@/app/componentes/global/smallComp/FormLableInp'
import { checkTwoObjIdentical, CreateFormData, fetchAPIFunc, FilterNotUpdatedProp, filterObjectInClient } from '@/utils/clientRandomFunc'
import React, { useState } from 'react'
import { SlCloudUpload } from 'react-icons/sl'
import bcrypt from 'bcryptjs'
import { toast } from 'react-toastify'
import { updateUserValidation } from '@/utils/zodValidations'
import CoverL from '@/app/componentes/global/smallComp/CoverL'
import { useRouter } from 'next/navigation'
import { FaRegImage } from "react-icons/fa6";
import { DomainPath } from '@/utils/DomainPath'

const UpdateProfileForm = ({ data }) => {
	const [loading, setLoading] = useState(false);
	const [oldUserData, setOldUserData] = useState({
		username: data.username,
		bio: data.bio && data.bio.replace("No Data", "") !== "" ? data.bio : "",
		profile_image_url: data.profile_image_url && data.profile_image_url.replace("No Data", "") !== "" ? data.profile_image_url : "",
		is_watchlist_private: data.is_watchlist_private,
		is_watched_private: data.is_watched_private,
		is_news_saved_private: data.is_news_saved_private,
		is_favorite_people_private: data.is_favorite_people_private,
		is_ratings_private: data.is_ratings_private
	})
	const [newUserData, setNewUserData] = useState({
		username: data.username,
		bio: data.bio && data.bio.replace("No Data", "") !== "" ? data.bio : "",
		oldPassword: "",
		newPassword: "",
		profile_image_url: data.profile_image_url && data.profile_image_url.replace("No Data", "") !== "" ? data.profile_image_url : "",
		is_watchlist_private: data.is_watchlist_private,
		is_watched_private: data.is_watched_private,
		is_news_saved_private: data.is_news_saved_private,
		is_favorite_people_private: data.is_favorite_people_private,
		is_ratings_private: data.is_ratings_private
	})
	const router = useRouter();

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			let isPasswordMatched = false
			if (newUserData.oldPassword.trim() != "" && newUserData.newPassword.trim() != ""){
				isPasswordMatched = await bcrypt.compare(newUserData.oldPassword, data.password_hash);
				if (!isPasswordMatched) {
					setLoading(false);
					return toast.error("Wrong Password");
				}
			}
			const objTofilter = {
				username: newUserData.username.trim(),
				bio: newUserData.bio.trim(),
				password_hash: isPasswordMatched ? newUserData.newPassword.trim() : "",
				profile_image_url: newUserData.profile_image_url,
				is_watchlist_private: newUserData.is_watchlist_private,
				is_watched_private: newUserData.is_watched_private,
				is_news_saved_private: newUserData.is_news_saved_private,
				is_favorite_people_private: newUserData.is_favorite_people_private,
				is_ratings_private: newUserData.is_ratings_private
			}
			const filteredObj = filterObjectInClient(objTofilter, [""]);
			if (Object.keys(filteredObj).length === 0) {
				setLoading(false);
				return toast.error("No Acceptable Changes");
			}
			const finalFilteredObj = FilterNotUpdatedProp(oldUserData, filteredObj, ["password_hash"]);
			objTofilter.password_hash !== "" ? finalFilteredObj.password_hash = objTofilter.password_hash : ""
			finalFilteredObj.email = data.email;
			const validation = updateUserValidation.safeParse(finalFilteredObj);
			if (!validation.success) {
				setLoading(false);
				return toast.error(validation.error.issues[0].message);
			}
			const formData = CreateFormData(finalFilteredObj);
			const respons = await fetchAPIFunc(`${DomainPath}/api/users/sensitive`, "PUT", formData, null, true);
			const result = await respons.json();
			if (respons.status === 200) {
				setLoading(false)
				toast.success("updated Successfuly");
				router.replace(`/profile/${data.user_id}`);
			} else {
				setLoading(false)
				return toast.error(result.message);
			}

		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	}

	return (
		<>
			{loading ? <CoverL/> : ""}
			<form className='update-user-form b-g-d3 m-border p-4 rounded-4' onSubmit={(e) => handleFormSubmit(e)}>
				<FormLableInp data={{ req: false, lableT: "Username", placeH: "3-100 letters", sendData: newUserData, setSendDataFunc: setNewUserData, 
					keyIs: "username" }} 
				/>
				<FormLableInp data={{ req: false, lableT: "Bio", placeH: "10-400 letters", sendData: newUserData, setSendDataFunc: setNewUserData, 
					keyIs: "bio" }} 
				/>
				<div className='main-form-lbl-inp mb-3'>
						<label>profile image</label>
					{
						newUserData.profile_image_url !== "" || oldUserData.profile_image_url !== ""
						?
							<img src={oldUserData.profile_image_url !== "" && newUserData.profile_image_url === oldUserData.profile_image_url ? 
								oldUserData.profile_image_url : URL.createObjectURL(newUserData.profile_image_url)} 
								alt="profile image" 
								className='color-dg rounded-circle'
							/>
						:
							<span className='color-l opacity-50 small'>No Profile Image</span>
					}
					<div className='upload-file-container d-flex align-items-center gap-3 py-3 px-4 b-g-d2 rounded-2'>
						<SlCloudUpload size={30} className='color-g'/>
						<div className='color-g fw-semibold d-flex flex-column'>
							<span className='fs-sm'>Upload profile Image</span>
							<span className='color-dg fst-italic fw-normal fs-vxs'>.jpg, jpeg, png, ro .web, max 400KB</span>
						</div>
						{
							newUserData.profile_image_url !== "" && newUserData.profile_image_url !== oldUserData.profile_image_url
							?
								<label onClick={(e) => {e.preventDefault(); setNewUserData({...newUserData, profile_image_url: oldUserData.profile_image_url})}}>
									Reset
								</label>
							:
								<>
									<label className='d-flex align-items-center justify-content-center px-2 d-sm-none' htmlFor="profile-img"><FaRegImage/></label>
									<label className='d-none d-sm-inline-block' htmlFor="profile-img">Select File</label>
								</>
						}
						<input type="file" id='profile-img' hidden onChange={(e) => setNewUserData({...newUserData, profile_image_url: e.currentTarget.files[0]})}/>
					</div>
				</div>
				<div className='main-form-lbl-inp mb-3'>
					<label>Privacy Settings</label>
					<div className='d-flex align-items-center gap-3 flex-wrap'>
						<span className={`profile-privacy-btn d-flex align-items-center py-1 px-2 rounded-1 c-p gap-2 
							${newUserData.is_watchlist_private ? "active" : ""}`} 
							onClick={() => setNewUserData({...newUserData, is_watchlist_private: !newUserData.is_watchlist_private})}
						>
							<span>WatchList Private</span> <span></span>
						</span>
						<span className={`profile-privacy-btn d-flex align-items-center py-1 px-2 rounded-1 c-p gap-2 
							${newUserData.is_watched_private ? "active" : ""}`} 
							onClick={() => setNewUserData({...newUserData, is_watched_private: !newUserData.is_watched_private})}
						>
							<span>Watched Private</span> <span></span>
						</span>
						<span className={`profile-privacy-btn d-flex align-items-center py-1 px-2 rounded-1 c-p gap-2 
							${newUserData.is_news_saved_private ? "active" : ""}`} 
							onClick={() => setNewUserData({...newUserData, is_news_saved_private: !newUserData.is_news_saved_private})}
						>
							<span>Saved News Private</span> <span></span>
						</span>
						<span className={`profile-privacy-btn d-flex align-items-center py-1 px-2 rounded-1 c-p gap-2 
							${newUserData.is_favorite_people_private ? "active" : ""}`} 
							onClick={() => setNewUserData({...newUserData, is_favorite_people_private: !newUserData.is_favorite_people_private})}
						>
							<span>Favorite Private</span> <span></span>
						</span>
						<span className={`profile-privacy-btn d-flex align-items-center py-1 px-2 rounded-1 c-p gap-2 
							${newUserData.is_ratings_private ? "active" : ""}`} 
							onClick={() => setNewUserData({...newUserData, is_ratings_private: !newUserData.is_ratings_private})}
						>
							<span>Ratings Private</span> <span></span>
						</span>
					</div>
				</div>
				<FormLableInp data={{ req: false, lableT: "Password", placeH: "enter your current password just if you want to update password", 
					sendData: newUserData, setSendDataFunc: setNewUserData, 
					keyIs: "oldPassword", inpType: "password" }} 
				/>
				{
					newUserData.oldPassword !== ""
					?
						<FormLableInp data={{ req: true, lableT: "New Password", placeH: "enter your new password", 
							sendData: newUserData, setSendDataFunc: setNewUserData, 
							keyIs: "newPassword", inpType: "password" }} 
						/>
					:
						""
				}
				{
					(newUserData.oldPassword.trim() !== "" && newUserData.newPassword.trim() !== "") || 
					checkTwoObjIdentical(oldUserData, newUserData, ["oldPassword", "newPassword"])
					?
						<button className='main-red-btn w-100 py-2 mt-5'>Update</button>
					:
						<span className='main-red-btn w-100 py-2 disabled mt-5'>Update</span>
				}
			</form>
		</>
	)
}

export default UpdateProfileForm
