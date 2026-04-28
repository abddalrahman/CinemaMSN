import HeadAndText from '@/app/componentes/global/smallComp/HeadAndText'
import React from 'react'
import AddGenresFoem from './AddGenresFoem'

const AddGenre = () => {
	return (
		<div className='main-container pb-5 pt-120 mb-5'>
			<div className='add-content-page mb-5'>
				<HeadAndText title= "Add Genre" text= "All Fields are required ; You cannot edit item information, so data must be entered accurately." />
				<div className='my-5 pb-5'>
					<AddGenresFoem/>
				</div>
			</div>
		</div>
	)
}

export default AddGenre
