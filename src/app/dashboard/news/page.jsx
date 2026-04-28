import BasicLink from '@/app/componentes/global/smallComp/BasicLink'
import HeadAndText from '@/app/componentes/global/smallComp/HeadAndText'
import React from 'react'
import { MdAdd } from 'react-icons/md'
import "../dashboard.css"
import NewsBody from './NewsBody'

const News = () => {
	return (
		<div className='main-container pb-5 pt-120'>
			<div className='manage-news-page'>
				<div className='content-page-top d-flex align-items-end justify-content-between mb-4 flex-wrap gap-3'>
					<HeadAndText title= "Manage News" text="Add, delete, and edit news articles. And add relationships between news articles, content, and people."/>
					<BasicLink data={{label: "Add News", icon: MdAdd, size: 20, To:"/dashboard/news/add", styling:"main-red-btn"}}/>
				</div>
				<NewsBody/>
			</div>
		</div>	
	)
}

export default News
