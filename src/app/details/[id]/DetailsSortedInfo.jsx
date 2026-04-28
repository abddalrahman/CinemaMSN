import SectionTitle from '@/app/componentes/global/smallComp/SectionTitle'
import { fetchAPIFunc } from '@/utils/clientRandomFunc'
import { DomainPath } from '@/utils/DomainPath'
import { getDirectorWriter } from '@/utils/recurringFunctions'
import Link from 'next/link'
import React from 'react'

const DetailsSortedInfo = async ({ show, data }) => {
	if (show === "people") {
		if (!Array.isArray(data) || data.length == 0) {
			return (
				<>
					<SectionTitle title={"Stars & Crew"}/>
					<ul className='sorted-data-list mb-5 pb-5 fs-main'>
						<li><div className='d-flex align-items-center flex-wrap'><h6 className='mb-0'>Directors</h6> <span>No Data</span></div></li>
						<li><div className='d-flex align-items-center flex-wrap'><h6 className='mb-0'>Writers</h6> <span>No Data</span></div></li>
						<li><div className='d-flex align-items-center flex-wrap'><h6 className='mb-0'>Stars</h6> <span>No Data</span></div></li>
					</ul>
				</>
			)
		}
		const peopleIDs = [...new Set(data.map((person) => Number(person.person_id)))];
		const rolesIDs = data.map((person) => Number(person.role_genre_id));
		let peopleNamesAndRoles, result = null;
		try {
			peopleNamesAndRoles = await fetchAPIFunc(`${DomainPath}/api/globals/displayAPIs/getPeoplesNamesAndRoles?
				pIDs=${JSON.stringify(peopleIDs)}&gIDs=${JSON.stringify(rolesIDs)}`, "GET", {}, null, false, "no-store"
			);
			result = await peopleNamesAndRoles.json();
		} catch (error) {
			console.log(error);
		}
		if (peopleNamesAndRoles.status !== 200){
			return (
				<>
					<SectionTitle title={"Stars & Crew"}/>
					<div className='color-l fw-semibold b-g-d3 d-flex align-items-center rounded-1 mb-5 p-3'>
						Failed To Get Data
					</div>
				</>
			)
		}
		const DirectorsData = getDirectorWriter(data, result, "Director");
		const WritersData = getDirectorWriter(data, result, "Writer");
		const starsIDs = data.filter((person) => person.is_lead === true).map((p) => p.person_id);
		const starsData = result?.names.filter((person) => starsIDs.includes(Number(person.person_id)));
		return (
			<>
				<SectionTitle title={"Stars & Crew"}/>
				<ul className='sorted-data-list mb-5 pb-5 fs-main'>
					<li><div className='d-flex align-items-center flex-wrap'><h6 className='mb-0'>Directors</h6>
						{
							DirectorsData?.length > 0
							?
								DirectorsData.map((person) => (
									<Link key={person.person_id} href={`/personD/${person.person_id}`}>{person.p_name}</Link>
								))
							: <span>No Data</span>		
						}
					</div></li>
					<li><div className='d-flex align-items-center flex-wrap'><h6 className='mb-0'>Writers</h6> 
						{
							WritersData?.length > 0
							?
								WritersData.map((person) => (
									<Link key={person.person_id} href={`/personD/${person.person_id}`}>{person.p_name}</Link>
								))
							: <span>No Data</span>		
						}
					</div></li>
					<li><div className='d-flex align-items-center flex-wrap'><h6 className='mb-0'>Stars</h6> 
						{
							starsData?.length > 0
							?
								starsData.map((person) => (
									<Link key={person.person_id} href={`/personD/${person.person_id}`}>{person.p_name}</Link>
								))
							: <span>No Data</span>		
						}
					</div></li>
				</ul>
			</>
		)
	} else if (show === "details") {
		const {date, country, language, location, budget, revenue, season} = data
		return (
			<>
				<SectionTitle title={"Details"}/>
				<div className='mb-5 pb-5'>
					<ul className='sorted-data-list fs-main'>
						<li><div className='d-flex align-items-center flex-wrap'>
							<h6 className='mb-0'>Release date</h6> <span>{date.slice(0,10) || "No Data"}</span>
						</div></li>
						<li><div className='d-flex align-items-center flex-wrap'>
							<h6 className='mb-0'>Country of origin</h6> <span>{country || "No Data"}</span>
						</div></li>
						<li><div className='d-flex align-items-center flex-wrap'>
							<h6 className='mb-0'>Language</h6> <span>{language || "No Data"}</span>
						</div></li>
						<li><div className='d-flex align-items-center flex-wrap'>
							<h6 className='mb-0'>Filming locations</h6> <span>{location || "No Data"}</span>
						</div></li>
						<li><div className='d-flex align-items-center flex-wrap'>
							<h6 className='mb-0'>Season</h6> <span>{season || "No Data"}</span>
						</div></li>
					</ul>
				</div>
				<SectionTitle title={"Box office"}/>
				{
					budget && revenue && budget != 0 && revenue != 0
					?
						<ul className='sorted-data-list mb-5 pb-5 fs-main'>
							<li><div className='d-flex align-items-center flex-wrap'><h6 className='mb-0'>Budget</h6> <span>{"$" + budget }</span></div></li>
							<li><div className='d-flex align-items-center flex-wrap'><h6 className='mb-0'>Revenue</h6> <span>{"$" + revenue }</span></div></li>
						</ul>
					:
						<ul className='sorted-data-list mb-5 pb-5 fs-main'>
							<li><div className='d-flex align-items-center flex-wrap'><h6 className='mb-0'>Budget</h6> <span>No Data</span></div></li>
							<li><div className='d-flex align-items-center flex-wrap'><h6 className='mb-0'>Revenue</h6> <span>No Data</span></div></li>
						</ul>
				}
			</>
		)
	}
}

export default DetailsSortedInfo
