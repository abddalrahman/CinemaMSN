import React from 'react'
import SectionTitle from '../global/smallComp/SectionTitle'
import ShowToast from '../global/smallComp/ShowToast';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import ContentCardsList from '../global/ContentCardsList';
import { DomainPath } from '@/utils/DomainPath';


const MostPopularM = async () => {
	let mostPopularMovies, mostPopularMoviesResult = null;
	try {
		mostPopularMovies = await fetchAPIFunc(`${DomainPath}/api/globals/displayAPIs/mostPopC?type=M`, "GET", {}, null, false, "no-store");
		mostPopularMoviesResult = await mostPopularMovies.json();
	} catch (error) {
		console.log(error);
		return <ShowToast info={{messageText: "something went wrong", type: "error"}}/>
	}

	if (mostPopularMoviesResult && mostPopularMovies && mostPopularMovies?.status === 200) {
		return (
			<div className='most-pop-m mb-5 pb-4'>
				<div className='main-container'>
					<SectionTitle title={"Most popular movies"} subtitle={"Top 30 most popular movies on CinemaMSN"}/>
					<ContentCardsList data={mostPopularMoviesResult} swiperSlids={6}/>
				</div>
			</div>
		)
	} else {
		return (
			<div className='main-container py-4'>
				<SectionTitle title={"Most popular movies"} subtitle={"Top 30 most popular movies on CinemaMSN"}/>
				<div className='p-3 b-g-d3 mt-3 color-l rounded-1'>
					No Data Available
				</div>
			</div>
		)
	}
}

export default MostPopularM