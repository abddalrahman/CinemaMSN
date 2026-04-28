"use client"
import { calcAge, fetchAPIFunc } from '@/utils/clientRandomFunc'
import React, { useEffect, useState } from 'react'
import SectionTitle from '../global/smallComp/SectionTitle';
import CoverL from '../global/smallComp/CoverL';
import { FaCheckDouble } from "react-icons/fa6";
import MessageDetailsAndRaply from './MessageDetailsAndRaply';
import { DomainPath } from '@/utils/DomainPath';

const DisplayMessages = ({ id }) => {
	const [allMessages, setAllMessages] = useState({
		userMessages: [],
		messagesToUser: []
	});
	const [loading, setLoading] = useState(false);
	const [showUserMessage, setShowUserMessage] = useState(true);
	const [showD, setShowD] = useState({
		show: false,
		mData: null,
		relateMD: null,
		yourM: false
	});

	const getMessages = async () => {
		try {
			setLoading(true);
			const messages = await fetchAPIFunc(`${DomainPath}/api/users/activity/sendMessage`, "GET", {});
			const result = await messages.json();
			if (messages.status === 200) {
				setAllMessages({
					userMessages: result.yourMessages,
					messagesToUser: result.messagesToYou
				});
			}	else {
				setAllMessages(null)
			}
			setLoading(false);
			return
		} catch (error) {
			console.log(error);
			setLoading(false);
			setAllMessages(null);
			return
		}
	}
	
	useEffect(() => {
		const run = async () => {
			await getMessages();
		}
		run();
	}, []);

	return (
		<>
			{
				showD.show && showD.mData !== null && showD.relateMD !== null
				?
					<MessageDetailsAndRaply messageD={showD.mData} relatedM={showD.relateMD} closeFun={setShowD} yourM={showD.yourM} refresh={getMessages}/>
				:""
			}
			<div className='profile-messages-sec mt-5'>
				<SectionTitle title={"Messages"} />
				<div className='position-relative'>
					{loading ? <CoverL boxed={true}/> : ""}
					{
						allMessages === null
						?
							<div className='color-l rounded-1 p-3 b-g-d3'>
								Failed To Get Messages
							</div>
						:
							allMessages.userMessages.length === 0 && allMessages.messagesToUser.length === 0
							?
								<div className='color-l rounded-1 p-3 b-g-d3'>
									No Messages
								</div>
							:
								<div className={`messages-box position-relative ${!showUserMessage && allMessages.userMessages.length > 2 ? "tall-messages" 
									: showUserMessage && allMessages.messagesToUser.length > 2 ? "tall-messages" : ""}`}
								>
									<div className='d-flex align-items-center profile-messages-tap'>
										<span className={`d-flex justify-content-center c-p color-l p-2 w-50 rounded-top-1 ${showUserMessage ? "b-g-d3" : ""}`} 
											onClick={() => setShowUserMessage(true)}
										>Inbox
										</span>
										<span className={`d-flex justify-content-center c-p color-l p-2 w-50 rounded-top-1 ${showUserMessage ? "" : "b-g-d3"}`}
											onClick={() => setShowUserMessage(false)}
										>My messages</span>
									</div>	
									<div className={`b-g-d3 overflow-auto rounded-bottom-1 ${showUserMessage ? "rounded-end-1" : "rounded-start-1"}`}>
										{
											showUserMessage && allMessages.messagesToUser.length > 0
											?
												<div className='messages-to-user'>
													<ul className='inbox-message p-3 mb-0'>
														{
															allMessages.messagesToUser.map((message) => (
																<li key={message.m_id} className='p-3 b-g-d2 rounded-1 mb-2 c-p' onClick={() => setShowD({
																	show: true,
																	mData: message,
																	relateMD: allMessages.userMessages.filter((m) => m.m_id === message.reply_to_id)[0] || undefined,
																	yourM: false
																})}>
																	<div className='d-flex align-items-center justify-content-between'>
																		<h6 className='color-l'>{message.title.length > 20 ? message.title.slice(0, 20) + "..." : message.title}</h6>
																		{
																			!message.m_checked
																			?
																				<span className='new-message-point'></span>
																			:''
																		}
																	</div>
																	<div className='d-flex align-items-center justify-content-between'>
																		<p className='color-g mb-0'>{message.body.length > 30 ? message.body.slice(0, 30) +  "..." : message.body}</p>
																		<span className='color-dg small fw-medium'>{calcAge(message.created_at)}</span>
																	</div>
																</li>
															))
														}
													</ul>
												</div>
											:
												showUserMessage
												?
													<div className='p-3'>
														<div className='color-l rounded-1 p-3 b-g-d2'>
															No Inbox Messages
														</div>
													</div>
												: ''
										}
										{
											!showUserMessage && allMessages.userMessages.length > 0
											?
												<div className='user-messages'>
													<ul className='inbox-message p-3 mb-0'>
														{
															allMessages.userMessages.map((message) => (
																<li key={message.m_id} className='p-3 b-g-d2 rounded-1 mb-2 c-p' onClick={() => setShowD({
																	show: true,
																	mData: message,
																	relateMD: allMessages.messagesToUser.filter((m) => m.m_id === message.reply_to_id)[0] || undefined,
																	yourM: true
																})}>
																	<div className='d-flex align-items-center justify-content-between'>
																		<h6 className='color-l'>{message.title.length > 20 ? message.title.slice(0, 20) + "..." : message.title}</h6>
																		<FaCheckDouble size={14} className={`${message.m_checked ? "color-y" : "color-g"}`}/>
																	</div>
																	<div className='d-flex align-items-center justify-content-between'>
																		<p className='color-g mb-0'>{message.body.length > 30 ? message.body.slice(0, 30) +  "..." : message.body}</p>
																		<span className='color-dg small fw-medium'>{calcAge(message.created_at)}</span>
																	</div>
																</li>
															))
														}
													</ul>
												</div>
											:
												!showUserMessage
												?
													<div className='p-3'>
														<div className='color-l rounded-1 p-3 b-g-d2'>
															No Messages
														</div>
													</div>
												: ''
										}
									</div>
								</div>
					}
				</div>
			</div>
		</>
	)
}

export default DisplayMessages
