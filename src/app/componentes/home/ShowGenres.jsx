import React from 'react'
import SectionTitle from '../global/smallComp/SectionTitle'
import ShowToast from '../global/smallComp/ShowToast';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import DisplayGenresList from './DisplayGenresList';
import { DomainPath } from '@/utils/DomainPath';

const ShowGenres = async () => {
	let contentGenres, contentGenresResult = null;
	try {
		contentGenres = await fetchAPIFunc(`${DomainPath}/api/globals/getGenres?type=content_genre`, "GET", {}, null, false, "no-store");
		contentGenresResult = await contentGenres.json();
	} catch (error) {
		console.log(error);
		return <ShowToast info={{messageText: "something went wrong", type: "error"}}/>
	}

	if (contentGenresResult && contentGenres && contentGenres?.status === 200) {
		return (
			<div className='show-genres my-5 py-4'>
				<div className='main-container'>
					<SectionTitle title={"Genres"} subtitle={"Add any Genre to your Interests"} />
					{
						contentGenresResult.length > 0
						?
						<DisplayGenresList data={contentGenresResult}/>
						:
							<div className='p-3 rounded-1 color-l b-g-d3'>No Data Available</div>
					}
				</div>
			</div>
		)
	} else {
		return (
			<div className='main-container'>
				<SectionTitle title={"Genres"} subtitle={"Add any Genre to your Interests"} />
				<div className='p-4 color-l b-g-d3 rounded-1'>
					No Data Available
				</div>
			</div>
		)
	}
}

export default ShowGenres
