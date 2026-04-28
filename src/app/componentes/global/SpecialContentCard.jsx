"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { FaStar } from "react-icons/fa6";
import { MdAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import { addWatchListAndWatched } from '@/utils/zodValidations';
import { CalcTime, fetchAPIFunc } from '@/utils/clientRandomFunc';
import { TbEyeCheck } from "react-icons/tb";
import { IoCheckmark, IoTvSharp } from "react-icons/io5";
import { RiMovieFill } from "react-icons/ri";
import { DomainPath } from '@/utils/DomainPath';

const SpecialContentCard = ({ data, cNum }) => {
	const {id, title, body, image, duration, year, eps, type, rating, watching, watched, updateWatching} = data;
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
		<div className={`${cNum == 1 ? "big-card" : ""}`}>
			<div className='overflow-hidden position-relative content-card special-card p-3 d-flex flex-column gap-3'>
				<div className='d-flex gap-3'>
					<Link href={`/details/${id}`} className='d-flex'>
						<img src={image} alt={title} className='w-100 h-100' />
					</Link>
					<div className='card-info'>
						<span className='card-num position-relative color-l fw-bold mb-2 d-flex w-f-c'> <span className='position-relative'>#{cNum}</span></span>
						<h5 className='color-l fw-bold fs-md text-capitalize mb-3'>{title}</h5>
						<div className='d-flex align-items-center gap-3 color-g fw-semibold mb-2 fs-main'>
							<span>{year}</span> 
							<span>{type == "M" ? CalcTime(duration) : eps + " eps"}</span>
							<span>{type == "M" ? <RiMovieFill/> : <IoTvSharp/>}</span>
						</div>
						<div className='d-flex align-items-center gap-2 fs-main'>
							<FaStar size={14} className='color-yd'/>
							<span className='color-gd color-g fw-semibold'>{rating != 0 ? Number(rating).toFixed(1) : "No Rating"}</span>
						</div>
						{
							watched
							?
								<button className={`d-flex align-items-center fs-main gap-2 color-r fw-bold bg-transparent p-0 my-3
									${loading ? "disabled" : ""}`} disabled={loading}
									onClick={() => handleWatchAction("watched")}
								>
									<TbEyeCheck size={24}/> <span>Watched</span>
								</button>
							:
								<button className={`d-flex align-items-center gap-2 fs-main color-r fw-bold bg-transparent p-0 my-3 ${loading ? "disabled" : ""}`} 
									onClick={() => handleWatchAction("queued")} disabled={loading}
								>
									{watching ? <IoCheckmark size={24}/> : <MdAdd size={24}/>} <span>WatchList</span>
								</button>
						}
						{
							cNum == 1 && <p className='color-g fs-main fw-semibold'>{body.length > 90 ? body.slice(0, 90) + '...' : body}</p>
						}
					</div>
				</div>
				{
					cNum != 1 && <p className='color-g fs-main fw-semibold'>{body.length > 170 ? body.slice(0, 170) + '...' : body}</p>
				}
			</div>

		</div>
	)
}

export default SpecialContentCard
