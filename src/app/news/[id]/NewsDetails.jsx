"use client"

import { fetchAPIFunc } from '@/utils/clientRandomFunc'
import React, { useEffect, useState } from 'react'
import NewsBigCard from '../NewsBigCard';
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import { DomainPath } from '@/utils/DomainPath';

const NewsDetails = ({ data }) => {
	const [loading, setLoading] = useState(false);
	const [savedNews, setSavedNews] = useState([]);

	const getSavedNews = async () => {
		try {
			setLoading(true);
			const savedNews = await fetchAPIFunc(`${DomainPath}/api/users/activity/userNews?JustIDs=true`, "GET", {});
			const result = await savedNews.json();
			if (savedNews.status !== 200) {
				setSavedNews([]);
			} else {
				setSavedNews(result);
			}
			setLoading(false);
			return;
		} catch (error) {
			console.log(error);
			setLoading(false);
			setSavedNews([]);
			return
		}
	};

	useEffect (() => {
		const run = async () => {
			await getSavedNews();
		}
		run();
	}, [])

	return (
		<>
			{loading ? <CoverL/> : ''}
			{
				data && data.length > 0
				?
					data.map((n) => (
						<NewsBigCard key={n.news_id} data={n} getSavedAgain={getSavedNews} savedNews={savedNews}/>
					))
				: 
					<div className='b-g-d3 rounded-1 color-l p-3'>
						No News To Display
					</div>
			}
		</>
	)
}

export default NewsDetails