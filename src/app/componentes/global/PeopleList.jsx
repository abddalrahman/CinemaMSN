"use client"
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import PersonCard from './PersonCard'
import { A11y, Navigation } from 'swiper/modules'
import { fetchAPIFunc } from '@/utils/clientRandomFunc'
import { DomainPath } from '@/utils/DomainPath'


const PeopleList = ({ data, notSwip= null, cardStyle="col-6 col-sm-3 mb-4" }) => {
	const [favoriteData, setFavoriteData] = useState([]);
	const [loading, setLoading] = useState(false);
	
	const getfavoriteData = async () => {
		if (data === null) return ;
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
	}, [data]);

	if (data !== null && notSwip === null) {
		return (
			<div className='w-100 mt-3'>
				<Swiper className='people-cards w-100 h-100'
					modules={[Navigation, A11y]} spaceBetween={20} slidesPerView={6} navigation 
					// key={languageIs} // key to make swiper rebuild itself --> when key change
					// dir={languageIs == 'ar' ? 'rtl' : 'ltr'}
					breakpoints={{
						0: {
							slidesPerView: 2,
						},
						575: {
							slidesPerView: 3,
						},
						765: {
							slidesPerView: 4,
						},
						991: {
							slidesPerView: 5,
						},
						1200: {
							slidesPerView: 6,
						}
					}}
				>
					{
						data.map((person) => (
							<SwiperSlide key={person.person_id}>
								<PersonCard data={{
									id: person.person_id, pName: person.p_name, image: person.image_url, favorite: favoriteData.includes(Number(person.person_id)), 
									updateFavorite: getfavoriteData
								}}/>
							</SwiperSlide>
						))
					}
				</Swiper>
			</div>
		)
	} else if (data !== null && notSwip !== null) {
		return (
			<div className='row'>
				{
					data.map((person) => (
						<PersonCard key={person.person_id} data={{
							id: person.person_id, pName: person.p_name, image: person.image_url, favorite: favoriteData.includes(Number(person.person_id)), 
							updateFavorite: getfavoriteData, style: cardStyle
						}}/>
					))
				}
			</div>
		)

	} else {
		return (
			<div className='p-4 b-g-d3 rounded-1'>
				No Data Available
			</div>
		)
	}
}

export default PeopleList
