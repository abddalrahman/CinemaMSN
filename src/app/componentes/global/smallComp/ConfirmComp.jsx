"use client"
import React, { useEffect, useRef } from 'react'

const ConfirmComp = ({ data, callFuncs }) => {
	const {confirmFunc, cansleFunc} = callFuncs;
	const confirmDiv = useRef();
	useEffect(() => {
		setTimeout(() => {
			confirmDiv.current.classList.add("show");
		}, 100);
	}, [])
	return (
		<div className='confirm-container d-flex align-items-center justify-content-around'>
			<div ref={confirmDiv} className={data.bg === "d" ? 'b-g-d3' : data.bg === "g" ? 'b-g-gd' : 'b-g-l'}>
				<h3 className={data.bg === "l" ? "color-dg mb-3 fw-bold" : "color-l mb-3 fw-bold"}>{data.title}</h3>
				<p className={data.bg === "l" ? "color-dg mb-5 fw-medium" : "color-l opacity-75 mb-5 fw-medium"}>{data.body}</p>
				<div className='d-flex gap-3'>
					<span className={data.bg === "l" ? "main-d-gray-btn" : data.bg === "g" ? "main-light-btn" : "main-gray-btn"} onClick={cansleFunc}>
						{data.noBtn}
					</span>
					<span className={data.bg === "r" ? "main-d-gray-btn" : "main-red-btn"} onClick={confirmFunc}>{data.yesBtn}</span>
				</div>
			</div>
		</div>
	)
}

export default ConfirmComp
