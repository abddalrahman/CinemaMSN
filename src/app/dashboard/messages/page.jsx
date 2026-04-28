"use client"
import HeadAndText from '@/app/componentes/global/smallComp/HeadAndText'
import React, { useState } from 'react'
import UserMessages from './UserMessages'
import AdminsMessages from './AdminsMessages'
import "../dashboard.css"

const Messages = () => {
	const [showUserMessage, setShowUserMessage] = useState(true)
	return (
		<div className='main-container pb-5 pt-120'>
			<div className='manage-messages-page'>
				<div className='d-flex align-items-end justify-content-between mb-4'>
					<HeadAndText title= "Manage Messages" text="You can check incoming messages, mark them as read, and reply to them. You can also view and 
						delete messages sent by administrators to users."
					/>
				</div>
				<div className={`d-flex align-items-center mb-4 messages-taps py-2 position-relative ${showUserMessage ? "" : "translate-r"}`}>
					<span className={`${showUserMessage ? "active" : ""}`} onClick={() => setShowUserMessage(true)}>User Messages</span>
					<span className={`${!showUserMessage ? "active" : ""}`} onClick={() => setShowUserMessage(false)}>Admin Messages</span>
				</div>
				{
					showUserMessage
					?
						<UserMessages/>
					:
						<AdminsMessages/>
				}
			</div>
		</div>
	)
}

export default Messages
