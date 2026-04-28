"use client"
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { DomainPath } from '@/utils/DomainPath';
import Link from 'next/link';
import React, { useState } from 'react'
import { IoCheckmark } from 'react-icons/io5';
import { MdAdd } from 'react-icons/md';
import { toast } from 'react-toastify';

const GenreCard = ({ data }) => {
	const {id, gName, desc, interest, updateinterest} = data;
	const [loading, setLoading] = useState(false);

	const handleInterestAction = async () => {
		try {
			setLoading(true);
			const dataToSend = {genre_id: Number(id)};
			const response = await fetchAPIFunc(`${DomainPath}/api/users/activity/userInterests`, "POST", dataToSend);
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
				await updateinterest();
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
		<div>
			<div className='genre-card w-100 d-flex flex-column p-3'>
				<Link href={`/content?genre=${id}`} className='w-100'>
					<h5 className='color-l fs-4 fw-medium fs-6 mb-3'>{gName}</h5>
				</Link>
				<p className='color-l'>{desc.length > 100 ? desc.slice(0, 100) + '...' : desc}</p>
				<button className={`bg-transparent border-0 c-p mt-auto w-f-c p-0 d-flex align-items-center gap-2 ${loading ? "disabled" : ""} 
					${interest ? "color-y" : "color-r"}`} 
					onClick={handleInterestAction}
				>
					{interest ? <IoCheckmark size={24}/> : <MdAdd size={24} />}
					<span>{interest ? "Added" : "Add"}</span>
				</button>
			</div>
		</div>
	)
}

export default GenreCard
