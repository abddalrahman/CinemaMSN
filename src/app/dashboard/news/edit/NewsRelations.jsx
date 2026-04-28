"use client"
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import AddNewsMovieR from './AddNewsMovieR';
import AddNewsSeriesR from './AddNewsSeriesR';
import AddNewsPR from './AddNewsPR';
import { addNewsConnectionsValidation } from '@/utils/zodValidations';
import { DomainPath } from '@/utils/DomainPath';


const NewsRelations = ({ oldData }) => {
	const [existingMR, setExistingMR] = useState([])
	const [existingSR, setExistingSR] = useState([])
	const [existingPR, setExistingPR] = useState([])

	const [dataToSend, setDataToSend] = useState({
		movies: {
			ids: [],
			data: []
		},
		series: {
			ids: [],
			data: []
		},
		people: {
			ids: [],
			data: []
		}, 
	});
	const [searchResults, setSearchResults] = useState({
		movies : {
			results: [],
			loading: false,
			searching: false
		},
		series : {
			results: [],
			loading: false,
			searching: false
		},
		people : {
			results: [],
			loading: false,
			searching: false
		},
	});
	const [loading, setLoading] = useState(false);
	
	const getRelatedContent = async (IDs) => {
		const toNumberIDs = IDs.map((id) => Number(id)); 
		try {
			const contents = await fetchAPIFunc(`${DomainPath}/api/globals/content/getContentList?ids=${JSON.stringify(toNumberIDs)}`, "GET", {})
			const contentResult = await contents.json();
			if (contents.status === 200) {
				const movies = contentResult.filter((content) => content.content_type === "M");
				const series = contentResult.filter((content) => content.content_type === "S");
				setExistingMR(movies);
				setExistingSR(series);
				return;
			} else {
				setExistingMR([]);
				setExistingSR([]);
				return toast.error("failed to get contents related with news")
			}
		} catch (error) {
			console.log(error);
			setExistingMR([]);
			setExistingSR([]);
			return toast.error("failed to get contents related with news")
		}
	}
	
	const getRelatedPeople = async (IDs) => {
		const toNumberIDs = IDs.map((id) => Number(id)); 
		try {
			const people = await fetchAPIFunc(`${DomainPath}/api/globals/people/getPeopleList?ids=${JSON.stringify(toNumberIDs)}`, "GET", {})
			const peopleResult = await people.json();
			if (people.status === 200) {
				setExistingPR(peopleResult);
				return;
			} else {
				setExistingPR([]);
				return toast.error("failed to get people related with news")
			}
		} catch (error) {
			console.log(error);
			setExistingPR([]);
			return toast.error("failed to get people related with news")
		}
	}

	const getRelations = async () => {
		try {
			const relations = await fetchAPIFunc(`${DomainPath}/api/globals/news/getNewsRelations?id=${oldData.news_id}
				${oldData.is_about_movies || oldData.is_about_series ? "&content=1" : ""}${oldData.is_about_people ? "&people=1" : ""}`, "GET", {}
			);
			const result = await relations.json();
			if (relations.status === 200) {
				const { nc, np } = result;
				if (nc.length > 0) {
					getRelatedContent(nc);
				} else {
					setExistingMR([]);
					setExistingSR([]);
				}
				if (np.length > 0) {
					getRelatedPeople(np);
				} else {
					setExistingPR([]);
				}
			}
		} catch (error) {
			console.log(error);
			setExistingMR([]);
			setExistingSR([]);
			setExistingPR([]);
		}
	} 

	useEffect(() => {
		if (oldData === null) return;
		const run = async () => {
			await getRelations();
		}
		run ();
	}, [])

	const saveRelations = async () => {
		try {
			setLoading(true);
			const objToSend = {
				newsID: Number(oldData.news_id) || null,
				movies: dataToSend.movies.ids.length > 0 ? [...dataToSend.movies.ids.map((id) => Number(id))] : undefined,
				series: dataToSend.series.ids.length > 0 ? [...dataToSend.series.ids.map((id) => Number(id))] : undefined,
				people: dataToSend.people.ids.length > 0 ? [...dataToSend.people.ids.map((id) => Number(id))] : undefined
			}
			const validation = addNewsConnectionsValidation.safeParse(objToSend);
			if (!validation.success) {
				setLoading(false);
				return toast.error("Data form Issues or Data Missing");
			}
			const saveRelations = await fetchAPIFunc(`${DomainPath}/api/admin/news/newsConnections`, "POST", objToSend);
			const result = await saveRelations.json();
			if (saveRelations.status === 200) {
				setLoading(false);
				toast.success(result.message);
				setDataToSend({
					movies: {ids: [], data: []},
					series: {ids: [], data: []},
					people: {ids: [], data: []},
				})
				getRelations();
			} else {
				toast.error(result.message);
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
			console.log(error);
			return toast.error("Something Went Wrong Tyry Again");
		}
	}

	if (oldData === null) return <div className='p-3 p-md-4 b-g-d3 color-l'>failed to get news data ! you can not add new relations</div>
	return (
		<>
			
			<div className='b-g-d3 m-border rounded-4 p-3 p-md-4 mt-4 mb-5'>
				{
					oldData.is_about_movies ? <AddNewsMovieR data={{existingMR, dataToSend, setDataToSend, searchResults, setSearchResults, nID: oldData.news_id
						, reGetD: getRelations
					}}/> : ''
				}
				{oldData.is_about_movies && oldData.is_about_series ? <span className='breack'/> : ''}
				{
					oldData.is_about_series ? <AddNewsSeriesR data={{existingSR, dataToSend, setDataToSend, searchResults, setSearchResults, nID: oldData.news_id,
						reGetD: getRelations
					}}/> : ''
				}
				{oldData.is_about_series && oldData.is_about_people ? <span className='breack'/> : ''}
				{
					oldData.is_about_people ? <AddNewsPR data={{existingPR, dataToSend, setDataToSend, searchResults, setSearchResults, nID: oldData.news_id,
						reGetD: getRelations
					}}/> : ''
				}
				{
					dataToSend.movies.ids.length > 0 || dataToSend.series.ids.length > 0 || dataToSend.people.ids.length > 0 
					?
						<button className='main-red-btn w-100 p-3 mt-5' onClick={saveRelations}>Save All Relations</button>
					:
						<span className='main-red-btn w-100 p-3 mt-5 disabled'>Save All Relations</span>
				}
			</div>
		</>
	)
}

export default NewsRelations
