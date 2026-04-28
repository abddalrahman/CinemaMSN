import NewsCard from '@/app/componentes/global/NewsCard';
import SectionTitle from '@/app/componentes/global/smallComp/SectionTitle';
import { fetchAPIFunc } from '@/utils/clientRandomFunc'
import { DomainPath } from '@/utils/DomainPath';
import React from 'react'

const NewsRightSide = async ({ data }) => {
	let about = "";
	if (data.is_about_movies) about += "m";
	if (data.is_about_series) about += "s";
	if (data.is_about_people) about += "p";

	let newsDate, result = null;
	try {
		newsDate = await fetchAPIFunc(`${DomainPath}/api/globals/news/getNewsWithFiltering?page=1&limit=5&about=${about}`, "GET", {}, null, false, "no-store");
		result = await newsDate.json();
	} catch (error) {
		console.log(error);
	}
	if (newsDate?.status === 200) {
		return (
			
			<div className='side-news'>
				<SectionTitle title={"Similar News"}/>
				{
					result.data.length > 1
					?
						result.data.map((item) => (
							item.news_id !== data.news_id &&
							<NewsCard key={item.news_id} data={{id: item.news_id, title: item.title, body: item.body, image: item.image_url, 
								date: item.created_at, aboutM: item.is_about_movies ? "Movies News" : false, aboutS: item.is_about_series ? "Series News" : false, 
								aboutP: item.is_about_people ? "People News" : false, style: "mb-4"
							}}/>
						))
					:
						<div className='color-l p-3 b-g-d3'>
							No Data Found
						</div>
				}
			</div>
		)
	} else {
		return (
			<>
				<SectionTitle title={"Similar News"}/>
				<div className='color-l p-3 b-g-d3'>
					Failed To Get Data
				</div>
			</>
		)
	}
}

export default NewsRightSide
