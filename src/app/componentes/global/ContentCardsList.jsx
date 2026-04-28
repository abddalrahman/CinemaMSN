"use client"
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import React, { useEffect, useState } from 'react'
import ContentCard from './ContentCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation } from 'swiper/modules';
import SpecialContentCard from './SpecialContentCard';
import SimpleCard from './SimpleCard';
import ShowTrailer from './ShowTrailer';
import { DomainPath } from '@/utils/DomainPath';


const ContentCardsList = ({ data, topTen= null, swiperSlids=null }) => {
	const [watchingData, setWatchingData] = useState({
		watchlist: [],
		watched: []
	});
	const [loading, setLoading] = useState(false);
	const [showTr, setShowTr] = useState({
		show: false,
		title: "",
		url: ""
	})
	
	const getWatchingData = async () => {
		if (data === null) return ;
		try {
			setLoading(true);
			const response = await fetchAPIFunc(`${DomainPath}/api/users/activity/userWatching`, "GET", {});
			const result = await response.json();
			if (response.status === 200) {
				setWatchingData({
					watchlist: result.filter((item) => item.wl_status === "queued").map((item) => Number(item.content_id)),
					watched: result.filter((item) => item.wl_status === "watched").map((item) => Number(item.content_id))
				});
				setLoading(false);
				return ;
			} else {
				setLoading(false);
				setWatchingData({
					watchlist: [],
					watched: []
				});
				return ;
			}	
		} catch (error) {
			console.log(error);
			setLoading(false);
			setWatchingData({
				watchlist: [],
				watched: []
			});
			return ;
		}
	}

	useEffect(() => {
		const run = async () => {
			await getWatchingData();
		}
		run();
	}, [data]);

	if (data && topTen === null) {
		if (swiperSlids === null) {
			return (
				<>
					{
						showTr.show
						?
							<ShowTrailer data={{title: showTr.title, vUrl: showTr.url, closeFunc: setShowTr}}/>
						:""
					}
					<div className='contents-row-cards contents-cards row'>
						{
							data.map((content) => (
								<ContentCard key={content.content_id} data={{
									id: content.content_id, title: content.title, image: content.poster_url, rating: content.average_rating, trailer: content.trailer_url, 
									watching: watchingData.watchlist.includes(Number(content.content_id)), watched: watchingData.watched.includes(Number(content.content_id)), 
									updateWatching: getWatchingData, style: "col-6 col-sm-4 col-lg-3 col-xl-2"
								}} setShowTr={setShowTr}/>
							))
						}
					</div>
				</>
			)
		} else{
			return (
				<>
					{
						showTr.show
						?
							<ShowTrailer data={{title: showTr.title, vUrl: showTr.url, closeFunc: setShowTr}}/>
						:""
					}
					<Swiper className='contents-cards w-100 h-100'
						modules={[Navigation, A11y]} spaceBetween={20} slidesPerView={swiperSlids} navigation 
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
								slidesPerView: swiperSlids === 4 ? 3 : 5,
							},
							1200: {
								slidesPerView: swiperSlids === 4 ? 4 : 6,
							}
						}}
					>
						{
							data.map((content) => (
								<SwiperSlide key={content.content_id}>
									<ContentCard data={{
										id: content.content_id, title: content.title, image: content.poster_url, rating: content.average_rating, trailer: content.trailer_url, 
										watching: watchingData.watchlist.includes(Number(content.content_id)), watched: watchingData.watched.includes(Number(content.content_id)), 
										updateWatching: getWatchingData
									}} setShowTr={setShowTr}/>
								</SwiperSlide>
							))
						}
					</Swiper>
				</>
			)
		}
		
	} else if (data && topTen ) {
		return (
			<>
				<div className='contents-cards flex-cards d-flex flex-wrap'>
					{
						data.slice(0, 3).map((content, index) => (
							<SpecialContentCard key={content.content_id} data={{
								id: content.content_id, title: content.title, body: content.summary, image: content.poster_url, duration: content.duration_minutes, 
								year: content.release_year, eps: content.episodes_count, type: content.content_type, rating: content.average_rating, 
								watching: watchingData.watchlist.includes(Number(content.content_id)), watched: watchingData.watched.includes(Number(content.content_id)), 
								updateWatching: getWatchingData
							}} cNum={index + 1}/>
						))
					}
				</div>
				<div className='contents-cards flex-simple-cards'>
					{
						data.slice(3, 10).map((content, index) => (
							<SimpleCard key={content.content_id} data={{id: content.content_id, title: content.title, image: content.poster_url, cNum: index + 4}} />
						))
					}
				</div>
			</>
		)
	} else {
		return (
			<div className='py-4'>
				<div className='p-4 b-g-d3 rounded-1'>
					No Data Available
				</div>
			</div>
		)
	}
}

export default ContentCardsList
