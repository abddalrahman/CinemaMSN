import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from "react-icons/fa6";
import { formatDistance } from 'date-fns';

const RecentPeople = ({ data }) => {
	if (data === 0) {
		return (
			<div className=' d-flex align-items-center justify-content-center'>
				Failed To Get Recently Added People
			</div>
		)
	}

	const people = data.data;
	return (
		<div className='col-12 col-lg-6'>
			<div className='recent-people d-flex flex-column overflow-hidden mb-4'>
				<div className='recent-top d-flex align-items-center p-3 b-g-d3'>
					<FaStar className='color-r'/>
					<span className='ms-2 color-l fw-bold'>Recently Added People</span>
				</div>
				<ul className='mb-0'>
					{
						people.length > 0
						?
							people.map((person)=>(
								<li key={person.person_id}>
									<Link href={`/personD/${person.person_id}`} className='d-flex align-items-center justify-content-between p-3 b-g-d2'>
										<div className=' d-flex align-items-center'>
											<img src={person.image_url} alt={person.p_name} style={{width: '55px', height: '80px'}} priority className='rounded-2'/>
											<div className='ms-3'>
												<h5 className='color-l fw-semibold fs-md'>{person.p_name}</h5>
												<span className='color-g fs-main'>{person.birth_date || "Unknown Birth Date"}</span>
											</div>
										</div>
										<span className='color-dg fw-medium fs-sm'>{formatDistance(new Date(person.created_at), new Date(), { addSuffix: true })}</span>
									</Link>
								</li>
							))
						:
							<li className='d-flex align-items-center p-3 b-g-d2'>No Person to Display</li>
					}
				</ul>
			</div>
		</div>
	)
}

export default RecentPeople