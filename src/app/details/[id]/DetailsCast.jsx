import PeopleList from '@/app/componentes/global/PeopleList';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { DomainPath } from '@/utils/DomainPath';
import React from 'react'

const DetailsCast = async ({data}) => {
	if (!data || data.length === 0) return ;
	let getContentCast, result;
	try {
		getContentCast = await fetchAPIFunc(`${DomainPath}/api/globals/people/getPeopleList?ids=${JSON.stringify(data)}`, "GET", {}, null, false, "no-store");
		result = await getContentCast.json();
	} catch (error) {
		console.log(error);
	}
	if (getContentCast?.status === 200) {
		return (
			<PeopleList data={result} notSwip={true}/>
		)
	}
	return (
		<div className='d-flex align-items-center p-4 b-g-d3 rounded-2 color-l fw-semibold'>
			Failed To Get Data
		</div>
	)
}

export default DetailsCast
