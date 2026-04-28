import { calcAge } from '@/utils/clientRandomFunc';
import Link from 'next/link'
import React from 'react'

const NewsCard = ({ data }) => {
	const {id, title, body, image, date, aboutM, aboutS, aboutP, style=''} = data;
	const aboutStr = [aboutM, aboutS, aboutP].filter((itme) => itme !== false).join(' - ');
	return (
		<div className={`w-100 news-card ${style}`}>
			<Link href={`/news/${id}`} className='d-flex gap-3 h-100'>
				{
					image && image.replace("No Data", "") !== ""
					?
						<div className='news-card-image h-100'>
							<img src={image} alt={title} className='w-100 rounded-3 h-100' />
						</div>
					:''
				}
				<div className='other-news-info h-f-c'>
					<h5 className='fw-semibold color-l fs-main mb-0'>{title.length > 50 ? title.slice(0, 50) + '...' : title}</h5>
					<p className='color-g mb-2 fs-sm'>{body.length > 30 ? body.slice(0, 30) + '...' : body}</p>
					<div className='d-flex align-items-center fs-sm gap-3 color-dg fw-semibold'>
						<span className='news-date'>{ calcAge(date)}</span> <span>{aboutStr}</span>
					</div>
				</div>
			</Link>
		</div>
	)
}

export default NewsCard
