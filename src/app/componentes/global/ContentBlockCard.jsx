import { CalcTime } from '@/utils/clientRandomFunc'
import Link from 'next/link';
import React from 'react'
import { FaStar } from 'react-icons/fa6'
import { LuInfo } from "react-icons/lu";

const ContentBlockCard = ({ data }) => {
	return (
		<div className='block-content-card d-flex align-items-center justify-content-between p-2'>
			<div className='d-flex align-items-center gap-3'>
				<img src={data.poster_url} alt={data.title} className='rounded-1'/>
				<div className='d-flex flex-column justify-content-between'>
					<h5 className='fs-main mb-0 color-l fw-bold'>{data.title}</h5>
					<div className='d-flex fs-sm align-items-center gap-2 color-g'>
						<FaStar size={14} className='color-y'/> <span>{data.average_rating == 0 ? "Not Rated" :Number(data.average_rating).toFixed(1)}</span>
					</div>
					<div className='d-flex align-items-center color-g fs-sm gap-2'>
						<span>{data.content_type == "M" ? "Moview" : "TV Series"}</span> <span>{CalcTime(data.duration_minutes, true)}</span>
					</div>
				</div>
			</div>
			<div className='d-flex align-items-center gap-3'>
				<div className='d-flex flex-column gap-2 color-l'>
					<span className='fw-semibold fs-sm'>{data.release_year}</span>
					{
						data.content_type == "S" 
						?
							<span className='fw-bold color-r fs-sm'>{data.episodes_count + "eps"}</span>
						:""
					}
				</div>
				<Link href={`/details/${data.content_id}`}><LuInfo size={22} className='color-l'/></Link>
			</div>
		</div>
	)
}

export default ContentBlockCard
