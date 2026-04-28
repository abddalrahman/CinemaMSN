"use client"
import React, { useEffect, useState } from 'react'
import FilterUserMeSec from './FilterUserMeSec';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import Link from 'next/link';
import { MdClose, MdDelete, MdKeyboardArrowDown } from 'react-icons/md';
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import ConfirmComp from '@/app/componentes/global/smallComp/ConfirmComp';
import { toast } from 'react-toastify';
import { AiOutlineQuestionCircle } from "react-icons/ai";
import PaginationComp from '@/app/componentes/global/PaginationComp';
import { DomainPath } from '@/utils/DomainPath';

const AdminsMessages = () => {
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState({
		lim: false,
		page: false
	})
	const [searchQ, setSearchQ] = useState({
		justNotReaded: true,
		page: 1,
		limit: 10,
		totalMessages: 0
	});
	const [deleteControle, setDeleteControle] = useState({
		messageID: null,
		showConfirm: false,
	});
	const [showSMForm, setShowSMForm] = useState({
		show: false,
		senderID: null,
	});

	const fetchData = async () => {
		try {
			setLoading(true);
			const messages = await fetchAPIFunc(`${DomainPath}/api/admin/messages?page=${searchQ.page}&limit=${searchQ.limit}&messageFor=admins
				${!searchQ.justNotReaded ? "&checked=true" : ""}`, "GET", {}
			);
			const result = await messages.json();
			if (messages.status === 200) {
				setData(result.data)
				setSearchQ({...searchQ, totalMessages: parseInt(result.dataLength)})
			} else {
				toast.error("Failed To Get genres");
				setData(null)
			}
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setData(null)
			console.log(error);
			return toast.error("something want wrong")
		}
	}

	const checkContent = (mID) => {
		setDeleteControle({
			messageID: mID,
			showConfirm: true
		});
	}
	
	const handleConfirm = async () => {
		try {
			setLoading(true)
			setDeleteControle({
				...deleteControle,
				showConfirm: false
			})
			if (deleteControle.messageID) {
				const respons = await fetchAPIFunc(`${DomainPath}/api/admin/messages`, "DELETE", {id: deleteControle.messageID});
				const result = await respons.json();
				if (respons.status === 200) {
					setLoading(false);
					toast.success(result.message);
					setDeleteControle({
						messageID: null,
						showConfirm: false
					});
					await fetchData();
				} else {
					setLoading(false);
					setDeleteControle({
						messageID: null,
						showConfirm: false
					});
					return toast.error(result.message);
				}
			}

		} catch (error) {
			console.log(error);
			setLoading(false);
			setDeleteControle({
				messageID: null,
				showConfirm: false
			});
			return toast.error("something want wrong");
		}
		
	}
	const handleCansle = () => {
		setLoading(false);
		setDeleteControle({
			messageID: null,
			showConfirm: false
		});
		return;
	}

	useEffect(() => {
		const run = async () => {
			await fetchData();
		}
		run();
	}, [searchQ.justNotReaded, searchQ.page, searchQ.limit]);

	return (
		<>
			{loading ? <CoverL/> : ""}
			{
				deleteControle.showConfirm
				?
					<ConfirmComp data={{title: "Delete Message", body: "Are You Shur You Want To Delete This Message", noBtn: "No", 
						yesBtn: "Delete", bg: "d"}} callFuncs={{confirmFunc:handleConfirm, cansleFunc: handleCansle}}
					/>
				:
					''
			}
			{
				showSMForm.show
				?
					<div className='more-info-sender-id d-flex align-items-center justify-content-center position-fixed top-0 start-0 w-100 h-100'>
						<div className='p-3 b-g-d3 rounded-1'>
							<div className='d-flex align-items-center justify-content-between'>
								<span className='color-y fs-5'>Sent By?</span>
								<MdClose size={18} className='color-l c-p' onClick={() => setShowSMForm({show: false, senderID: null})}/>
							</div>
							<div className='d-flex align-items-center gap-2 mt-4'>
								<span className='color-g'>This Message Sent By</span>
								<Link target='blank' href={`/profile/${showSMForm.senderID}`}>{showSMForm.senderID}</Link> 
							</div>
						</div>
					</div>
				:
					''
			}
			<div className='mt-4'>
				{
					data === null
					?
						<div className='p-3 b-g-d3 color-l rounded-1'>
							Failed To Get Data
						</div>
					:
						<>
							<FilterUserMeSec data={{searchQ, setSearchQ}}/>
							{
								data.length > 0 
								?
									<>
										<div className='table-container overflow-auto'>
											<table className='messages-table fs-main'>
												<thead>
													<tr className='color-g fw-semibold'>
														<td><span>Title</span></td>
														<td><span>Body</span></td>
														<td><span>ReceiverID</span></td>
														<td><span>Reply To</span></td>
														<td><span>Action</span></td>
													</tr>
												</thead>
												<tbody className='table-body'>
													{
														data.map((message)=>(
															<tr key={message.m_id}>
																<td><span className='color-l '>{message.title}</span></td> 
																<td><span className='color-l text-start'>{message.body}</span></td>
																<td><span className='color-g text-capitalize fw-medium'>
																	<Link href={`/profile/${message.resever_id}`} target='blank'>{message.resever_id}</Link>
																</span></td>
																<td><span className={`${message.reply_to_id ? 'color-g' : 'color-l'}`}>
																	{message.reply_to_id ? message.reply_to_id : "None"}
																</span></td>
																<td>
																	<div className='d-flex align-items-center gap-3'>
																		<button className='color-l d-flex align-items-center bg-transparent border-0 p-0' onClick={() => setShowSMForm({
																			show: true,
																			senderID: message.sender_id
																		})}>
																			<AiOutlineQuestionCircle size={18}/>
																		</button>
																		<button className='color-r d-flex align-items-center gap-1 bg-transparent border-0 p-0' onClick={
																			() => setDeleteControle({
																				messageID: message.m_id,
																				showConfirm: true
																			})
																		}>
																			<MdDelete size={18}/>
																		</button>
																	</div>
																</td>
															</tr>
														))
													}
												</tbody>
												<tfoot>
													<tr>
														<td className='w-100'>
															<PaginationComp data={{elePerPage: searchQ.limit, total: Number(searchQ.totalMessages), page: searchQ.page, 
																filterVals: searchQ, setFilterPage: setSearchQ}}
															/>
														</td>
													</tr>
												</tfoot>
											</table>
										</div>
									</>
								:
									<div className='p-3 b-g-d3 color-l rounded-1'>
										No Data Found
									</div>
							}
						</>
				}
				
			</div>
		</>
	)
}

export default AdminsMessages
