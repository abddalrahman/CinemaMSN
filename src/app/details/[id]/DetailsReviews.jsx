"use client"
import CommentCard from '@/app/componentes/global/CommentCard';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import React, { useEffect, useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md';
import AddComment from './AddComment';
import { DomainPath } from '@/utils/DomainPath';

const DetailsReviews = ({ data, cID, rates }) => {
	const [activeData, setActiveData] = useState(null);
	const [showAddReview, setShowAddReview] = useState(false);
	const [showAllComments, setShowAllComments] = useState(false);
	
	const getActiveWC = async () => {
		let activeWithComment, result;
		try {
			activeWithComment = await fetchAPIFunc(`${DomainPath}/api/users/getActiveWithComment?contentId=${cID}`, "GET", {});
			result = await activeWithComment.json();
			if (activeWithComment.status === 200) {
				setActiveData(result);
			} else {
				setActiveData(null);
			}
			return;
		} catch (error) {
			console.log(error);
			setActiveData(null);
		}
	}
	
	useEffect(() => {
		if (data || data.length > 0){
			const run = async () => {
				await getActiveWC()
			}
			run();
		}
	}, [])

	return (
		<>
			{
				showAddReview
				?
					<AddComment hideForm={setShowAddReview} contentId={cID}/>
				:''
			}
			{
				showAllComments
				?
					<div className='cover d-flex align-items-center justify-content-center'>
						<div className='all-comments-list'>
							<div className='d-flex align-items-center justify-content-between'>
								<h3 className='color-y fw-semibold'>All Comments</h3>
								<MdClose size={20} className='color-l c-p' onClick={() => setShowAllComments(false)}/>
							</div>
							<div className='b-g-d2 p-3 rounded-1'>
								{
									data.map((review) => (
										<CommentCard key={review.user_id} data={{ commentID: review.comment_id, userId: review.user_id, contentId: cID, 
											comTitle: review.title, comBody: review.body, rate: rates, created: review.created_at, updated: review.updated_at, 
											likes: review.likes_count, spoilerAuther: review.is_spoiler_by_author, spoilerMember: review.spoiler_reports_count, 
											reported: review.abuse_reports_count, currentUser: null, forProfile: false, profile_img: review.profile_image_url, 
											userName: review.username, isLike: activeData ? activeData.find((like) => like.active === "like" && 
											like.comment_id === review.comment_id) : false, isSpoiler: activeData ? activeData.find((spoiler) => spoiler.active === "spoiler" 
											&& spoiler.comment_id === review.comment_id) : false, isReport: activeData ? 
											activeData.find((report) => report.active === "report" && report.comment_id === review.comment_id) : false,
											refreshData: getActiveWC
										}}
										/>
									))
								}
							</div>
						</div>
					</div>
				:''
			}
			<div className='reviews-cards my-5 pb-5'>
				{
					data.slice(0, 3).map((review) => (
						<CommentCard key={review.user_id} data={{ commentID: review.comment_id, userId: review.user_id, contentId: cID, comTitle: review.title, 
							comBody: review.body, rate: rates, created: review.created_at, updated: review.updated_at, likes: review.likes_count, 
							spoilerAuther: review.is_spoiler_by_author, spoilerMember: review.spoiler_reports_count, reported: review.abuse_reports_count, 
							currentUser: null, forProfile: false, profile_img: review.profile_image_url, userName: review.username, 
							isLike: activeData ? activeData.find((like) => like.active === "like" && like.comment_id === review.comment_id) : false, 
							isSpoiler: activeData ? activeData.find((spoiler) => spoiler.active === "spoiler" && spoiler.comment_id === review.comment_id) : false, 
							isReport: activeData ? activeData.find((report) => report.active === "report" && report.comment_id === review.comment_id) : false,
							refreshData: getActiveWC
						}}
						/>
					))
				}
				{
					data.length > 3
					?
						<div className='mt-5 see-all-btn d-flex align-items-center justify-content-between'>
							<span className='fw-bold color-l py-2 px-3 rounded-5 borderd-link' onClick={() => setShowAllComments(true)}>See All Reviews</span>
							<button className='add-review-btn d-flex align-items-center gap-1 bg-transparent p-0 color-r' onClick={() => 
								setShowAddReview(!showAddReview)}
							>
								<MdAdd size={20}/> <span>Review</span>
							</button>
						</div>
					:
						<div className='mt-5 see-all-btn'>
							<button className='add-review-btn d-flex align-items-center gap-1 main-red-btn' onClick={() => setShowAddReview(!showAddReview)}>
								<MdAdd size={20}/> <span>Review</span>
							</button>
						</div>
				}
			</div>
		</>
	)
}

export default DetailsReviews
