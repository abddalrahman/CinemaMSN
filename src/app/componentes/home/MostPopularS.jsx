import React from 'react'
import SectionTitle from '../global/smallComp/SectionTitle'
import ShowToast from '../global/smallComp/ShowToast';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import ContentCardsList from '../global/ContentCardsList';
import { DomainPath } from '@/utils/DomainPath';

const MostPopularS = async () => {
	let mostPopularSeries, mostPopularSeriesResult = null;
	try {
		mostPopularSeries = await fetchAPIFunc(`${DomainPath}/api/globals/displayAPIs/mostPopC?type=S`, "GET", {}, null, false, "no-store");
		mostPopularSeriesResult = await mostPopularSeries.json();
	} catch (error) {
		console.log(error);
		return <ShowToast info={{messageText: "something went wrong", type: "error"}}/>
	}

	if (mostPopularSeriesResult && mostPopularSeries && mostPopularSeries?.status === 200) {
		return (
			<div className='most-pop-s mb-5 pb-4'>
				<div className='main-container'>
					<SectionTitle title={"Most popular series"} subtitle={"Top 30 most popular series on CinemaMSN"}/>
					<ContentCardsList data={mostPopularSeriesResult} swiperSlids={6}/>
				</div>
			</div>
		)
	} else {
		return (
			<div className='main-container py-4'>
				<SectionTitle title={"Most popular series"} subtitle={"Top 30 most popular series on CinemaMSN"}/>
				<div className='p-3 mt-3 b-g-d3 color-l rounded-1'>
					No Data Available
				</div>
			</div>
		)
	}
}

export default MostPopularS
