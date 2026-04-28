"use client"
import ConfirmComp from '@/app/componentes/global/smallComp/ConfirmComp'
import CoverL from '@/app/componentes/global/smallComp/CoverL'
import { fetchAPIFunc } from '@/utils/clientRandomFunc'
import { DomainPath } from '@/utils/DomainPath'
import { addRatingValidation } from '@/utils/zodValidations'
import React, { useState } from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa6'
import { MdClose } from 'react-icons/md'
import { toast } from 'react-toastify'

const RateContentComp = ({ data }) => {
	const {rate, title, cId, closeRate, reGetRating} = data
	const [stars, setStars] = useState(rate?.score ? rate.score : 0)
	const [deleteControle, setDeleteControle] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleAddRating = async () => {
		try {
			if (stars < 1) {
				toast.error("No Rating Entered");
				return
			} else if (stars == rate?.score) {
				toast.error("No Rating Entered");
				return	
			}
			setLoading(true)
			const objToSend = {
				content_id: Number(cId),
				score: Number(stars)
			}
			const validation = addRatingValidation.safeParse(objToSend);
			if (!validation.success) {
				toast.error(validation.error.issues[0].message);
				setLoading(false);
			}
			const respons = await fetchAPIFunc(`${DomainPath}/api/users/activity/rating`, "POST", objToSend);
			const result = await respons.json();
			if (respons.status === 200 || respons.status === 201) {
				setLoading(false);
				toast.success(result.message);
				closeRate(false);
				reGetRating(true);
			} else {
				setLoading(false);
				toast.error(result.message);
				closeRate(result.message);
			}
			
		} catch (error) {
			setLoading(false);
			console.log(error);
			return toast.error("Something Went Wrong");
		}
	}

	const deleteRating = () => {
		setDeleteControle(true);
	}
	
	const handleConfirm = async () => {
		try {
			setLoading(true)
			setDeleteControle(false);
			const objToSend = {
				content_id: Number(cId)
			}
			const respons = await fetchAPIFunc(`${DomainPath}/api/users/activity/rating`, "DELETE", objToSend);
			const result = await respons.json();
			if (respons.status === 200) {
				toast.success(result.message);
				reGetRating(true);
				closeRate(false);
				setLoading(false);
				setDeleteControle(false);
			} else {
				toast.error("Something Went Wrong Try Again");
				closeRate(result.message);
				setLoading(false);
				setDeleteControle(false);
				return
			}

		} catch (error) {
			console.log(error);
			return toast.error("Something Went Wrong");
		}
	}

	const handleCansle = () => {
		setLoading(false);
		setDeleteControle(false);
		return;
	}

	return (
		<>
			{loading ? <CoverL/> : ''}
			{
				deleteControle
				?
					<ConfirmComp data={{title: "Delete Rating", body: "Are You Shur You Want To Delete This Rating", noBtn: "No", yesBtn: "Delete", bg: "d"}}
						callFuncs={{confirmFunc:handleConfirm, cansleFunc: handleCansle}}
					/>
				: ''
			}
			<div className='position-fixed rate-box-container vw-100 vh-100 d-flex align-items-center justify-content-center'>
				<div className={`rate-box b-g-d2 d-flex flex-column align-items-center position-relative p-4 pb-5 rounded-2 ${deleteControle ? "d-none" : ""}`}>
					<FaStar className='color-r position-absolute big-star' size={100}/>
					<MdClose onClick={() => closeRate(false)} size={24} className='position-absolute close-icon c-p'/>
					<span className='score-num fw-bold fs-3'>{rate?.score || "?"}</span>
					<span className='text-uppercase color-y fw-bold small'>rate this</span>
					<h5 className='color-l fw-semibold my-3'>{title}</h5>
					<div className='w-f-c'>
						<div className='stars d-flex align-items-center gap-2'>
							{
								[...Array(stars)].map((ele, index) => (
									<FaStar key={index} size={22} className="color-r c-p" onClick={() => setStars(index + 1)}/>
								))
							}
							{
								[...Array(10 - stars)].map((ele, index) => (
									<FaRegStar key={index} size={22} className="color-r c-p" onClick={() => setStars(stars + index + 1)}/>
								))
							}
						</div>
						<button className={`main-d-gray-btn w-100 rounded-5 my-3 ${stars == rate?.score ? "disabled" : ""}`} onClick={handleAddRating}>Rate</button>

					</div>
					{
						rate?.score
						?
							<button className='bg-transparent color-r fw-bold py-0' onClick={deleteRating}>Remove Rate</button>	
						:''
					}	
				</div>
			</div>
		</>
	)
}

export default RateContentComp
