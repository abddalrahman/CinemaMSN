"use client"
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import React, { useEffect, useState } from 'react'
import SectionTitle from '../global/smallComp/SectionTitle';
import SimpleCard from '../global/SimpleCard';
import { Spinner } from 'react-bootstrap';
import { DomainPath } from '@/utils/DomainPath';

const DisplayProfileSections = ({ data }) => {
	const { title, myP, displayData, id, status } = data;
	const [loading, setLoading] = useState(false);
	const [content, setContent] = useState({
		data: null,
		dLength: 0
	});

	const getSectionData = async (type, limit= null) => {
		try {
			if (type === "Ratings" || type === "Watchlist" || type === "Watched") {
				setLoading(true);
				const respons = await fetchAPIFunc(`${DomainPath}/api/users/profile/getSectionsData?section=${type}&id=${id}${limit ? "&limited=t": ""}`, 
					"GET", {}
				);
				const result = await respons.json();
				if (respons.status === 200) {
					setContent({
						data: result.data,
						dLength: result.dataLength
					});
					setLoading(false);
				} else {
					setContent({
						data: undefined,
						dLength: 0
					});
					setLoading(false);
				}
			}
			
		} catch (error) {
			console.log(error);
			setContent({
				data: undefined,
				dLength: 0
			});
			setLoading(false);
		}
	}

	useEffect(() => {
		const run = async () => {
			if (displayData === "Ratings" || displayData === "Watchlist" || displayData === "Watched") {
				await getSectionData(displayData, true);
			}
		}
		run();
	}, [])
	
	
	
	return (
		<div className='mb-5 pb-5'>
			<div className='d-flex align-items-center gap-4'>
				<SectionTitle title={title} inHead={`${content.dLength}`}/>
				<span className='color-y fw-semibold mb-4'>{status ? "Private" : "Public"}</span>
			</div>
			<div className='row contents-cards'>
				{
					!loading && content.data !== null
					?
						content.data !== undefined
						?
							content.data.length > 0
							?
								content.data.map((item) => (
									<SimpleCard key={item.content_id} data={{ 
										id: item.content_id, 
										title: item.title, 
										image: item.poster_url, 
										cNum: null, 
										rating: {all: item.average_rating, me: item.user_rating || null}, 
										style: "col-6 col-sm-4 col-md-3 mb-4" 
									}}/>
								))
							:
								<div className='p-3 color-l rounded-1 b-g-d3'>
									No {displayData} Yet
								</div>
						:
							<div className='p-3 color-l rounded-1 b-g-d3'>
								Failed To Get Data
							</div>
					: 
						<div className='d-flex align-items-center justify-content-center p-5'>
							<Spinner animation="border" variant="danger" />
						</div>
				}
			</div>
			{
				!loading
				?
					content.data && content.data.length <= 20 && content.dLength > 20
					?
						<div className='d-flex align-items-center justify-content-center my-5'>
							<button className='see-all-btn borderd-link px-3 py-2' onClick={() => getSectionData(displayData, null)}>Show All</button>
						</div>
					:
						content.data && content.data.length > 20
						?
							<div className='d-flex align-items-center justify-content-center my-5'>
								<button className='see-all-btn borderd-link px-3 py-2' onClick={() => getSectionData(displayData, true)}>Show Less</button>
							</div>
						:''
				:''
			}
		</div>
	)
}

export default DisplayProfileSections
