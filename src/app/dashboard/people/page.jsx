import HeadAndText from '@/app/componentes/global/smallComp/HeadAndText'
import React from 'react'
import BasicLink from '@/app/componentes/global/smallComp/BasicLink'
import { MdAdd } from 'react-icons/md'
import "../dashboard.css"
import PeopleBody from './PeopleBody'

const People = () => {
	return (
		<div className='main-container pb-5 pt-120'>
			<div className='manage-people-page'>
				<div className='d-flex align-items-end justify-content-between flex-wrap gap-3'>
					<HeadAndText title= "People Management" text="Add, Delete, Edit, and Read People."/>
					<BasicLink data={{label: "Add Person", icon: MdAdd, size: 20, To:"/dashboard/people/add", styling:"main-red-btn"}}/>
				</div>
				<PeopleBody/>
			</div>
		</div>
	)
}

export default People
