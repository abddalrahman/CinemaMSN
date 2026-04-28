import Link from 'next/link'
import React from 'react'
import { RiArrowRightSLine } from "react-icons/ri";

const ManagementSections = () => {
	return (
		<div className='row row-gap-4'>
			<div className='col-12 col-sm-6 col-lg-4'>
				<div className='manag-section rounded-2 overflow-hidden'>
					<div className='rounded-top-2 overflow-hidden'>
						<img src="/images/manage-content.jpg" alt="Manage Content" />
					</div>
					<div className='rounded-bottom-2 d-flex align-items-end justify-content-between gap-3 b-g-d3 p-4 overflow-hidden'>
						<div>
							<h5 className='color-l fw-bold'>Manage Content</h5>
							<p className='mb-0 color-g fw-medium'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. In facere accusantium quasi rem praesentium quidem nemo fugit asperiores maiores nostrum.</p>
						</div>
						<Link href={'/dashboard/content'}><RiArrowRightSLine size={30}/></Link>
					</div>
				</div>
			</div>
			<div className='col-12 col-sm-6 col-lg-4'>
				<div className='manag-section rounded-2 overflow-hidden'>
					<div className='rounded-top-2 overflow-hidden'>
						<img src="/images/people.jpg" alt="Manage People" />
					</div>
					<div className='rounded-bottom-2 d-flex align-items-end justify-content-between gap-3 b-g-d3 p-4 overflow-hidden'>
						<div>
							<h5 className='color-l fw-bold'>Manage People</h5>
							<p className='mb-0 color-g fw-medium'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. In facere accusantium quasi rem praesentium quidem nemo fugit asperiores maiores nostrum.</p>
						</div>
						<Link href={'/dashboard/people'}><RiArrowRightSLine size={30}/></Link>
					</div>
				</div>
			</div>
			<div className='col-12 col-sm-6 col-lg-4'>
				<div className='manag-section rounded-2 overflow-hidden'>
					<div className='rounded-top-2 overflow-hidden'>
						<img src="/images/users.webp" alt="Manage Users" />
					</div>
					<div className='rounded-bottom-2 d-flex align-items-end justify-content-between gap-3 b-g-d3 p-4 overflow-hidden'>
						<div>
							<h5 className='color-l fw-bold'>Manage Users</h5>
							<p className='mb-0 color-g fw-medium'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. In facere accusantium quasi rem praesentium quidem nemo fugit asperiores maiores nostrum.</p>
						</div>
						<Link href={'/dashboard/users'}><RiArrowRightSLine size={30}/></Link>
					</div>
				</div>
			</div>
			<div className='col-12 col-sm-6 col-lg-4'>
				<div className='manag-section rounded-2 overflow-hidden'>
					<div className='rounded-top-2 overflow-hidden'>
						<img src="/images/genres.jpg" alt="Manage Genres" />
					</div>
					<div className='rounded-bottom-2 d-flex align-items-end justify-content-between gap-3 b-g-d3 p-4 overflow-hidden'>
						<div>
							<h5 className='color-l fw-bold'>Manage Genres</h5>
							<p className='mb-0 color-g fw-medium'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. In facere accusantium quasi rem praesentium quidem nemo fugit asperiores maiores nostrum.</p>
						</div>
						<Link href={'/dashboard/genres'}><RiArrowRightSLine size={30}/></Link>
					</div>
				</div>
			</div>
			<div className='col-12 col-sm-6 col-lg-4'>
				<div className='manag-section rounded-2 overflow-hidden'>
					<div className='rounded-top-2 overflow-hidden'>
						<img src="/images/comment-manage.jpg" alt="Manage Comments" />
					</div>
					<div className='rounded-bottom-2 d-flex align-items-end justify-content-between gap-3 b-g-d3 p-4 overflow-hidden'>
						<div>
							<h5 className='color-l fw-bold'>Manage Comments</h5>
							<p className='mb-0 color-g fw-medium'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. In facere accusantium quasi rem praesentium quidem nemo fugit asperiores maiores nostrum.</p>
						</div>
						<Link href={'/dashboard/comments'}><RiArrowRightSLine size={30}/></Link>
					</div>
				</div>
			</div>
			<div className='col-12 col-sm-6 col-lg-4'>
				<div className='manag-section rounded-2 overflow-hidden'>
					<div className='rounded-top-2 overflow-hidden'>
						<img src="/images/news.jpg" alt="Manage News" />
					</div>
					<div className='rounded-bottom-2 d-flex align-items-end justify-content-between gap-3 b-g-d3 p-4 overflow-hidden'>
						<div>
							<h5 className='color-l fw-bold'>Manage News</h5>
							<p className='mb-0 color-g fw-medium'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. In facere accusantium quasi rem praesentium quidem nemo fugit asperiores maiores nostrum.</p>
						</div>
						<Link href={'/dashboard/news'}><RiArrowRightSLine size={30}/></Link>
					</div>
				</div>
			</div>
			<div className='col-12 col-sm-6 col-lg-4'>
				<div className='manag-section rounded-2 overflow-hidden'>
					<div className='rounded-top-2 overflow-hidden'>
						<img src="/images/messages.jpg" alt="Manage messages" />
					</div>
					<div className='rounded-bottom-2 d-flex align-items-end justify-content-between gap-3 b-g-d3 p-4 overflow-hidden'>
						<div>
							<h5 className='color-l fw-bold'>Manage Messages</h5>
							<p className='mb-0 color-g fw-medium'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. In facere accusantium quasi rem praesentium quidem nemo fugit asperiores maiores nostrum.</p>
						</div>
						<Link href={'/dashboard/messages'}><RiArrowRightSLine size={30}/></Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ManagementSections
