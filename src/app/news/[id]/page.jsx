import ShowToast from '@/app/componentes/global/smallComp/ShowToast';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import React from 'react'
import NewsDetails from './NewsDetails';
import "../news.css"
import NewsRightSide from './NewsRightSide';
import { DomainPath } from '@/utils/DomainPath';

export const metadata = {
	title: 'CinemaMSN - News Details',
	description: `Stay updated with the latest breaking news from the world of cinema. Exclusive updates on upcoming movies, 
		celebrity news, and industry insights only on CinemaMSN.`,
	openGraph: {
		title: 'News Details - CinemaMSN',
		description: `Stay updated with the latest breaking news from the world of cinema. Exclusive updates on upcoming movies, 
		celebrity news, and industry insights only on CinemaMSN.`,
		type: 'article',
	},
}

const NewsDetailsPage = async ({ params }) => {
	const getParams = await params;
	const newsID = Number(getParams.id) || null;
	if (newsID === null || !parseInt(newsID)) {
		return <ShowToast info={{messageText: "invalid Data", type: "error", changePath: "/"}}/>
	};

	let newsData, result = null
	try {
		newsData = await fetchAPIFunc(`${DomainPath}/api/globals/news/getMainInfo?id=${newsID}`, "GET", {}, null, false, "no-store"); 
		result = await newsData.json();
	} catch (error) {
		console.log(error);
	}
	if (newsData?.status !== 200) {
		return <ShowToast info={{messageText: result.message, type: "error", changePath: "/news"}}/>
	} else {
		return (
			<div className='news-page pt-120'>
				<div className='main-container'>
					<div className="row">
						<div className='col-12 col-lg-8'>
							<NewsDetails data={[result]}/>
						</div>
						<div className='col-12 col-lg-4'>
							<NewsRightSide data={result}/>
						</div>
					</div>
				</div>	
			</div>
		)
	}
}

export default NewsDetailsPage
