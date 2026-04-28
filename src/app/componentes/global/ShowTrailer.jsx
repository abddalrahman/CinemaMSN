"use client"
import React, { useEffect, useRef } from 'react'
import { MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';

const ShowTrailer = ({ data }) => {
	const {title, vUrl, closeFunc} = data
	const videoDiv = useRef();
	
	useEffect(() => {
		if (!title || !vUrl || vUrl.replace("No Data", "") === "") {
			toast.error("No Trailer Available");
			closeFunc({
				show: false,
				title: "",
				url: ""
			})
		}
		setTimeout(() => {
			videoDiv.current?.classList.add("show");
		}, 50);
	}, [videoDiv])
	
	
	if (!title || !vUrl || vUrl.replace("No Data", "") === "") return null;
	return (
		<div className='show-trailer position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'>
			<div ref={videoDiv} className='p-3 rounded-1'>
				<div className='d-flex align-items-center justify-content-between'>
					<h2 className='color-y fw-semibold'>{title}</h2>
					<MdClose size={22} className='c-p color-l' onClick={() => {
						videoDiv.current.classList.remove("show");
						setTimeout(() => {
								closeFunc({
									show: false,
									title: "",
									url: ""
								})
						}, 200);
					}}/>
				</div>
				<video src={vUrl} controls className='w-100'/>
			</div>
		</div>
	)
}

export default ShowTrailer
