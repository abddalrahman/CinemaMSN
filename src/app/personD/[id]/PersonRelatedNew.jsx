import NewsCard from '@/app/componentes/global/NewsCard';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { DomainPath } from '@/utils/DomainPath';
import React from 'react'

const PersonRelatedNew = async ({ id }) => {

	let newsData, result = null;
	try {
		newsData = await fetchAPIFunc(`${DomainPath}/api/globals/news/getRelatedNewsData?id=${id}&relatedW=person`, "GET", {}, null, false, "no-store");
		result = await newsData.json();
	} catch (error) {
		
	}
	if (newsData?.status === 200) {
		return (
			<div className='person-news'>
				{
					result.length === 0 
					? 
						<div className='p-4 b-g-d3 color-l fw-semibold rounded-1 d-flex align-items-center'>
							No Related News
						</div> 
					:
						result.map((item) => (
							<NewsCard key={item.news_id} data={{id: item.news_id, title: item.title, body: item.body, image: item.image_url, 
								date: item.created_at, aboutM: item.is_about_movies ? "Movies News" : false, aboutS: item.is_about_series ? "Series News" : false, 
								aboutP: item.is_about_people ? "People News" : false, style: "mb-4"
							}}/>
						))
				}
			</div>
		)
	} else {
		return (
			<div className='p-4 b-g-d3 color-l fw-semibold rounded-1 d-flex align-items-center'>
				Failed To Get News
			</div>
		)
	}

}

export default PersonRelatedNew
