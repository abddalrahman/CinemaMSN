"use client"
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { DomainPath } from '@/utils/DomainPath';
import React, { useEffect, useState } from 'react'
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { toast } from 'react-toastify';

const PersonImageWithFavBtn = ({id, name, imgUrl, style= ""}) => {
	const [loading, setLoading] = useState(false);
	const [favoriteData, setFavoriteData] = useState([]);
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
				await getfavoriteData();
			}
			setLoading(false);
			return;
		} catch (error) {
			setLoading(false);
			console.log(error);
			return toast.error("Something Went Wrong Try Again");
		}
	}

	const getfavoriteData = async () => {
		try {
			setLoading(true);
			const response = await fetchAPIFunc(`${DomainPath}/api/users/activity/userFavorite`, "GET", {});
			const result = await response.json();
			if (response.status === 200) {
				setFavoriteData([...result.map((item) => Number(item.person_id))]);
				setLoading(false);
				return ;
			} else {
				setLoading(false);
				setFavoriteData([]);
				return ;
			}	
		} catch (error) {
			console.log(error);
			setLoading(false);
			setFavoriteData([]);
			return ;
		}
	}
	
	useEffect(() => {
		const run = async () => {
			await getfavoriteData();
		}
		run();
	}, []);
	
	return (
		<div className={`${style}`}>
			<div className='p-img-with-fav-btn position-relative'>
				<img src={imgUrl} alt={name} />
				<button className={`d-flex align-items-center justify-content-center position-absolute rounded-circle b-g-d4 ${loading ? "disabled" : ""}`} 
					onClick={loading ? null : handleFavoriteAction}
				>
					{favoriteData.includes(Number(id)) 
					? 
						<FaHeart size={24} className='color-r flex-shrink-0'/> 
					: 
						<FaRegHeart size={24} className='color-r flex-shrink-0'/>}
				</button>
			</div>
		</div>
	)
}

export default PersonImageWithFavBtn
