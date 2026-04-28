"use client"
import React, { useEffect, useState } from 'react'
import SectionTitle from '../global/smallComp/SectionTitle'
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import CommentCard from '../global/CommentCard';
import AddComment from '@/app/details/[id]/AddComment';
import { Spinner } from 'react-bootstrap';
import { DomainPath } from '@/utils/DomainPath';

const DisplayUserReviews = ({ data }) => {
	const { id, tokenUID } = data;
	const [reviews, setReviews] = useState({
		data: null,
		dLength: 0
	})
	const [loading, setLoading] = useState(false);
	const [showAddReview, setShowAddReview] = useState({
		id: null,
		show: false
	})
	const [activeData, setActiveData] = useState(null);

	const getUserReviews = async (limit= null) => {
		try {
			setLoading(true)
			const respons = await fetchAPIFunc(`${DomainPath}/api/users/profile/getMyReviews?id=${id}${limit ? "&limited=t": ""}`, "GET", {});
			const result = await respons.json();
			if (respons.status === 200) {
				setReviews({
					data: result.data,
					dLength: result.dataLength
				});
				if (Number(id) !== Number(tokenUID)) {
					await getActiveWC();
				}
				setLoading(false);
			} else {
				setReviews({
					data: undefined,
					dLength: 0
				});
				setLoading(false);
			}
			return
		} catch (error) {
			console.log(error);
			setReviews({
				data: undefined,
				dLength: 0
			});
			setLoading(false);
			return
		}
	}

	const getActiveWC = async () => {
		try {
			const activeWithComment = await fetchAPIFunc(`${DomainPath}/api/users/getActiveWithComment?get=all`, "GET", {});
			const result = await activeWithComment.json();
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
		const run = async () => {
			await getUserReviews(true);
			if (Number(id) !== Number(tokenUID)) {
				await getActiveWC();
			}
		}
		run();
	}, [])

	return (
		<>
			{
				showAddReview.show && showAddReview.id
				?
					<AddComment hideForm={setShowAddReview} contentId={showAddReview.id} fromProfile={true} getMyReviews={getUserReviews}/>
				:''
			}
			<div className='mb-5 pb-5'>
				<SectionTitle title={"Reviews"} inHead={reviews.dLength}/>
				<div className='reviews d-flex flex-column gap-4'>
					{
						!loading && reviews.data !== null
						?
							reviews.data !== undefined
							?
								reviews.data.length > 0
								?
									reviews.data.map((review) => (
										<CommentCard key={review.content_id} data={{ commentID: review.comment_id, userId: review.user_id, contentId: review.content_id, 
											poster: review.poster_url, conTitle: review.title, comTitle:review.comment_title, comBody: review.body, rate: review.user_rating, 
											created: review.created_at, updated: review.updated_at, likes: review.likes_count, spoilerAuther: review.is_spoiler_by_author, 
											spoilerMember: review.spoiler_reports_count, reported: review.abuse_reports_count, currentUser: tokenUID, forProfile: true,
											isLike: activeData ? activeData.find((like) => like.active === "like" && like.comment_id === review.comment_id) : false, 
											isSpoiler: activeData ? activeData.find((spoiler) => spoiler.active === "spoiler" && spoiler.comment_id === review.comment_id) : false, 
											isReport: activeData ? activeData.find((report) => report.active === "report" && report.comment_id === review.comment_id) : false,
											refreshData: getUserReviews, showEdit: setShowAddReview 
										}}/>
									))
								:
									<div className='p-3 color-l rounded-1 b-g-d3'>
										No Reviews Yet
									</div>
							:
								<div className='p-3 color-l rounded-1 b-g-d3'>
									Failed To Get Data
								</div>
						:
							<div className='d-flex align-items-center justify-content-center p-5'>
								<Spinner animation="border" variant="danger" />
							</div>
					}
				</div>
			</div>
			{
				!loading
				?
					reviews.data && reviews.data.length <= 10 && reviews.dLength > 10
					?
						<div className='d-flex align-items-center justify-content-center my-5'>
							<button className='see-all-btn borderd-link px-3 py-2' onClick={() => getUserReviews(null)}>Show All</button>
						</div>
					:
						reviews.data && reviews.data.length > 10
						?
							<div className='d-flex align-items-center justify-content-center my-5'>
								<button className='see-all-btn borderd-link px-3 py-2' onClick={() => getUserReviews(true)}>Show Less</button>
							</div>
						:''
				:''
			}
		</>
	)
}

export default DisplayUserReviews
