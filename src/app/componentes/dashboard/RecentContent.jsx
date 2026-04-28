import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { MdMovie } from "react-icons/md";
import { formatDistance } from 'date-fns';

const RecentContent = ({ data }) => {
	if (data === 0) {
		return (
			<div className=' d-flex align-items-center justify-content-center'>
				Failed To Get Recently Added Content
			</div>
		)
	}

	const contents = data.data;
	return (
		<div className='col-12 col-lg-6'>
			<div className='recent-content d-flex flex-column overflow-hidden mb-4'>
				<div className='recent-top d-flex align-items-center p-3 b-g-d3'>
					<MdMovie className='color-r'/>
					<span className='ms-2 color-l fw-bold'>Recently Added Content</span>
				</div>
				<ul className='mb-0'>
					{
						contents.length > 0
						?
							contents.map((content)=>(
								<li key={content.content_id}>
									<Link href={`/details/${content.content_id}`} className='d-flex align-items-center justify-content-between p-3 b-g-d2'>
										<div className=' d-flex align-items-center'>
											<img src={content.poster_url} alt={content.title} style={{width: '50px', height: '80px'}} className='rounded-2'/>
											<div className='ms-3'>
												<h5 className='color-l fw-semibold fs-md'>{content.title}</h5>
												<span className='color-dg fw-medium fs-main'>{formatDistance(new Date(content.created_at), new Date(), { addSuffix: true })}</span>
											</div>
										</div>
										<span className={`fs-sm fw-bold r-op-bg ${content.c_status == "upcoming" ? "color-gr" : content.c_status == "hidden" ? "color-r" : "color-y"}`}>
											{content.c_status}
										</span>
									</Link>
								</li>
							))
						:
							<li className='d-flex align-items-center p-3 b-g-d2'>No Comment to Display</li>
					}
				</ul>
			</div>
		</div>
	)
}

export default RecentContent
