"use client"
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import FormLableInp from '@/app/componentes/global/smallComp/FormLableInp'
import { checkTwoObjIdentical, fetchAPIFunc, FilterNotUpdatedProp, filterObjectInClient } from '@/utils/clientRandomFunc';
import { DomainPath } from '@/utils/DomainPath';
import { addCommentValidation, updateCommentValidation } from '@/utils/zodValidations';
import React, { useEffect, useRef, useState } from 'react'
import { MdClose } from 'react-icons/md';
import { TbFlameOff, TbFlameFilled  } from "react-icons/tb";
import { toast } from 'react-toastify';

const AddComment = ({ hideForm, contentId, fromProfile= null, getMyReviews= null }) => {
	const [loading, setLoading] = useState(false)
	const [dataToSend, setDataToSend] = useState({
		title: "",
		body: "",
		is_spoiler_by_author: false,
		isExist: false,
		oldData: {
			title: "",
			body: "",
			is_spoiler_by_author: false
		}
	})
	const formDiv = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const btnIS = e.nativeEvent.submitter.name;
			if (btnIS === "subminBtn") {
				setLoading(true)
				 const objToFilter = {
					title: dataToSend.title.trim(),
					body: dataToSend.body.trim(),
					is_spoiler_by_author: dataToSend.is_spoiler_by_author
				}
				const filteredObj = filterObjectInClient(objToFilter, [""]);
				filteredObj.content_id = Number(contentId)

				if (!dataToSend.isExist) {
					const validation = addCommentValidation.safeParse(filteredObj);
					if (!validation.success) {
						setLoading(false)
						return toast.error(validation.error.issues[0].message);
					}
					
					const addeddComment = await fetchAPIFunc(`${DomainPath}/api/users/activity/commenting`, "POST", filteredObj);
					const result = await addeddComment.json();
					if (addeddComment.status === 200) {
						setLoading(false)
						hideForm(false)
						toast.success(result.message);
						setTimeout(() => {
							window.location.reload();
						}, 400);
					} else {
						setLoading(false)
						hideForm(false)
						return toast.error(result.message);
					}
					
				} else {
					const validation = updateCommentValidation.safeParse(filteredObj);
					if (!validation.success) {
						setLoading(false)
						return toast.error(validation.error.issues[0].message);
					} else {
						const finalFilteredObj = FilterNotUpdatedProp(dataToSend.oldData, objToFilter);
						finalFilteredObj.content_id = Number(contentId)
						if (Object.keys(finalFilteredObj).length === 0) {
							return toast.error("no acceptable change to update");
						} else {
							const updatedComment = await fetchAPIFunc(`${DomainPath}/api/users/activity/commenting`, "PUT", finalFilteredObj);
							const result = await updatedComment.json();
							if (updatedComment.status === 200) {
								setLoading(false)
								hideForm(false)
								toast.success(result.message);
								if (getMyReviews !== null) {
									getMyReviews();
									return;
								} else {
									setTimeout(() => {
										window.location.reload();
									}, 400);
								}
							} else {
								setLoading(false)
								hideForm(false)
								return toast.error(result.message);
							}
						}
					}
				}
			}
		} catch (error) {
			setLoading(false)
			console.log(error);
		}
	}

	const checkIfReviewBefore = async () => {
		try {
			setLoading(true);
			const checkedData = await fetchAPIFunc(`${DomainPath}/api/users/activity/commenting?needCheck=true&cId=${contentId}`, "GET", {});
			const result = await checkedData.json();
			if (checkedData.status === 200) {
				setDataToSend({
					title: result.title,
					body: result.body,
					is_spoiler_by_author: result.is_spoiler_by_author,
					isExist: true,
					oldData: {
						title: result.title,
						body: result.body,
						is_spoiler_by_author: result.is_spoiler_by_author
					}
				})
				if (!fromProfile) toast.warning("you allready have a review before Update it if you want");
			} else if (checkedData.status === 404) {
				setDataToSend({
					title: "",
					body: "",
					is_spoiler_by_author: false,
					isExist: false,
					oldData: {
						title: "",
						body: "",
						is_spoiler_by_author: false
					}
				})
			} else if (checkedData.status === 500) {
				toast.error("something went wrong try again");
				setLoading(false);
				hideForm(false);
			} else {
				toast.error("Login and activate your account to comment");
				setLoading(false);
				hideForm(false);
			}
			setLoading(false);
			return;
		} catch (error) {
			console.log(error);
			toast.error("something went wrong try again");
			setLoading(false);
			hideForm(false);
		}
	}

	useEffect(() => {
		const run = async () => {
			setTimeout(() => {
				formDiv.current?.classList.add("show");
			}, 50);
			await checkIfReviewBefore();
		}
		run();
	}, [])
	return (
		<div className='position-fixed w-100 top-0 start-0 h-100 d-flex align-items-center justify-content-center add-comment-container'>
			{loading ? <CoverL/> : ""}
			<form className='position-relative' ref={formDiv} onSubmit={(e) => handleSubmit(e)}>
				<MdClose size={20} className='color-l position-absolute top-0 end-0 c-p' onClick={() => {
						formDiv.current.classList.remove("show");
						setTimeout(() => {
							hideForm(false);
						}, 200);
					}}
				/>
				<FormLableInp data={{req: false, lableT: "Comment Title", placeH: "Enter title fomr your Review", sendData: dataToSend, 
					setSendDataFunc: setDataToSend, keyIs: "title"}}
				/>
				<div className='main-form-lbl-inp mb-2 mb-md-3 fs-main'>
					<label>Review Body</label>
					<textarea className='border-0' placeholder='Enter your Review' value={dataToSend.body} onInput={(e) => setDataToSend({
						...dataToSend, body: e.currentTarget.value}
					)}>
					</textarea>
				</div>
				<div className='main-form-lbl-inp'>
					<label>contain Spoiler</label>
					<div className='d-flex align-items-center gap-3 color-l'>
						<span className={`fw-semibold check-box-btn w-50 ${dataToSend.is_spoiler_by_author ? "active" : ''}`} 
							onClick={() => setDataToSend({...dataToSend, is_spoiler_by_author: true})}
						>
							<TbFlameFilled className='me-2'/> Yes
						</span>
						<span className={`fw-semibold check-box-btn w-50 ${!dataToSend.is_spoiler_by_author ? "active" : ''}`} 
							onClick={() => setDataToSend({...dataToSend, is_spoiler_by_author: false})}
						>
							<TbFlameOff className='me-2'/> No
						</span>
					</div>
				</div>
				{
					dataToSend.isExist 
					?
						checkTwoObjIdentical(dataToSend.oldData, dataToSend, ["isExist", "oldData"])
						?
							<button className={`main-red-btn mt-2 mt-md-4 w-100 py-2 py-md-3`} name="subminBtn">
								Updata
							</button>

						:
							<button className={`main-red-btn mt-2 mt-md-4 w-100 py-2 py-md-3 disabled`}>
								Updata
							</button>
					:
						<button className={`main-red-btn mt-2 mt-md-4 w-100 py-2 py-md-3 ${dataToSend.title.trim().length < 3 || dataToSend.body.trim().length < 200 ? 
							"disabled" : ""}`} name="subminBtn"
						>
							Add
						</button>
				}
			</form>
		</div>
	)
}

export default AddComment
