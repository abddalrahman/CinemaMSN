import React from 'react'
import SectionTitle from '../global/smallComp/SectionTitle'
import ShowToast from '../global/smallComp/ShowToast';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import NewsCard from '../global/NewsCard';
import Link from 'next/link';
import { DomainPath } from '@/utils/DomainPath';

const ShowNews = async () => {
	let topNews, topNewsResult = null;
	try {
		topNews = await fetchAPIFunc(`${DomainPath}/api/globals/displayAPIs/topNews?page=1&limit=6`, "GET", {}, null, false, "no-store");
		topNewsResult = await topNews.json();
	} catch (error) {
		console.log(error);
		return <ShowToast info={{messageText: "something went wrong", type: "error"}}/>
	}

	if (topNewsResult && topNews && topNews?.status === 200) {
		return (
			<div className='show-news my-5 py-4'>
				<div className='main-container'>
					<SectionTitle title={"Top New"}/>
					<div className='news-and-links row'>
						<div className='news-list col-12 col-xl-8 mb-4'>
							{
								topNewsResult.data.length > 0
								?
									topNewsResult.data.map((data, index) => {
										return <NewsCard key={index} data={{id: data.news_id, title: data.title, body: data.body, image: data.image_url, 
											date: data.created_at, aboutM: data.is_about_movies ? "Movies News" : false, aboutS: data.is_about_series ? "Series News" : false, 
											aboutP: data.is_about_people ? "People News" : false
										}} />
									})
								:
									<div className='p-3 rounded-1 color-l b-g-d3 h-f-c'>
										No Data Available
									</div>
							}
						</div>
						<div className='news-links col-12 col-md-6 col-lg-4'>
							<div className='w-100 p-3 rounded-1'>
								<h6 className='text-uppercase color-l fw-bold'>More News</h6>
								<div className='d-flex align-items-center gap-2 mt-3 flex-wrap'>
									<Link className='borderd-link' href={"/news?type=m"}>Movies News</Link>
									<Link className='borderd-link' href={"/news?type=s"}>Series News</Link>
									<Link className='borderd-link' href={"/news?type=top"}>Top News</Link>
									<Link className='borderd-link' href={"/news?type=p"}>Celebrities News</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	} else {
		return (
			<div className='main-container'>
				<SectionTitle title={"Top New"}/>
				<div className='p-4 b-g-d3 color-l rounded-1'>
					No Data Available
				</div>
			</div>
		)
	}
}

export default ShowNews
