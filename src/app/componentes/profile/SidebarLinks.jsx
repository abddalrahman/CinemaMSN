"use client"
import React from 'react'
import BasicLink from '../global/smallComp/BasicLink'
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { FaListUl } from "react-icons/fa6";
import { MdHistory, MdOutlineFavorite, MdDashboardCustomize } from "react-icons/md";
import { PiNewspaperFill } from "react-icons/pi";
import { FaCommentAlt } from "react-icons/fa";
import { usePathname } from 'next/navigation';

const SidebarLinks = ({userInfo}) => {
	const pathName = usePathname();
	
	return (
		<div className='side-body d-flex flex-column gap-2 py-3 mb-5'>
			<BasicLink data={{
				label: 'Overview', icon: RiDashboardHorizontalFill, size: 22 , color: "#94a3b8", To:"/profile",
				styling: `fw-semibold color-g py-2 px-2 rounded-2 ${pathName.endsWith('/profile') ? "active" : ''}`
			}}/>
			<BasicLink data={{
				label: 'Watchlist', icon: FaListUl, size: 22 , color: "#94a3b8", To:"/profile/watchlist",
				styling: `fw-semibold color-g py-2 px-2 rounded-2 ${pathName.endsWith('/watchlist') ? "active" : ''}`
			}}/>
			<BasicLink data={{
				label: 'Watching History', icon: MdHistory, size: 22 , color: "#94a3b8", To:"/profile/wHistory",
				styling: `fw-semibold color-g py-2 px-2 rounded-2 ${pathName.endsWith('/wHistory') ? "active" : ''}`
			}}/>
			<BasicLink data={{
				label: 'Favorite People', icon: MdOutlineFavorite, size: 22 , color: "#94a3b8", To:"/profile/Favorite",
				styling: `fw-semibold color-g py-2 px-2 rounded-2 ${pathName.endsWith('/Favorite') ? "active" : ''}`
			}}/>
			<BasicLink data={{
				label: 'My Reviews', icon: FaCommentAlt, size: 22 , color: "#94a3b8", To:"/profile/MyReviews",
				styling: `fw-semibold color-g py-2 px-2 rounded-2 ${pathName.endsWith('/MyReviews') ? "active" : ''}`
			}}/>
			<BasicLink data={{
				label: 'Saved News', icon: PiNewspaperFill, size: 22 , color: "#94a3b8", To:"/profile/SavedNews",
				styling: `fw-semibold color-g py-2 px-2 rounded-2 ${pathName.endsWith('/SavedNews') ? "active" : ''}`
			}}/>
			{
				userInfo.isAdmin === "admin"
				?
					<BasicLink data={{
						label: 'Dashbord', icon: MdDashboardCustomize, size: 22 , color: "#94a3b8", To:"/dashboard",
						styling: `fw-semibold color-g py-2 px-2 rounded-2 ${pathName.endsWith('/dashboard') ? "active" : ''}`
					}}/>
				:
					''
			}
		</div>
	)
}

export default SidebarLinks
