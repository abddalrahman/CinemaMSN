import React from 'react'
import "../dashboard.css"
import HeadAndText from '@/app/componentes/global/smallComp/HeadAndText'
import UserBody from './UserBody'

const Users = () => {
	return (
		<div className='main-container pb-5 pt-120'>
			<div className='manage-users-page'>
				<HeadAndText title= "Users Management" text="Modify user permissions and control the activation and deactivation of users."/>
				<UserBody/>
			</div>
		</div>
	)
}

export default Users
