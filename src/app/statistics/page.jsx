import React from 'react'
import ContentBlockCard from '../componentes/global/ContentBlockCard';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import PeopleList from '../componentes/global/PeopleList';
import { DomainPath } from '@/utils/DomainPath';

export const metadata = {
	title: 'CinemaMSN - Statistics',
	description: `Explore the ultimate cinema rankings. Featuring the Top 100 Movies, TV Shows, and Celebrities based on ratings and popularity on CinemaMSN.`,
	openGraph: {
		title: 'Statistics - CinemaMSN',
		description: `Explore the ultimate cinema rankings. Featuring the Top 100 Movies, TV Shows, and Celebrities based on ratings and popularity on 
			CinemaMSN.
		`,
		type: 'article',
	},
}

const Statistics = async ({ searchParams }) => {
	const allParams = await searchParams
	const displayIs = allParams.getT || null;
	if (displayIs === null || (displayIs !== "c" && displayIs !== "m" && displayIs !== "s" && displayIs !== "p")) {
		return (
			<div className='statistics-page pt-120'>
				<div className="main-container">
					<div className='p-3 b-g-d3 color-l rounded-1'>
						No Data Available
					</div>
				</div>
			</div>
		)
	}

	let respons, result = null
	try {
		let typeCondation = displayIs === "s" ? "&type=S" : displayIs === "m" ? "&type=M" : "";
		respons = displayIs === "p" ? await fetchAPIFunc(`${DomainPath}/api/globals/displayAPIs/mostPopP?limit=100`, "GET", {}, null, false, "no-store") 
		: await fetchAPIFunc(`${DomainPath}/api/globals/displayAPIs/getTopRatedContent?allY=true${typeCondation}`, "GET", {}, null, false, "no-store");
		result = await respons.json();
	} catch (error) {
		console.log(error);
		return (
			<div className='statistics-page pt-120'>
				<div className="main-container">
					<div className='p-3 b-g-d3 color-l rounded-1'>
						Failed to Get Data
					</div>
				</div>
			</div>
		)
	}
	return (
		<div className='statistics-page pt-120'>
			<div className="main-container">
				<h1 className='color-l mb-5'>{
					displayIs === "c" 
					? 
						"Top 100 on CinemaMSN" 
					: 
						displayIs === "m" 
						? 
							"Top 100 Movies on CinemaMSN" 
						: 
							displayIs === "s" 
							? 
								"Top 100 Series on CinemaMSN" 
							: 
								displayIs === "p" 
								? 
									"Top 100 Populer Celebrities" 
								: 
									"People"
				}
				</h1>
				{
					result && result.length > 0
					?
						displayIs === "p"
						?
							<PeopleList data={result} notSwip={true} cardStyle={"col-6 col-sm-4 col-md-3 col-lg-2 mb-4"}/>
						:
							result.map((content) => (
								<ContentBlockCard key={content.content_id} data={content}/>
							))
					:	
						<div className='p-3 b-g-d3 color-l rounded-1'>
							No Data Available
						</div>
				}
			</div>
		</div>
	)
}

export default Statistics
