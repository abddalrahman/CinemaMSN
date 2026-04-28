import React from 'react'
import AddContentImages from './AddContentImages'
import CastAndCrew from './CastAndCrew';
import EditMainInfo from './EditMainInfo';
import { fetchAPIFunc } from '@/utils/clientRandomFunc'
import "../../../dashboard.css"
import HeadAndText from '@/app/componentes/global/smallComp/HeadAndText';
import ShowToast from '@/app/componentes/global/smallComp/ShowToast';
import GenresUpdate from './GenresUpdate';
import { DomainPath } from '@/utils/DomainPath';

const EditCotent = async ({ params }) => {
	const getParams = await params
	const id = getParams.id;
	let genresRespons, genresResult, contentGenresRespons, contentGenresResult= null
	if (Number(id) || parseInt(id)) {
		try {
			genresRespons = await fetchAPIFunc(`${DomainPath}/api/globals/getGenres?type=person_role`, "GET", {}, null, false, "no-store");
			genresResult = await genresRespons.json();
			contentGenresRespons = await fetchAPIFunc(`${DomainPath}/api/globals/getGenres?type=content_genre`, "GET", {}, null, false, "no-store");
			contentGenresResult = await contentGenresRespons.json();
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<div className='main-container pb-5 pt-120 edit-content-page'>
			{
				!Number(id) || !parseInt(id)
				?
					<ShowToast info={{messageText: "content ID is Wrong", type: "error", changePath: "/"}}/>
				:''
			}
			<HeadAndText title= "Edit Content" text= "Edit the images, cast, and main information separately." />
			<AddContentImages contentId = {id}/>
			<CastAndCrew contentId = {id} genres={genresRespons?.status === 200 ? genresResult : null}/>
			<HeadAndText title= "Edit Main Info" text= "Fields marked with an asterisk are required fields. Leave what you don't want to change as is. Any values that are modified to become null will be ignored." />
			<EditMainInfo contentId = {id}/>
			<GenresUpdate genres={contentGenresRespons?.status === 200 ? contentGenresResult : null} contentId = {id}/>
		</div>
	)
}

export default EditCotent
