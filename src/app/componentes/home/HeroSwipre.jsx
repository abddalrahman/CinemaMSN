"use client"
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Autoplay } from 'swiper/modules';
import BasicLink from '../global/smallComp/BasicLink';
import { GoPlay } from "react-icons/go";
import { TbListDetails } from "react-icons/tb";
import { RiMovieFill } from "react-icons/ri";
import { IoTvSharp } from "react-icons/io5";
import { CalcTime } from '@/utils/clientRandomFunc';
import ShowTrailer from '../global/ShowTrailer';

const HeroSwipre = ({ data }) => {
	const [showTr, setShowTr] = useState({
		show: false,
		title: "",
		url: ""
	})
	return (
		<>
			{
				showTr.show 
				?
					<ShowTrailer data={{title: showTr.title, vUrl: showTr.url, closeFunc: setShowTr}}/>
				: ''
			}
			<Swiper className='hero-swip w-100 h-100'
				modules={[Navigation, A11y, Autoplay]} spaceBetween={35} slidesPerView={5} navigation loop={true} autoplay={{
					delay: 3000,
    			disableOnInteraction: false,
			    pauseOnMouseEnter: true
				}} 
				// key={languageIs} // key to make swiper rebuild itself --> when key change
				// dir={languageIs == 'ar' ? 'rtl' : 'ltr'}
				breakpoints={{
					0: {
						slidesPerView: 1,
					}
				}}
			>
				{
					data.map((content, index)=>(
						<SwiperSlide key={index} className='hero-slide position-relative w-100 h-100'>
							<img src={content.file_url} alt={content.title}/>
							<div className='position-absolute h-100 d-flex align-items-center justify-content-between gap-5'>
								<div className='d-flex flex-column gap-3'>
									<span className='color-r text-uppercase fw-bold w-f-c py-2 px-4 position-relative'><b>upcoming</b></span>
									<h2 className='fw-bold color-l fs-vxl'>{content.title}</h2>
									<div className='d-flex align-items-center gap-2 w-f-c'>
										{content.content_type == "M" ? <div className='b-g-gd color-l py-1 px-2 w-f-c'><RiMovieFill/> <span>Movie</span></div> : 
											<div className='b-g-gd color-l py-1 px-2 w-f-c'><IoTvSharp/> <span>Series</span></div>
										}
										<span className='color-g small ms-3'>{CalcTime(content.duration_minutes)}</span>
									</div>
									<p className='color-l fw-semibold opacity-75 fs-main'>{content.summary}</p>
									<div className='d-flex align-items-center gap-3'>
										<BasicLink data={{ icon: TbListDetails, To: "/", size: 20, label: 'Details', To:`/details/${content.content_id}`, 
											styling:"main-red-btn w-f-c py-2 px-3 text-uppercase letter-spacing-1"}}
										/>
										<button className='d-flex align-items-center gap-2 main-d-gray-btn d-lg-none py-2 px-3'onClick={() => setShowTr({
											show: true,
											title: content.title,
											url: content.trailer_url
										})}>
											<GoPlay size={20}/>
											<span className='text-capitalize'>Trailer</span>
										</button>
									</div>
								</div>
								<div className='color-l d-none d-lg-flex align-items-center gap-3 fw-bold text-uppercase justify-content-center run-trailer'>
									<div className='w-f-c d-flex align-items-center gap-3 c-p' onClick={() => setShowTr({
										show: true,
										title: content.title,
										url: content.trailer_url
									})}>
										<GoPlay size={80}/>
										<span className='text-capitalize fs-2'>watch trailer</span>
									</div>
								</div>
							</div>
						</SwiperSlide>
					))
				}
			</Swiper>
		</>
	)
}

export default HeroSwipre