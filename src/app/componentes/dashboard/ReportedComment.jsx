"use client"
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link';
import { FaCommentAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import CoverL from '../global/smallComp/CoverL';
import ConfirmComp from '../global/smallComp/ConfirmComp';
import { Spinner } from 'react-bootstrap';
import { DomainPath } from '@/utils/DomainPath';

const ReportedComment = () => {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);
	const [deleteControle, setDeleteControle] = useState({
		showConfirm: false,
		commentID: null
	})
	const commentsBody = useRef([]);
	
	const getData = async () => {
		try {
			setLoading("getData");
			const comments = await fetchAPIFunc(`${DomainPath}/api/admin/showData/getReportedComments?page=1&limit=10`, "GET", {});
			const comResult = await comments.json();
			if (comments.status === 200) {
				setComments(comResult.data)
			} else {
				setComments(null)
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
			setComments(null)
			setLoading(false);
		}
	}

	const handleReadMore = (index) => {
		if (!commentsBody.current[index].classList.contains('all')) {
			commentsBody.current[index].classList.add('all');
			commentsBody.current[index].querySelector('span:first-of-type').textContent = comments[index].body;
			commentsBody.current[index].querySelector('span:last-of-type').textContent = " Read Less";
		} else {
			commentsBody.current[index].classList.remove('all');
			commentsBody.current[index].querySelector('span:first-of-type').textContent = comments[index].body.substring(0, 170) + "...";
			commentsBody.current[index].querySelector('span:last-of-type').textContent = " Read More";
		}
		
	}

	const deleteComment = (comID) => {
		setDeleteControle({
			showConfirm: true,
			commentID: comID
		});
	}
	
	const handleConfirm = async () => {
		setLoading(true)
		setDeleteControle({
			...deleteControle,
			showConfirm: false
		})
		if (deleteControle.commentID) {
			try {
				const respons = await fetchAPIFunc(`${DomainPath}/api/users/activity/commenting`, "DELETE", {id: deleteControle.commentID});
				const result = await respons.json();
				if (respons.status === 200) {
					setLoading(false);
					setDeleteControle({
						showConfirm: false,
						commentID: null
					});
					toast.success(result.message);
					getData();
				} else {
					setLoading(false);
					setDeleteControle({
						showConfirm: false,
						commentID: null
					});
					return toast.error(result.message);
				}
			} catch (error) {
				console.log(error);
				setLoading(false);
				setDeleteControle({
					showConfirm: false,
					commentID: null
				});
				return toast.error("something want wrong");
			}
		}
		
	}

	const handleCansle = () => {
		setLoading(false);
		setDeleteControle({
			showConfirm: false,
			commentID: null
		});
		return;
	}

	useEffect(() => {
		const run = async () => {
			await getData();
		}
		run();
	}, [])

	if (comments === null) {
		return (
			<div className='b-g-d3 rounded-1 p-3 color-l'>
				Failed To Get Reported Comments
			</div>
		)
	}

	return (
		<>
			{loading === true ? <CoverL/> : ''}
			{
				deleteControle.showConfirm
				?
					<ConfirmComp data={{title: "Delete Comment", body: "Are You Shur You Want To Delete This Comment", noBtn: "No", yesBtn: "Delete", bg: "d"}}
						callFuncs={{confirmFunc:handleConfirm, cansleFunc: handleCansle}}
					/>
				:
					''
			}
			{
				loading === "getData"
				?
					<div className='p-5 d-flex align-items-center justify-content-center'>
						<Spinner animation="border" variant="danger" />
					</div>
				:
					<div className='reported-comments d-flex flex-column overflow-hidden mb-4 overflow-hidden'>
						<div className='reported-top d-flex align-items-center p-3 b-g-d3'>
							<FaCommentAlt className='color-r'/>
							<span className='ms-2 color-l fw-bold'>Reported Comments</span>
						</div>
						<ul className='mb-0'>
							{
								comments.length > 0
								?
									comments.map((comment, index)=>(
										<li key={comment.comment_id}>
											<div className='p-4 b-g-d2 main-transition'>
												<div className='d-flex align-items-center gap-2 gap-lg-3 flex-wrap mb-3'>
													<h5 className='color-l fw-semibold fs-md'>{'"' + comment.title + '"'}</h5>
													<span className='color-r fw-bold text-uppercase r-op-bg fs-sm'>{comment.abuse_reports_count + " Reports"}</span>
													<span className='color-g fw-semibold fs-sm'>
														{new Date(comment.created_at).getDay().toString() + " " + months[new Date(comment.created_at).getMonth()].toString() + " " + 
															new Date(comment.created_at).getFullYear() + " " + new Date(comment.created_at).getHours() + ":" +
															new Date(comment.created_at).getMinutes() + ":" + new Date(comment.created_at).getSeconds() 
														}
													</span>
												</div>
												<p ref={(el)=> commentsBody.current[index] = el} className='color-g fs-main'>
													<span>{comment.body?.substring(0, 170) + "..." || 'ss'}</span> 
													<span className='read-more-btn color-r fw-bold c-p' onClick={() => handleReadMore(index)}> Read More</span>
												</p>
												<div className=' d-flex align-items-center gap-2 gap-lg-3 flex-wrap'>
													<div className='color-dg fw-bold fs-main'>
														Target: <Link className='color-r fw-medium' href={`/details/${comment?.content_id}`}>View Related Content</Link>
													</div>
													<div className='color-dg fw-bold fs-main'>
														Author: <Link className='color-r fw-medium' href={`/profile/${comment.user_id}`}>View Related User</Link>
													</div>
												</div>
												<div className='active-btn d-flex align-items-center gap-3 mt-4'>
													<button className='main-red-btn d-flex align-items-center gap-2' onClick={() => deleteComment(comment.comment_id)}>
														<MdDelete size={20}/>
														<span>Delete</span>
													</button>
												</div>
											</div>
										</li>
									))
								:
									<li className='d-flex align-items-center p-3 b-g-d2 color-l'>No Comments to Display</li>
							}
						</ul>
					</div>
			}
		</>
	)
}

export default ReportedComment
