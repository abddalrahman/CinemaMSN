import HeadAndText from '@/app/componentes/global/smallComp/HeadAndText'
import React from 'react'
import AddNewsForm from './AddNewsForm'

const AddNews = () => {
	return (
		<div className='main-container pb-5 pt-120 mb-5'>
			<div className='add-news-page mb-5'>
				<HeadAndText title= "Add Genre" text= "All Fields are required ; You cannot edit item information, so data must be entered accurately." />
				<div className='my-5 pb-5'>
					<AddNewsForm/>
				</div>
			</div>
		</div>
	)
}

export default AddNews
