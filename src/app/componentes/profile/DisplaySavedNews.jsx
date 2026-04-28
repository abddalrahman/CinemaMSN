import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import React from 'react'
import SectionTitle from '../global/smallComp/SectionTitle';
import NewsCard from '../global/NewsCard';
import { cookies } from 'next/headers';
import { DomainPath } from '@/utils/DomainPath';

const DisplaySavedNews = async ({ data }) => {
	const {id, myP, isPrivate} = data;
	const getCookies = await cookies();
	const token = getCookies.get("jwtToken")?.value || null;
	let savedNews = [];
	try {
		const getNews = await fetchAPIFunc(`${DomainPath}/api/users/activity/userNews?id=${id}`, "GET", {}, token, false, "no-store");
		const result = await getNews.json();
		if (getNews.status === 200) {
			savedNews = result;
		} else {
			savedNews = null;
		}
	} catch (error) {
		console.log(error);
		savedNews = null;
		return;
	}
	return (
		<div className='mt-5'>
			<div className='d-flex align-items-center gap-4'>
				<SectionTitle title={"Saved News"} inHead={savedNews === null ? "" : savedNews.length} />
				<span className='color-y fw-semibold mb-4'>{isPrivate ? "Private" : "Public"}</span>
			</div>
			{
				savedNews !== null
				?
				  savedNews.length > 0
					?
						savedNews.map((news) => (
							<NewsCard key={news.news_id} data={{id: news.news_id, title: news.title, body: news.body, image: news.image_url, 
								date: news.created_at, aboutM: news.is_about_movies ? "Movies News" : false, aboutS: news.is_about_series ? "Series News" : false, 
								aboutP: news.is_about_people ? "People News" : false, style: "mb-4"
							}} />
						))
					:
						<div className='color-l rounded-1 p-3 b-g-d3'>
							No Saved News
						</div>
				:	
					<div className='color-l rounded-1 p-3 b-g-d3'>
						Failed To Get Data
					</div>
			}
		</div>
	)
}

export default DisplaySavedNews
