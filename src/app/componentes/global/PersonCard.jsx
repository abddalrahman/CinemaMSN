"use client"
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { DomainPath } from '@/utils/DomainPath';
import Link from 'next/link'
import React, { useState } from 'react'
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { toast } from 'react-toastify';

const PersonCard = ({ data }) => {
	const {id, pName, image, favorite, updateFavorite, style= "", myProfile= true} = data
	const [loading, setLoading] = useState(false);

	const handleFavoriteAction = async () => {
		try {
			setLoading(true);
			const dataToSend = {person_id: Number(id)};
			const response = await fetchAPIFunc(`${DomainPath}/api/users/activity/userFavorite`, "POST", dataToSend);
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
				await updateFavorite();
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
			<div className='person-card w-100 d-flex flex-column'>
				<div className='position-relative w-100'>
					<Link href={`/personD/${id}`} className='w-100 person-img position-relative overflow-hidden rounded-circle d-block'>
						<img src={image} alt={pName} className=' position-absolute top-0 start-0 w-100 h-100 object-fit-cover' />
					</Link>
					{
						myProfile
						?
							<span className={`position-absolute favorite-btn c-p ${loading ? "disabled" : ""}`} onClick={handleFavoriteAction}>
								{favorite ? <FaHeart size={24} className='color-r'/> : <FaRegHeart size={24} className='color-l'/>}
							</span>
						: ''
					}
				</div>
				<h5 className='text-center color-l fw-medium fs-6 mt-4'>{pName}</h5>
			</div>
		</div>
	)
}

export default PersonCard
