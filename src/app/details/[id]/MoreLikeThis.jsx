import ContentCardsList from '@/app/componentes/global/ContentCardsList'
import SectionTitle from '@/app/componentes/global/smallComp/SectionTitle'
import { fetchAPIFunc } from '@/utils/clientRandomFunc'
import { DomainPath } from '@/utils/DomainPath'
import React from 'react'

const MoreLikeThis = async ({cID, gIDs, type}) => {
	let getContents, result = null;
	try {
		getContents = await fetchAPIFunc(`${DomainPath}/api/globals/content/getContentWithFiltering?like_list=${JSON.stringify(gIDs)}
			&type=${type}&cid=${cID}`, "GET", {}, null, false, "no-store"
		);
		result = await getContents.json();
	} catch (error) {
		
	}
	if (getContents?.status !== 200) {
		return (
			<>
				<SectionTitle title={"More Like This"}/>
				<div className='p-4 b-g-d3 color-l fw-semibold rounded-1 d-flex align-items-center'>
					Failed To Get Data
				</div>
			</>
		)
	}
	if (!result.contents || result.contents.length === 0) {
		return (
			<>
				<SectionTitle title={"More Like This"}/>
				<div className='p-4 b-g-d3 color-l fw-semibold rounded-1 d-flex align-items-center'>
					No Data Available
				</div>
			</>
		)
	}

	const contentData = result.contents.map((content) => {
		const contentRate = result.contentRatings.filter((item) => item.content_id === content.content_id)[0]?.avg_rating || 0;
		return {...content, average_rating: contentRate}
	})
	return (
		<div>
			<SectionTitle title={"More Like This"}/>
			{/* average_rating */}
			<ContentCardsList data={contentData} swiperSlids={4}/>
		</div>
	)
}

export default MoreLikeThis
