import React from 'react'
import { FaUser, FaStar } from "react-icons/fa";
import { MdMovie } from "react-icons/md";
import { RiNewsFill } from "react-icons/ri";

const Statistic = ({ data }) => {
	if (data === 0) {
		return (
			<div className=' d-flex align-items-center justify-content-center'>
				No Statistic To Show
			</div>
		)

	}
	return (
		<div className='row'>
			<div className='col-6 col-md-4 col-lg-3 mb-4 statisic-card'>
				<div className='d-flex flex-column gap-3 b-g-d3 p-3 p-md-4 align-items-center rounded-2'>
					<FaUser size={40} className='color-yd'/>
					<h5 className='mb-0 fw-semibold fs-xxl color-l text-center'>Total Users</h5>
					<span className='fw-bold fs-xxl color-l'>{data.total_users}</span>
				</div>
			</div>
			<div className='col-6 col-md-4 col-lg-3 mb-4 statisic-card'>
				<div className='d-flex flex-column gap-3 b-g-d3 p-3 p-md-4 align-items-center rounded-2'>
					<RiNewsFill size={40} className='color-dg'/>
					<h5 className='mb-0 fw-semibold fs-xxl color-l text-center'>Total News</h5>
					<span className='fw-bold fs-xxl color-l'>{data.total_news}</span>
				</div>
			</div>
			<div className='col-6 col-md-4 col-lg-3 mb-4 statisic-card'>
				<div className='d-flex flex-column gap-3 b-g-d3 p-3 p-md-4 align-items-center rounded-2'>
					<FaStar size={40} className='color-y'/>
					<h5 className='mb-0 fw-semibold fs-xxl color-l text-center'>Total People</h5>
					<span className='fw-bold fs-xxl color-l'>{data.total_people}</span>
				</div>
			</div>
			<div className='col-6 col-md-4 col-lg-3 mb-4 statisic-card'>
				<div className='d-flex flex-column gap-3 b-g-d3 p-3 p-md-4 align-items-center rounded-2'>
					<MdMovie size={40} className='color-r'/>
					<h5 className='mb-0 fw-semibold fs-xxl color-l text-center'>Total Content</h5>
					<span className='fw-bold fs-xxl color-l'>{data.total_content}</span>
				</div>
			</div>
		</div>
	)
}

export default Statistic
