"use client"
import { calcAge, fetchAPIFunc } from '@/utils/clientRandomFunc'
import React, { useEffect, useRef, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { LuInfo } from "react-icons/lu";
import ContactForm from '@/app/contact/ContactForm';
import ConfirmComp from '../global/smallComp/ConfirmComp';
import CoverL from '../global/smallComp/CoverL';
import { toast } from 'react-toastify';
import { DomainPath } from '@/utils/DomainPath';

const MessageDetailsAndRaply = ({ messageD, relatedM, closeFun, yourM, refresh }) => {
	const messageRef = useRef();
	const [updatingProcess, setUpdatingProcess] = useState({
		loading: false,
		result: false
	});
	const [showReply, setShowReply] = useState(false);
	const [loading, setLoading] = useState(false);
	const [deleteControle, setDeleteControle] = useState({
		messageID: null,
		owner: null,
		showConfirm: false
	});

	const updateMessage = async () => {
		try {
			setUpdatingProcess({
				loading: true,
				result: false
			})
			const updatedM = await fetchAPIFunc(`${DomainPath}/api/users/activity/sendMessage`, 'PUT', {id: messageD.m_id});
			const result = await updatedM.json();
			if (updatedM.status === 200) {
				setUpdatingProcess({
					loading: false,
					result: true
				})
				return
			} else {
				setUpdatingProcess({
					loading: false,
					result: false
				})
				return
			}
		} catch (error) {
			setUpdatingProcess({
				loading: false,
				result: false
			})
			console.log(error);
			return;
		}
	}

	const afterReplyFunc = () => {
		refresh();
		messageRef.current.classList.remove("show")
		setTimeout(() => {
			closeFun({
				show: false,
				mData: null,
				relateMD: null
			})
		}, 200);
	}
		
	const deleteMessage = () => {
		messageRef.current.classList.remove("show")
		setDeleteControle({
			messageID: messageD.m_id,
			owner: messageD.user_id,
			showConfirm: true
		});
	}
	
	const handleConfirm = async () => {
		setLoading(true)
		setDeleteControle({
			...deleteControle,
			showConfirm: false
		})
		if (deleteControle.messageID) {
			try {
				const respons = await fetchAPIFunc(`${DomainPath}/api/users/activity/sendMessage`, "DELETE", {id: deleteControle.messageID});
				const result = await respons.json();
				if (respons.status === 200) {
					setLoading(false);
					toast.success(result.message);
					setDeleteControle({
						messageID: null,
						owner: null,
						showConfirm: false
					});
					afterReplyFunc();
				} else {
					setLoading(false);
					setDeleteControle({
						messageID: null,
						owner: null,
						showConfirm: false
					});
					return toast.error(result.message);
				}
			} catch (error) {
				console.log(error);
				setLoading(false);
				setDeleteControle({
					messageID: null,
					owner: null,
					showConfirm: false
				});
				return toast.error("something want wrong");
			}
		}
		
	}
	const handleCansle = () => {
		setLoading(false);
		messageRef.current.classList.add("show")
		setDeleteControle({
			messageID: null,
			owner: null,
			showConfirm: false
		});
		return;
	}

	useEffect(() => {
		setTimeout(() => {
			messageRef.current.classList.add('show');
		}, 50);
		const run = async () => {
			if (!yourM && !messageD.m_checked) {
				await updateMessage();
			}
		}
		run();
	}, []);

	if (yourM) {
		return(
			<>
				{loading ? <CoverL/> : ''}
				{
					deleteControle.showConfirm
					?
						<ConfirmComp data={{title: "Delete Message", body: "Are You Shur You Want To Delete This Message", noBtn: "No", yesBtn: "Delete", bg: "d"}}
							callFuncs={{confirmFunc:handleConfirm, cansleFunc: handleCansle}}
						/>
					:
						''
				}
				<div ref={messageRef} className='show-m-details-box cover d-flex align-items-center justify-content-center'>
					<div className='b-g-d3 p-3 rounded-1 overflow-auto'>
						<div className='d-flex align-items-center justify-content-between'>
							<h5 className='color-y text-capitalize fw-semibold'>{messageD.title}</h5>
							<MdClose size={18} className='color-l c-p' onClick={() => {
								messageRef.current.classList.remove("show")
								setTimeout(() => {
									closeFun({
									show: false,
									mData: null,
									relateMD: null
								})}, 200);
							}}/>
						</div>
						<p className='color-g my-3'>{messageD.body}</p>
						<span className='d-flex align-items-center gap-2'>
							<span className='color-l fw-bold'>Sent Date:</span>
							<span className='color-g'>{calcAge(messageD.created_at)}</span>
						</span>
						{
							relatedM
							?
								<div>
									<span className='color-l mt-5 mb-2 d-flex align-items-center gap-1'>
										<LuInfo size={16} className='color-y'/> <span>This message is a reply to following message</span>
									</span>
									<h5 className='color-l opacity-50'>{relatedM.title}</h5>
									<p className='color-g opacity-50'>{relatedM.body}</p>
								</div>
							:''
						}
						<button className='color-l border-0 py-1 px-2 rounded-1 b-g-l-l' onClick={deleteMessage}>Delete</button>
					</div>
				</div>
			</>
		)
	}
	return (
		<div ref={messageRef} className='show-m-details-box cover d-flex align-items-center justify-content-center'>
			<div className='b-g-d3 p-3 rounded-1 overflow-auto'>
				<div className='d-flex align-items-center justify-content-between'>
					<h5 className='color-y text-capitalize fw-semibold'>{messageD.title}</h5>
					<MdClose size={18} className={`color-l c-p ${updatingProcess.loading ? "disabled" : ""}`} onClick={() => {
						updatingProcess.loading
						? 
							''
						:
							messageRef.current.classList.remove("show")
							updatingProcess.result ? refresh() : ""
							setTimeout(() => {
								closeFun({
								show: false,
								mData: null,
								relateMD: null
							})}, 200);
					}}/>
				</div>
				<p className='color-g my-3'>{messageD.body}</p>
				<span className='d-flex align-items-center gap-2'>
					<span className='color-l fw-bold'>Sent Date:</span>
					<span className='color-g'>{calcAge(messageD.created_at)}</span>
				</span>
				{
					relatedM
					?
						<div>
							<span className='color-l mt-5 mb-2 d-flex align-items-center gap-1'>
								<LuInfo size={16} className='color-y'/> <span>This message is a reply to your following message</span>
							</span>
							<h5 className='color-l opacity-50'>{relatedM.title}</h5>
							<p className='color-g opacity-50'>{relatedM.body}</p>
						</div>
					:''
				}
				<span className='d-flex w-f-c py-1 px-2 mb-2 rounded-1 show-reply-btn align-items-center color-l c-p' onClick={() => setShowReply(!showReply)}>
					{showReply ? "Hide Reply" : "Reply"}
				</span>
				{
					showReply && !yourM
					?
						<ContactForm toProfile={true} mID={messageD.m_id} refresh={afterReplyFunc}/>
					:''
				}
			</div>
		</div>
	)
}

export default MessageDetailsAndRaply
