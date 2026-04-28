"use client"
import React, { useEffect, useState } from 'react'
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import { toast } from 'react-toastify';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { PiWarningFill } from "react-icons/pi";
import { FaFire } from "react-icons/fa6";
import FilterCommentSection from './FilterCommentSection';
import PaginationComp from '@/app/componentes/global/PaginationComp';
import ConfirmComp from '@/app/componentes/global/smallComp/ConfirmComp';
import { DomainPath } from '@/utils/DomainPath';

const CommentBody = () => {
	const [searchQ, setSearchQ] = useState({
		spoiler: 0,
		report: 0,
		page: 1,
		limit: 10,
		totalComment: 0
	});
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [deleteControle, setDeleteControle] = useState({
		showConfirm: false,
		commentID: null
	})
	const [loadingDelete, setLoadingDelete] = useState(false);
	
	const fetchData = async () => {
		try {
			setLoading(true);
			const genres = await fetchAPIFunc(`${DomainPath}/api/admin/comments?spoiler=${searchQ.spoiler}&report=${searchQ.report}
				&page=${searchQ.page}&limit=${searchQ.limit}`, "GET", {});
			const result = await genres.json();
			if (genres.status === 200) {
				setData(result.data)
				setSearchQ({...searchQ, totalComment: parseInt(result.dataLength)})
			} else toast.error("Failed To Get comments");
			setLoading(false);
		} catch (error) {
			setLoading(false);
			return toast.error("something want wrong")
		}
	}

	const deleteComment = (comID) => {
		setDeleteControle({
			showConfirm: true,
			commentID: comID
		});
	}
	
	const handleConfirm = async () => {
		setLoadingDelete(true)
		setDeleteControle({
			...deleteControle,
			showConfirm: false
		})
		if (deleteControle.commentID) {
			try {
				const respons = await fetchAPIFunc(`${DomainPath}/api/users/activity/commenting`, "DELETE", {id: deleteControle.commentID});
				const result = await respons.json();
				if (respons.status === 200) {
					setLoadingDelete(false);
					setDeleteControle({
						showConfirm: false,
						commentID: null
					});
					toast.success(result.message);
					fetchData();
				} else {
					setLoadingDelete(false);
					setDeleteControle({
						showConfirm: false,
						commentID: null
					});
					return toast.error(result.message);
				}
			} catch (error) {
				console.log(error);
				setLoadingDelete(false);
				setDeleteControle({
					showConfirm: false,
					commentID: null
				});
				return toast.error("something want wrong");
			}
		}
		
	}

	const handleCansle = () => {
		setLoadingDelete(false);
		setDeleteControle({
			showConfirm: false,
			commentID: null
		});
		return;
	}

	useEffect(() => {
		const run = async () => {
			await fetchData();
		}
		run();
	}, [searchQ.spoiler, searchQ.report, searchQ.limit, searchQ.page])

	return (
		<>
			{
				loading ? <CoverL/> : ''
			}
			{
				deleteControle.showConfirm
				?
					<ConfirmComp data={{title: "Delete Comment", body: "Are You Shur You Want To Delete This Comment", noBtn: "No", yesBtn: "Delete", bg: "d"}}
						callFuncs={{confirmFunc:handleConfirm, cansleFunc: handleCansle}}
					/>
				:
					''
			}
			<div className='mt-4'>
				<FilterCommentSection data={{searchQ, setSearchQ}}/>
				<div className='table-container overflow-auto'>
					<table className='comment-table'>
						<thead>
							<tr className='color-g fw-semibold'>
								<td><span>Title</span></td>
								<td><span>Body</span></td>
								<td><span>Spoiler</span></td>
								<td><span>Report</span></td>
								<td><span>Action</span></td>
							</tr>
						</thead>
						<tbody className='table-body'>
							{
								data.map((comment, index)=>(
									<tr key={index}>
										<td><span className='color-l '>{comment.title}</span></td> 
										<td><div className='position-relative comment-body-container'>
											<p className='color-l text-start comment-body mb-0'>{comment.body}</p></div></td>
										<td><span className='color-g text-capitalize fw-medium'>
											{
												comment.is_spoiler_by_author
												?
													<FaFire className='color-r' size={30}/>
												:
													parseInt(comment.spoiler_reports_count) > 0
													?
														<span className='position-relative spoiler-count'>
															<FaFire className='color-y' size={30}/>
															<span className='position-absolute color-l'>
																{parseInt(comment.spoiler_reports_count) > 99 ? `+99` : comment.spoiler_reports_count}
															</span>
														</span>
													:
														<span className='color-l'>0</span>
											}
										</span></td>
										<td>
											<span className="position-relative report-count">
												<PiWarningFill size={28} className='color-r'/>
												<span className='color-l position-absolute'>
													{parseInt(comment.abuse_reports_count) > 99 ? `+99` : comment.abuse_reports_count}
												</span>
											</span></td>
										<td>
											<button className='color-g d-flex align-items-center bg-transparent border-0 p-0' 
												onClick={() => deleteComment(comment.comment_id)}
											>
												<RiDeleteBin6Fill className='c-p' size={20}/>
											</button>
										</td>
									</tr>
								))
							}
						</tbody>
						<tfoot>
							<tr>
								<td className='w-100'>
									<PaginationComp data={{elePerPage: searchQ.limit, total: Number(searchQ.totalComment), page: searchQ.page, 
										filterVals: searchQ, setFilterPage: setSearchQ}}
									/>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</>
	)
}

export default CommentBody
