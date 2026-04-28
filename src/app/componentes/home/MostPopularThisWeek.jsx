import React from 'react'
import SectionTitle from '../global/smallComp/SectionTitle'
import ShowToast from '../global/smallComp/ShowToast';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import ContentCardsList from '../global/ContentCardsList';
import { DomainPath } from '@/utils/DomainPath';

const MostPopularThisWeek = async () => {
	let mostPopularMovies, mostPopularMoviesResult = null;
	try {
		mostPopularMovies = await fetchAPIFunc(`${DomainPath}/api/globals/displayAPIs/mostPopC?type=MS`, "GET", {}, null, false, "no-store");
		mostPopularMoviesResult = await mostPopularMovies.json();
	} catch (error) {
		console.log(error);
		return <ShowToast info={{messageText: "something went wrong", type: "error"}}/>
	}

	if (mostPopularMoviesResult && mostPopularMovies && mostPopularMovies?.status === 200) {
		return (
			<div className='most-pop-m my-5 py-4'>
				<div className='main-container'>
					<SectionTitle title={"Top 10 on CinemaMSN this week"} />
					<ContentCardsList data={mostPopularMoviesResult} topTen={true}/>
				</div>
			</div>
		)
	} else {
		return (
			<div className='main-container'>
				<SectionTitle title={"Top 10 on CinemaMSN this week"} />
				<div className='p-3 mt-3 b-g-d3 color-l rounded-1'>
					No Data Available
				</div>
			</div>
		)
	}
}

export default MostPopularThisWeek
