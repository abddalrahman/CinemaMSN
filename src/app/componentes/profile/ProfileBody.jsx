import React from 'react'
import ShowToast from '../global/smallComp/ShowToast';
import DisplayProfileSections from './DisplayProfileSections';
import DisplayUserReviews from './DisplayUserReviews';
import DisplayUserPeople from './DisplayUserPeople';
import DisplayMessages from './DisplayMessages';
import DisplaySavedNews from './DisplaySavedNews';
import DisplayInterests from './DisplayInterests';
import DisplayFollowing from './DisplayFollowing';

const ProfileBody = ({ data, token }) => {
	if (data === null || token === null) {
		return <ShowToast info={{messageText: "missing data", type: "error", changePath: "/"}}/>
	}
	return (
		<div className='profile-body mt-5'>
			<div className="main-container">
				<div className='row'>
					<div className='left-section col-12 col-lg-8'>
						{
							!data.is_ratings_private || data.user_id === token.id
							?
								<DisplayProfileSections data={{title: "Ratings", myP: data.user_id === token.id, displayData: "Ratings", id: data.user_id, 
									status: data.is_ratings_private}}
								/>
							:''
						}
						{
							!data.is_watchlist_private || data.user_id === token.id
							?
								<DisplayProfileSections data={{title: "Watchlist", myP: data.user_id === token.id, displayData: "Watchlist", id: data.user_id, 
									status: data.is_watchlist_private}}
								/>
							:''
						}
						{
							!data.is_watched_private || data.user_id === token.id
							?
								<DisplayProfileSections data={{title: "Watched", myP: data.user_id === token.id, displayData: "Watched", id: data.user_id, 
									status: data.is_watched_private}}
								/>
							:''
						}
						<DisplayUserReviews data={{ id: data.user_id, tokenUID: token.id }}/>
						{
							!data.is_favorite_people_private || data.user_id === token.id
							?
								<DisplayUserPeople data={{id: data.user_id, myP: Number(data.user_id) === Number(token.id), isPrivate: data.is_favorite_people_private}}/>
							:''
						}
					</div>
					<div className='right-section col-12 col-lg-4'>
						<DisplayFollowing id={data.user_id}/>
						{
							data.user_id === token.id
							?
							<DisplayMessages id={data.user_id}/>
							:''
						}
						<DisplayInterests id={data.user_id}/>
						{
							!data.is_news_saved_private || data.user_id === token.id
							?
								<DisplaySavedNews data={{id: data.user_id, myP: data.user_id === token.id, isPrivate: data.is_news_saved_private}}/>
							:''
						}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProfileBody
