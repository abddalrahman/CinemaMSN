import SectionTitle from '@/app/componentes/global/smallComp/SectionTitle'
import React from 'react'
import DetailsCast from './DetailsCast'
import RatingGraph from './RatingGraph'
import DetailsReviews from './DetailsReviews'
import MoreLikeThis from './MoreLikeThis'
import DetailsSortedInfo from './DetailsSortedInfo'
import RelatedNews from '@/app/componentes/global/RelatedNews'

const DetailsBody = ({ data }) => {
	const {content_id, title, content_type, c_status, release_date, country, language, filming_location, budget, revenue, season_number, media, genres, people, 
		allReviews, allRating} = data
	return (
		<div className='main-container py-5 details-body'>
			<div className='row'>
				<div className='left-details col-12 col-lg-8 mb-5 mb-lg-0'>
					<div className='content-images mb-5 pb-5'>
						<SectionTitle title={"Photos"} inHead={`${media?.length || 0}`}/>
						{
							media && media?.length > 0 
							?
								<div className='content-images-container d-flex gap-3 flex-wrap'>
									{
										media.map((item, index) => (
											<div key={index} className=''>
												<img src={item.url} alt={title} className='w-100 h-100'/>
											</div>
										))
									}
								</div>
							:	
								<div className='d-flex align-items-center p-4 b-g-d3 color-l fw-semibold'>
									No Images Available
								</div>
						}
					</div>
					
					<div className='content-cast mb-5 pb-5'>
						<SectionTitle title={"Cast & Crew"} inHead={`${people?.length || 0}`}/>
						{
							people && people?.length > 0 
							?
								<DetailsCast data={people.map((person) => Number(person.person_id))}/>
							:	
								<div className='d-flex align-items-center p-4 b-g-d3 color-l fw-semibold'>
									No Cast Available
								</div>
						}
					</div>

					{
						c_status !== "upcoming"
						?
							<div className='content-reviews mb-5 pb-5'>
								<SectionTitle title={"Users Reviews"} inHead={`${allReviews?.length || 0}`}/>
								{
									allReviews
									?
										<>
											<RatingGraph data={allRating}/>
											<DetailsReviews data={allReviews} cID={content_id} rates={allRating}/>
										</>
										
									:
										<div className='d-flex align-items-center p-4 b-g-d3 color-l fw-semibold'>
											No Reviews Available
										</div>
								}
							</div>
						:''
					}

					<div className='like-this-content mb-5 mb-lg-0'>
						<MoreLikeThis cID={content_id} gIDs={genres} type={content_type}/>
					</div>
				</div>
				{/* right detailsd ---  */}
				<div className='right-details col-12 col-lg-4'>
					<DetailsSortedInfo show={"people"} data={people}/>
					<DetailsSortedInfo show={"details"} data={{date: release_date, country: country, language: language, location: filming_location, 
						budget: budget, revenue: revenue, season: season_number}}
					/>
					<RelatedNews id={content_id} relatedWith={"content"}/>
				</div>
			</div>
			
		</div>
	)
}

export default DetailsBody
