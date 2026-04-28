import HeadAndText from '@/app/componentes/global/smallComp/HeadAndText';
import ShowToast from '@/app/componentes/global/smallComp/ShowToast';
import React from 'react'
import EditNewsForm from '../EditNewsForm';
import "../../../dashboard.css"
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import NewsRelations from '../NewsRelations';
import { DomainPath } from '@/utils/DomainPath';

const EditNews =  async ({ params }) => {
	const getParams = await params
	const id = getParams.id;
	let oldNewsInfoResp, oldNewsInfoRest = null
	if (Number(id) || parseInt(id)) {
		try {
			oldNewsInfoResp = await fetchAPIFunc(`${DomainPath}/api/globals/news/getMainInfo?id=${id}`, "GET", {}, null, false, "no-store");
			oldNewsInfoRest = await oldNewsInfoResp.json();
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<div className='main-container pb-5 pt-120 edit-news-page'>
			{
				!Number(id) || !parseInt(id)
				?
					<ShowToast info={{messageText: "content ID is Wrong", type: "error", changePath: "/"}}/>
				:''
			}
			{
				oldNewsInfoResp?.status === 200
				?
					<>
						<HeadAndText title= "Edit News" text= "Edit the News Relations, and main information separately." />
						<NewsRelations oldData={oldNewsInfoResp.status === 200 ? oldNewsInfoRest : null}/>
						<EditNewsForm oldData={oldNewsInfoResp.status === 200 ? oldNewsInfoRest : null}/>
					</>
				:
					<div className='p-4 b-g-d2 color-l'>Failed to Get News Data</div>
			}
		</div>
	)
}

export default EditNews
