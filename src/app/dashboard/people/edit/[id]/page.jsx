import HeadAndText from '@/app/componentes/global/smallComp/HeadAndText';
import ShowToast from '@/app/componentes/global/smallComp/ShowToast';
import React from 'react'
import EditPersonInfo from '../EditPersonInfo';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { DomainPath } from '@/utils/DomainPath';

const EditPeople = async ({ params }) => {
	const getParams = await params
	const id = getParams.id;
	let personGenresResp, personGenresRest, personAwardsResp, personAwardsRest = null;
	if (Number(id) || parseInt(id)) {
		try {
			personGenresResp = await fetchAPIFunc(`${DomainPath}/api/globals/getGenres?type=person_role`, "GET", {}, null, false, "no-store");
			personGenresRest = await personGenresResp.json();
			personAwardsResp = await fetchAPIFunc(`${DomainPath}/api/globals/getGenres?type=person_award`, "GET", {}, null, false, "no-store");
			personAwardsRest = await personAwardsResp.json();
		} catch (error) {
			console.log(error)
			personGenresResp = null
		}
	}

	return (
		<div className='main-container pb-5 pt-120 edit-content-page'>
			{
				!Number(id) || !parseInt(id)
				?
					<ShowToast info={{messageText: "person ID is Wrong", type: "error", changePath: "/"}}/>
				:''
			}
			{
				personGenresResp?.status === 200 && personAwardsResp?.status === 200
				?
					<>
						<HeadAndText title= "Edit People" text= "Edit main information, Genres, and Awards together. Empty values ​​will be ignored" />
						<EditPersonInfo personId = {id} peopleGenres={personGenresResp?.status === 200 ? personGenresRest : null}
							peopleAwards={personAwardsResp?.status === 200 ? personAwardsRest : null}
						/>
					</>
				:
					<div className='b-g-d3 p-3 rounded-1 color-l'>
						Failed To Get Dasta
					</div>
			}
		</div>
	)
}

export default EditPeople
