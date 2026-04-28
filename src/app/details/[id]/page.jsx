import ShowToast from '@/app/componentes/global/smallComp/ShowToast';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import React from 'react'
import DetailsTop from './DetailsTop';
import "../details.css"
import DetailsBody from './DetailsBody';
import { DomainPath } from '@/utils/DomainPath';

export const metadata = {
	title: 'CinemaMSN - Details',
	description: `Get all the details about your favorite movies and series. Watch trailers, read summaries, check ratings, and stay 
		updated with the latest cinema news on CinemaMSN.
	`,
	openGraph: {
		title: 'Content Details - CinemaMSN',
		description: `Get all the details about your favorite movies and series. Watch trailers, read summaries, check ratings, and stay 
			updated with the latest cinema news on CinemaMSN.
		`,
		type: 'article',
	},
}

const ContentDetails = async ({ params }) => {
	const getParams = await params;
	const contentID = Number(getParams.id) || null;
	if (contentID === null || !parseInt(contentID)) {
		return <ShowToast info={{messageText: "invalid content ID", type: "error", changePath: "/"}}/>
	}
	let contentData, result = null
	try {
		contentData = await fetchAPIFunc(`${DomainPath}/api/globals/displayAPIs/getAllCotantDetails?id=${contentID}`, "GET", {}, null, false, "no-store");
		result = await contentData.json();
	} catch (error) {
		console.log(error);
	}
	if (contentData?.status === 200) {
		return (
			<div className='color-l content-details-page'>
				<DetailsTop data={result}/>
				<DetailsBody data={result}/>
			</div>
		)
	} else {
		return <ShowToast info={{messageText: result.message, type: "error", changePath: "/"}}/>
	}
}

export default ContentDetails