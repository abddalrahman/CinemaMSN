import React from 'react'
import PersonTopData from './PersonTopData'
import PersonBodyData from './PersonBodyData'
import ShowToast from '@/app/componentes/global/smallComp/ShowToast';
import "../person.css"
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { DomainPath } from '@/utils/DomainPath';

export const metadata = {
	title: 'CinemaMSN - Celebrity',
	description: `Explore the life and career of your favorite celebrities. Discover their full biography, filmography, latest news, and exclusive
	  insights on CinemaMSN.`,
	openGraph: {
		title: 'Celebrity Details - CinemaMSN',
		description: `Explore the life and career of your favorite celebrities. Discover their full biography, filmography, latest news, 
			and exclusive insights on CinemaMSN.`,
		type: 'article',
	},
}

const PersonDetails = async ({params}) => {
	const getParams = await params;
	const personId = Number(getParams.id) || null;
	if (personId === null || !parseInt(personId)){
		return <ShowToast info={{messageText: "Data Error", type: "error", changePath: "/"}}/>
	}

	let personData, result = null
	try {
		personData = await fetchAPIFunc(`${DomainPath}/api/globals/displayAPIs/people/getPersonWithRank?id=${personId}`, "GET", {}, null, false, "no-store");
		result = await personData.json();
	} catch (error) {
		console.log(error);
	}
	if (personData?.status !== 200) {
		return (
			<div className='pt-120 main-container'>
				<div className='b-g-d3 color-l p-3 rounded-1'>
					Failed To Get Data
				</div>
			</div>
		)
	}
	return (
		<div>
			<PersonTopData id={personId} result={result}/>
			<PersonBodyData id={personId} personData={result}/>
		</div>
	)
}

export default PersonDetails