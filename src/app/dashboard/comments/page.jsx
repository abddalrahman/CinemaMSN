import HeadAndText from '@/app/componentes/global/smallComp/HeadAndText'
import React from 'react'
import CommentBody from './CommentBody'
import "../dashboard.css"

const CommentsManag = () => {
	return (
		<div className='main-container pb-5 pt-120'>
			<div className='manage-comments-page'>
				<HeadAndText title= "Comments Management" text="Monitor reviews and check for review and comments containing spoilers. You can only delete the review; you cannot edit it. Spoilers flagged by the reviewer will appear in red, while those flagged by users will appear in yellow."/>
				<CommentBody/>
			</div>
		</div>
	)
}

export default CommentsManag
