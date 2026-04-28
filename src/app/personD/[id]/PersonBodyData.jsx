import ContentBlockCard from '@/app/componentes/global/ContentBlockCard';
import SectionTitle from '@/app/componentes/global/smallComp/SectionTitle';
import { calcAge, fetchAPIFunc } from '@/utils/clientRandomFunc'
import React from 'react'
import PersonRelatedNew from './PersonRelatedNew';
import { DomainPath } from '@/utils/DomainPath';

const PersonBodyData = async ({ id, personData }) => {
	let contentsData, result, genresData, genresResult, personGenres, personGenresResult = null;
	try {
		contentsData = await fetchAPIFunc(`${DomainPath}/api/globals/displayAPIs/getPersonWork?id=${id}`, "GET", {}, null, false, "no-store");
		result = await contentsData.json();
	} catch (error) {
		console.log(error);
	}
	if (contentsData?.status === 200) {
		try {
			genresData = await fetchAPIFunc(`${DomainPath}/api/globals/getGenres?type=person_role`, "GET", {}, null, false, "no-store");
			genresResult = await genresData.json();
		} catch (error) {
			console.log(error);
		}
		if (genresData?.status !== 200) {
			return (
				<div className='main-container'>
					<div className='b-g-d3 p-3 rounded-1 color-l fw-semibold'>
						Failed To Get All Data
					</div>
				</div>
			)
		}
		try {
			personGenres = await fetchAPIFunc(`${DomainPath}/api/globals/displayAPIs/getPersonGenres?id=${id}`, "GET", {}, null, false, "no-store");
			personGenresResult = await personGenres.json();
		} catch (error) {
			console.log(error);
		}

		const actorContents = result.filter((content) => genresResult.some((genre) => {
			return content.role_genre_id == genre.genre_id && genre.name.toLowerCase() === "actor"
		}));
		const writerContents = result.filter((content) => genresResult.some((genre) => {
			return content.role_genre_id == genre.genre_id && genre.name.toLowerCase() === "writer"
		}));
		const producerContents = result.filter((content) => genresResult.some((genre) => {
			return content.role_genre_id == genre.genre_id && genre.name.toLowerCase() === "producer"
		}));
		const directorContents = result.filter((content) => genresResult.some((genre) => {
			return content.role_genre_id == genre.genre_id && genre.name.toLowerCase() === "director"
		}));
		const topLeads = result.filter(item => item.is_lead && item.season_number === 1).slice(0, 4);

		return (
			<div className='body-person-data'>
				<div className="main-container py-5 gap-3">
					<div className='row'>
						<div className='left-person-data col-12 col-lg-8'>
							<SectionTitle title={"Known for"} inHead={topLeads.length > 0 ? topLeads.length : "0"}/>
							<div className='actor-content mb-5 pb-4'>
								{
									topLeads.length > 0
									?
										topLeads.map((content) => <ContentBlockCard key={content.content_id} data={content}/>)
									:
										<div className='d-flex align-items-center justify-content-center p-4 color-g'>
											No Content Available
										</div>
								}
							</div>
							<SectionTitle title={"Actor"} inHead={actorContents.length > 0 ? actorContents.length : "0"}/>
							<div className='actor-content mb-5 pb-4'>
								{
									actorContents.length > 0
									?
										actorContents.map((content) => <ContentBlockCard key={content.content_id} data={content}/>)
									:
										<div className='d-flex align-items-center justify-content-center p-4 color-g'>
											No Content Available
										</div>
								}
							</div>
							<SectionTitle title={"Producer"} inHead={producerContents.length > 0 ? producerContents.length : "0"}/>
							<div className='actor-content mb-5 pb-4'>
								{
									producerContents.length > 0
									?
										producerContents.map((content) => <ContentBlockCard key={content.content_id} data={content}/>)
									:
										<div className='d-flex align-items-center justify-content-center p-4 color-g'>
											No Content Available
										</div>
								}
							</div>
							<SectionTitle title={"Director"} inHead={directorContents.length > 0 ? directorContents.length : "0"}/>
							<div className='actor-content mb-5 pb-4'>
								{
									directorContents.length > 0
									?
										directorContents.map((content) => <ContentBlockCard key={content.content_id} data={content}/>)
									:
										<div className='d-flex align-items-center justify-content-center p-4 color-g'>
											No Content Available
										</div>
								}
							</div>
							<SectionTitle title={"Writer"} inHead={writerContents.length > 0 ? writerContents.length : "0"}/>
							<div className='actor-content mb-5 pb-4'>
								{
									writerContents.length > 0
									?
										writerContents.map((content) => <ContentBlockCard key={content.content_id} data={content}/>)
									:
										<div className='d-flex align-items-center justify-content-center p-4 color-g'>
											No Content Available
										</div>
								}
							</div>
						</div>
						<div className='right-person-data col-12 col-lg-4'>
							<SectionTitle title={"Personal details"}/>
							<ul className='sorted-data-list mb-5 pb-5'>
								<li><div className='d-flex align-items-center flex-wrap'><h6 className='mb-0'>He Is</h6>{
									personGenres?.status === 200
								?
									personGenresResult.map((genre) => <span key={genre.genre_id}>{genre.name}</span>)
								:
									"Failed To Get Data"
							}</div></li>
								<li><div className='d-flex align-items-center flex-wrap'>
									<h6 className='mb-0'>Height</h6> <span>{personData.height_cm }cm</span>
								</div></li>
								<li><div className='d-flex align-items-center flex-wrap'>
									<h6 className='mb-0'>Born</h6> <span>{calcAge(personData.birth_date) }</span>
								</div></li>
								<li><div className='d-flex align-items-center flex-wrap'>
									<h6 className='mb-0'>Nationality</h6> <span>{personData.nationality}</span>
								</div></li>
								<li><div className='d-flex align-items-center flex-wrap'>
									<h6 className='mb-0'>Children</h6> <span>{personData.children_count} children</span>
								</div></li>
							</ul>
							<SectionTitle title={"Related News"}/>
							<PersonRelatedNew id={id}/>
						</div>
					</div>
					
				</div>
			</div>
		)
	} else {
		return (
			<div className='main-container py-5'>
				<div className='b-g-d3 p-3 rounded-1 color-l fw-semibold'>
					Failed To Get Data
				</div>
			</div>
		)
	}
}

export default PersonBodyData
