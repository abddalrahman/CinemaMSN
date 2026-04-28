"use client"
import { calcAge, fetchAPIFunc, getSpecificRating } from '@/utils/clientRandomFunc';
import Link from 'next/link';
import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa6';
import { MdKeyboardArrowRight, MdDelete } from "react-icons/md";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { IoIosWarning } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import { AiOutlineFire, AiFillFire } from "react-icons/ai";
import { ImFire } from "react-icons/im";
import { RiEdit2Line, RiDeleteBin6Line  } from "react-icons/ri";
import { FaUserAlt } from 'react-icons/fa';
import { addActiveWithCommentValidation } from '@/utils/zodValidations';
import { toast } from 'react-toastify';
import ConfirmComp from './smallComp/ConfirmComp';
import CoverL from './smallComp/CoverL';
import { DomainPath } from '@/utils/DomainPath';

const CommentCard = ({ data }) => {
	const { commentID, userId, contentId, poster, conTitle, comTitle, comBody, rate, created, updated, likes, spoilerAuther, spoilerMember, reported, 
		currentUser, forProfile, profile_img, userName, isLike= null, isSpoiler= null, isReport= null, refreshData=null, showEdit= null} = data;
	const [loading, setLoading] = useState(false);
	const [showComment, setShowComment] = useState(false);
	const [changedCommentData, setChangedCommentData] = useState({
		likesNum: likes,
		spoilerNum: spoilerMember,
		reportNun: reported
	});
	const [deleteControle, setDeleteControle] = useState({
		showConfirm: false,
		commentID: null
	})
	const [loadingDelete, setLoadingDelete] = useState(false);
	
	const updateComentData = async () => {
		try {
			const updatedData = await fetchAPIFunc(`${DomainPath}/api/users/activity/commenting?uId=${userId}&cId=${contentId}`, "GET", {});
			const result = await updatedData.json();
			if (updatedData.status === 200) {
				setChangedCommentData({
					likesNum: result.likes_count,
					spoilerNum: result.spoiler_reports_count,
					reportNun: result.abuse_reports_count
				})
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		} finally {
			refreshData();
		}
	}
	const handleActiveWithComment = async (active) => {
		try {
			if (userId === currentUser) {
				return toast.error("You Cant interactive with Your Comments.");
			}
			setLoading(true);
			const objToSend = {
				comment_id: Number(commentID),
				content_id: Number(contentId),
				user_id: Number(userId),
				active: active
			}
			const validation = addActiveWithCommentValidation.safeParse(objToSend);
			if (!validation.success) {
				setLoading(false);
				return toast.error("data error");
			};
			const addActive = await fetchAPIFunc(`${DomainPath}/api/users/getActiveWithComment`, "POST", objToSend);
			const result = await addActive.json();
			if (addActive.status === 200) {
				await updateComentData();
			} else {
				setLoading(false);
				if (addActive.status === 401) {
					return toast.error(result.message);
				}
				if (addActive.status === 403) {
					return toast.error("You Cant interactive with Your Comments");
				}
				return toast.error("Failed To Complete Active With Comment");
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	}

	const deleteComment = (comID) => {
		setDeleteControle({
			showConfirm: true,
			commentID: comID
		});
	}
	
	const handleConfirm = async () => {
		setLoadingDelete(true)
		setDeleteControle({
			...deleteControle,
			showConfirm: false
		})
		if (deleteControle.commentID) {
			try {
				const respons = await fetchAPIFunc(`${DomainPath}/api/users/activity/commenting`, "DELETE", {id: deleteControle.commentID});
				const result = await respons.json();
				if (respons.status === 200) {
					setLoadingDelete(false);
					setDeleteControle({
						showConfirm: false,
						commentID: null
					});
					toast.success(result.message);
					refreshData();
				} else {
					setLoadingDelete(false);
					setDeleteControle({
						showConfirm: false,
						commentID: null
					});
					return toast.error(result.message);
				}
			} catch (error) {
				console.log(error);
				setLoadingDelete(false);
				setDeleteControle({
					showConfirm: false,
					commentID: null
				});
				return toast.error("something want wrong");
			}
		}
		
	}

	const handleCansle = () => {
		setLoadingDelete(false);
		setDeleteControle({
			showConfirm: false,
			commentID: null
		});
		return;
	}

	return (
		<>
			{loadingDelete ? <CoverL/> : ''}
			{
				deleteControle.showConfirm
				?
					<ConfirmComp data={{title: "Delete Comment", body: "Are You Shur You Want To Delete This Comment", noBtn: "No", yesBtn: "Delete", bg: "d"}}
						callFuncs={{confirmFunc:handleConfirm, cansleFunc: handleCansle}}
					/>
				:
					''
			}
			<div className='review-card p-3 b-g-d3 rounded-1 mb-4'>
				<div className='review-head d-flex gap-3 pb-3 align-items-center'>
					{
						forProfile
						?
							<>
								<img src={poster} alt={conTitle} className='rounded-1 review-poster'/>
								<div className='d-flex flex-column justify-content-between'>
									<h3 className='fs-xl fw-bold'>
										<Link className='color-l d-flex align-items-center' href={`/details/${contentId}`}>
											<span>{conTitle}</span><MdKeyboardArrowRight size={30}/>
										</Link>
									</h3>
									<span className='d-flex align-items-center gap-2 fs-main'>
										<FaStar size={16} className='color-r'/><span className='color-g'>{Number(rate) !== 0 ? Number(rate) : "You did not rate it"}</span>
									</span>
								</div>
								{spoilerAuther && 
									<div className='d-flex align-items-center ms-auto color-r gap-2 fs-main'>
										<ImFire size={20} /> <span className='color-r fw-bold'>Spoiler</span>
									</div>
								}
								{
									!spoilerAuther && changedCommentData.spoilerNum > 0
									?
										<div className='d-flex align-items-center ms-auto color-y gap-2 fs-main'>
											<ImFire size={20} /> <span className='color-y fw-bold'>Spoiler</span>
										</div>
									:''
								}
							</>
						:
							<>
								{
									profile_img && profile_img.replace("No Data", "") !== ""
									?
										<img src={profile_img} alt={userName} className='rounded-circle profile-image'/>
									:
										<span className='d-flex align-items-center justify-content-center b-g-r rounded-circle profile-image'>
											<FaUserAlt size={22} className='color-l'/>
										</span>
								}
								<div className='d-flex flex-column justify-content-between'>
									<h3 className='fs-xl fw-bold'>
										<Link className='color-l d-flex align-items-center fs-main' href={`/profile/${userId}`}>
											<span>{userName}</span><MdKeyboardArrowRight size={30}/>
										</Link>
									</h3>
									<span className='d-flex align-items-center gap-2 fs-sm'>
										<FaStar size={16} className='color-r'/><span className='color-g'>{getSpecificRating(rate, userId)}</span>
									</span>
								</div>
								{spoilerAuther && 
									<div className='d-flex align-items-center ms-auto color-r gap-2 fs-main'>
										<ImFire size={20} /> <span className='color-r fw-bold'>Spoiler</span>
									</div>
								}
								{
									!spoilerAuther && changedCommentData.spoilerNum > 0
									?
										<div className='d-flex align-items-center ms-auto color-y gap-2 fs-main'>
											<ImFire size={20} /> <span className='color-y fw-bold'>Spoiler</span>
										</div>
									:''
								}
							</>
					}
				</div>
				<div className='review-body d-flex flex-column gap-3 py-3'>
					<div className='color-dg fw-medium fs-main'>{calcAge(created)}</div>
					<h3 className='fs-mdl fw-bold color-l'>{comTitle}</h3>
					{
						(spoilerAuther || changedCommentData.spoilerNum > 0) && currentUser != userId
						?
							<button className='see-comment color-l w-f-c bg-transparent p-0 d-flex align-items-center gap-3 fs-main' 
								onClick={() => setShowComment(!showComment)}
							>
								<span className='r-op-bg'>{spoilerAuther ? "Contains Spoiler" : "May Contains Spoiler"}</span>
								<span className='color-r'>{showComment ? "Hide Comment" : "Show Comment"}</span>
							</button>			
						:''
					}
					<p className='color-g fw-medium fs-main'>{
						(spoilerAuther || changedCommentData.spoilerNum > 0) && currentUser != userId ? showComment ? comBody : "..." : comBody
					}</p>
				</div>
				<div className='review-footer d-flex align-items-center'>
					<div className={`color-l d-flex align-items-center gap-2 ${loading ? 'disabled' : ""}`} onClick={() => {
						loading ? "" : handleActiveWithComment("like")
					}}>
						{
							isLike
							?
								<BiSolidLike size={24} className='c-p'/>
							:
								<BiLike size={24} className='c-p'/>
						}
						<span>{changedCommentData.likesNum}</span>
					</div>
					{
						spoilerAuther
						?''
						:
							<div className={`color-y d-flex align-items-center gap-2 ms-4 ${loading ? 'disabled' : ""}`} onClick={() => {
								loading ? "" : handleActiveWithComment("spoiler")
							}}>
								{
									isSpoiler
									? <AiFillFire size={24} className='c-p'/>
									: <AiOutlineFire size={24} className='c-p'/>
								}
								<span>{changedCommentData.spoilerNum}</span>
							</div>
					}
					<div className={`color-r d-flex align-items-center gap-2 ms-4 ${loading ? 'disabled' : ""}`} onClick={() => {
						loading ? "" : handleActiveWithComment("report")
					}}>
						{
							isReport
							? <IoIosWarning size={24} className='c-p'/>
							: <IoWarningOutline size={24} className='c-p'/>
						}
						<span>{changedCommentData.reportNun}</span></div>
					{
						currentUser && currentUser == userId
						?
							<div className='d-flex color-dg align-items-center gap-4 ms-auto'>
								<RiEdit2Line size={24} className='c-p' onClick={() => showEdit({id: contentId, show: true})}/>
								<RiDeleteBin6Line size={22} className='c-p ' onClick={() => deleteComment(commentID)}/>
							</div>
						:''
					}
				</div>
			</div>
		</>
	)
}

export default CommentCard
