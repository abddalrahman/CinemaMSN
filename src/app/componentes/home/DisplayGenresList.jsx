"use client"
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import GenreCard from '../global/GenreCard'
import { fetchAPIFunc } from '@/utils/clientRandomFunc'
import { A11y, Navigation } from 'swiper/modules'
import { Spinner } from 'react-bootstrap'
import { DomainPath } from '@/utils/DomainPath'

const DisplayGenresList = ({ data }) => {
	const [interestsData, setInterestsData] = useState([]);
	const [loading, setLoading] = useState(false);
	
	const getInterestsData = async () => {
		if (data === null) return ;
		try {
			setLoading(true);
			const response = await fetchAPIFunc(`${DomainPath}/api/users/activity/userInterests`, "GET", {});
			const result = await response.json();
			if (response.status === 200) {
				setInterestsData([...result.map((item) => Number(item.genre_id))]);
				setLoading(false);
				return ;
			} else {
				setLoading(false);
				setInterestsData([]);
				return ;
			}	
		} catch (error) {
			console.log(error);
			setLoading(false);
			setInterestsData([]);
			return ;
		}
	}
	
	useEffect(() => {
		const run = async () => {
			await getInterestsData();
		}
		run();
	}, [data]);

	if (data !== null) {
		return (
			<div className='w-100 mt-3'>
				{
					loading
					?
						<div className='p-5 d-flex align-items-center justify-content-center'>
							<Spinner animation="border" variant="danger" />
						</div>
					:
						<Swiper className='genres-cards w-100 h-100'
							modules={[Navigation, A11y]} spaceBetween={20} slidesPerView={4} navigation 
							// key={languageIs} // key to make swiper rebuild itself --> when key change
							// dir={languageIs == 'ar' ? 'rtl' : 'ltr'}
							breakpoints={{
								0: {
									slidesPerView: 1,
								},
								765: {
									slidesPerView: 2,
								},
								1200: {
									slidesPerView: 3,
								},
								1400: {
									slidesPerView: 4,
								}
							}}
						>
							{
								data.map((gen) => (
									<SwiperSlide key={gen.genre_id}>
										<GenreCard data={{ id: gen.genre_id, gName: gen.name, desc: gen.description, interest: interestsData.includes(Number(gen.genre_id)), 
											updateinterest: getInterestsData
										}}/>
									</SwiperSlide>
								))
							}
						</Swiper>
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

export default DisplayGenresList
