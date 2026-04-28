"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { FaStar } from "react-icons/fa6";
import { MdAdd, MdInfoOutline } from 'react-icons/md';
import { FaPlay } from "react-icons/fa";
import { toast } from 'react-toastify';
import { addWatchListAndWatched } from '@/utils/zodValidations';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { TbEyeCheck } from "react-icons/tb";
import { IoCheckmark } from "react-icons/io5";
import { DomainPath } from '@/utils/DomainPath';

const ContentCard = ({ data, setShowTr }) => {
	const {id, title, image, rating, trailer, watching, watched, updateWatching, style= ""} = data;
	const [loading, setLoading] = useState(false);
	
	const handleWatchAction = async (status) => {
		try {
			setLoading(true);
			const dataToSend = {content_id: Number(id), wl_status: status};
			const validation = addWatchListAndWatched.safeParse(dataToSend);
			if (!validation.success) {
				setLoading(false);
				return toast.error("Data Form Issue");
			}
			const response = await fetchAPIFunc(`${DomainPath}/api/users/activity/userWatching`, "POST", dataToSend);
			const result = await response.json();
			if (response.status !== 201 && response.status !== 200) {
				if (response.status === 401) {
					toast.error("you have to Login and activate your account");
				} else if (response.status === 403) {
					toast.error(result.message);
				} else {
					toast.error("Something Went Wrong Try Again");
				}
			} else {
				await updateWatching();
			}
			setLoading(false);
			return;
		} catch (error) {
			setLoading(false);
			console.log(error);
			return toast.error("Something Went Wrong Try Again");
		}
	}

	return (
		<div className={`${style}`}>
			<div className='overflow-hidden b-g-d2 position-relative content-card'>
				<Link href={`/details/${id}`} className='w-100 d-flex'>
					<img src={image} alt={title} className='w-100 h-100' />
				</Link>
				<div className='px-2 py-3'>
					{
						<div className='d-flex align-items-center gap-2 mb-2 mb-lg-3'>
							<FaStar size={14} className='color-yd'/>
							<span className='color-gd color-g fw-semibold fs-main'>{rating != 0 ? Number(rating).toFixed(1) : "No Rating"}</span>
						</div>
					}
					<h5 className='color-l fw-semibold fs-md text-capitalize mb-2 mb-lg-3'>{title.length > 30 ? title.slice(0, 30) + '..' : title}</h5>
					{
						watched
						?
							<button className={`w-l-btn w-100 d-flex align-items-center gap-2 justify-content-center color-l py-2 fw-bold
								${loading ? "disabled" : ""}`} disabled={loading}
								onClick={() => handleWatchAction("watched")}
							>
								<TbEyeCheck size={24}/> <span>Watched</span>
							</button>
						:
							<button className={`w-l-btn w-100 d-flex align-items-center gap-2 justify-content-center color-l py-2 fw-bold 
								${watching ? "active" : ""} ${loading ? "disabled" : ""}`} 
								onClick={() => handleWatchAction("queued")} disabled={loading}
							>
								{watching ? <IoCheckmark size={22}/> : <MdAdd size={22}/>} <span className='fs-main'>WatchList</span>
							</button>
					}
					<div className='d-flex align-items-center justify-content-between px-2 pb-0 pb-lg-2 mt-2 mt-lg-3 color-l'>
						<div className=' d-flex align-items-center gap-2 c-p open-trailer p-2' onClick={(() => setShowTr({
							show: true,
							title: title,
							url: data.trailer
						}))}>
							<FaPlay size={12}/> <span className='fw-bold'>Trailer</span>
						</div>
						<Link href={`/details/${id}`} className='d-flex align-items-center gap-2 color-l go-details p-2'>
							<MdInfoOutline size={22}/>
						</Link>
					</div>
				</div>
			</div>

		</div>
	)
}

export default ContentCard
