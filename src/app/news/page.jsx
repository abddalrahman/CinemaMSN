"use client"
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react'
import CoverL from '../componentes/global/smallComp/CoverL';
import NewsDetails from './[id]/NewsDetails';
import "./news.css"
import SectionTitle from '../componentes/global/smallComp/SectionTitle';
import PaginationComp from '../componentes/global/PaginationComp';
import { DomainPath } from '@/utils/DomainPath';
import { Spinner } from 'react-bootstrap';

const NewsPageContent = () => {
	const searchParams =  useSearchParams();
	const [loading, setLoading] = useState(false);
	const [newsInfo, setNewsInfo] = useState([]);
	const type = searchParams.get("type") || null;
	const [filterParams, setFilterParams] = useState({
		page: 1
	});
	const [totalNews, setTotalNews] = useState(0)
	const router = useRouter();
	
	const getNewsData = async (typeIs) => {
		try {
			setLoading(true);
			const newsD = await fetchAPIFunc(`${DomainPath}/api/globals/news/getNewsWithFiltering?page=${filterParams.page}&limit=10&about=${typeIs}`, 
				"GET", {}
			);
			const result = await newsD.json();
			if (newsD.status == 200) {
				setLoading(false);
				setNewsInfo(result.data);
				setTotalNews(Number(result.dataLength));
			} else {
				setLoading(false);
				setNewsInfo(null);
				setTotalNews(0);
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
			setNewsInfo(null);
			setTotalNews(0);
		}
	}
	
	const getTopNewsData = async () => {
		try {
			setLoading(true);
			const newsD = await fetchAPIFunc(`${DomainPath}/api/globals/displayAPIs/topNews?page=${filterParams.page}&limit=10`, "GET", {});
			const result = await newsD.json();
			if (newsD.status == 200) {
				setLoading(false);
				setNewsInfo(result.data);
				setTotalNews(Number(result.dataLength));
			} else {
				setLoading(false);
				setNewsInfo(null);
				setTotalNews(0);
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
			setNewsInfo(null);
			setTotalNews(0);
		}
	}
	
	const changPath = (path) => {
		setFilterParams({...filterParams, page: 1});
		setTimeout(() => {
			router.push(path);
		}, 200);
	}

	useEffect(() => {
		const run = async () => {
			if (type === "m" || type === "s" || type === "p" || type === null) {
				await getNewsData(type);
			} else if (type !== "top") {
				await getNewsData(null);
			} else {
				await getTopNewsData();
			}
		}
		run();
	}, [type, filterParams.page]);
	

	return (
		<>
			{loading ? <CoverL/> : ''}
			<div className='news-list-page pt-120'>
				<div className='main-container'>
					<div className="row">
						<div className="col-12 col-xl-8">
							<SectionTitle title="News List" inHead={totalNews} />
							{
								newsInfo && newsInfo.length > 0 
								?
									<NewsDetails data={newsInfo}/>
									:
									<div className='b-g-d3 p-3 rounded-1 color-l'>
										{newsInfo === null ? 'Failed To Get Data' : 'No Data Found'}
									</div>
							}
							<PaginationComp data={{elePerPage: 10, total: Number(totalNews), page: filterParams.page, 
								filterVals: filterParams, setFilterPage: setFilterParams}}
							/>
						</div>
						<div className="col-12 col-md-6 col-xl-4">
							<div className='news-links w-100'>
								<div className='w-100 p-3 rounded-1'>
									<h6 className='text-uppercase color-l fw-bold'>More News</h6>
									<div className='d-flex align-items-center gap-2 mt-3 flex-wrap'>
										{type !== "m" ? <span className='borderd-link' onClick={() => changPath("/news?type=m")}>Movies News</span> : ""}
										{type !== "s" ? <span className='borderd-link' onClick={() => changPath("/news?type=s")}>Series News</span> : ""}
										{type !== "top" ? <span className='borderd-link' onClick={() => changPath("/news?type=top")}>Top News</span> : ""}
										{type !== "p" ? <span className='borderd-link' onClick={() => changPath("/news?type=p")}>Celebrities News</span> : ""}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</>
	)
}

const NewsPage = () => {
	return (
    <Suspense fallback={
      <div className='p-5 pt-120 d-flex align-items-center justify-content-center'>
        <Spinner animation="border" variant="primary" />
      </div>
    }>
      <NewsPageContent />
    </Suspense>
  )
}

export default NewsPage