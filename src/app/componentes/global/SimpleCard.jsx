"use client"
import Link from 'next/link';
import React from 'react'
import { FaStar } from 'react-icons/fa6';

const SimpleCard = ({ data }) => {
	const { id, title, image, cNum= null, rating= null, style="" } = data;
	return (
		<div className={style}>
			<div className='simple-card b-g-d2 position-relative overflow-hidden'>
				{
					cNum &&
					<span className='card-num position-absolute top-0 start-0 color-l fw-bold mb-2 d-flex w-f-c'> 
						<span className='position-relative'>#{cNum}</span>
					</span>
				}
				<Link href={`/details/${id}`} className='d-flex w-100'>
					<img src={image} alt={title} className='w-100 h-100' />
				</Link>
				<div className='p-3'>
					{
						rating
						?
							<div className='d-flex align-items-center gap-4 mb-3'>
								<div className='d-flex align-items-center gap-1'>
									<FaStar size={14} className='color-yd'/>
									<span className='color-gd color-g fw-semibold'>{rating.all != 0 ? Number(rating.all).toFixed(1) : "No Rating"}</span>
								</div>
								{
									rating.me !== null
									?
										<div className='d-flex align-items-center gap-1'>
											<FaStar size={14} className='color-r'/>
											<span className='color-gd color-g fw-semibold'>{Number(rating.me)}</span>
										</div>
									:''
								}
							</div>
						:''
					}
					<h5 className='small color-l mb-0'>{title.length > 14 ? title.slice(0, 14) + '..' : title}</h5>
				</div>
			</div>
			
		</div>
	)
}

export default SimpleCard
