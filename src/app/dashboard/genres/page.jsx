import HeadAndText from '@/app/componentes/global/smallComp/HeadAndText'
import React from 'react'
import GenresBody from './GenresBody'
import BasicLink from '@/app/componentes/global/smallComp/BasicLink'
import { MdAdd } from 'react-icons/md'
import "../dashboard.css"

const Genres = () => {
	return (
		<div className='main-container pb-5 pt-120'>
			<div className='manage-genres-page'>
				<div className='d-flex align-items-end flex-wrap gap-3 justify-content-between'>
					<HeadAndText title= "Genres Management" text="View the genres and add or delete an genre."/>
					<BasicLink data={{label: "Add Genre", icon: MdAdd, size: 20, To:"/dashboard/genres/add", styling:"main-red-btn"}}/>
				</div>
				<GenresBody/>
			</div>
		</div>
	)
}

export default Genres
