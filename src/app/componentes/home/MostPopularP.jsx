import React from 'react'
import SectionTitle from '../global/smallComp/SectionTitle'
import ShowToast from '../global/smallComp/ShowToast';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import PeopleList from '../global/PeopleList';
import { DomainPath } from '@/utils/DomainPath';

const MostPopularP = async () => {
	let mostPopularPeople, mostPopularPeopleResult = null;
	try {
		mostPopularPeople = await fetchAPIFunc(`${DomainPath}/api/globals/displayAPIs/mostPopP`, "GET", {}, null, false, "no-store");
		mostPopularPeopleResult = await mostPopularPeople.json();
	} catch (error) {
		console.log(error);
		return <ShowToast info={{messageText: "something went wrong", type: "error"}}/>
	}

	if (mostPopularPeopleResult && mostPopularPeople && mostPopularPeople?.status === 200) {
		return (
			<div className='most-pop-p my-5 py-4'>
				<div className='main-container'>
					<SectionTitle title={"Most popular celebrities"}/>
					<PeopleList data={mostPopularPeopleResult}/>
				</div>
			</div>
		)
	} else {
		return (
			<div className='main-container py-4'>
				<SectionTitle title={"Most popular celebrities"}/>
				<div className='p-3 b-g-d3 rounded-1 color-l mt-3'>
					No Data Available
				</div>
			</div>
		)
	}
}

export default MostPopularP
