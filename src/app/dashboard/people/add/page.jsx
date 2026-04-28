import HeadAndText from '@/app/componentes/global/smallComp/HeadAndText';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import React from 'react'
import AddPeopleForm from './AddPeopleForm';
import { DomainPath } from '@/utils/DomainPath';

const AddPeople = async () => {
	let respons, result = null;
	try {
		respons = await fetchAPIFunc(`${DomainPath}/api/globals/getGenres?type=person_role`, "GET", {}, null, false, "no-store");
		result = await respons.json();
	} catch (error) {
		
	}

	return (
		<div className='main-container pb-5 pt-120 mb-5'>
			<div className='add-content-page mb-5'>
				<HeadAndText title= "Add Content" text= "Fields marked with an asterisk are required fields; it is recommended to add as much information as possible." />
				<div className='form-container my-5 pb-5'>
					<AddPeopleForm peopleGenres={respons?.status === 200 ? result: null}/>
				</div>
			</div>	
		</div>
	)
}

export default AddPeople
