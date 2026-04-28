import BasicLink from '@/app/componentes/global/smallComp/BasicLink'
import HeadAndText from '@/app/componentes/global/smallComp/HeadAndText'
import React from 'react'
import { MdAdd } from 'react-icons/md'
import ContentBody from './ContentBody'
import "../dashboard.css"
import { fetchAPIFunc } from '@/utils/clientRandomFunc'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DomainPath } from '@/utils/DomainPath'

const Content = async () => {
	const getCookies = await cookies();
	const token = getCookies.get("jwtToken")?.value;
	if (!token) redirect('/');
	let respons, result = null;
	try {
		respons = await fetchAPIFunc(`${DomainPath}/api/globals/getGenres?type=content_genre`, "GET", {}, token, false, "no-store");
		result = await respons.json();
	} catch (error) {
		console.log(error)
	}

	return (
		<div className='main-container pb-5 pt-120'>
			<div className='manage-content-page'>
				<div className='content-page-top d-flex gap-3 flex-wrap align-items-end justify-content-between mb-4'>
					<HeadAndText title= "Dashboard" text="Add, Delete, Edit, and Read Content"/>
					<BasicLink data={{label: "Add Content", icon: MdAdd, size: 20, To:"/dashboard/content/add", styling:"main-red-btn"}}/>
				</div>
				<ContentBody genres={respons?.status === 200 ? result : 0}/>
			</div>
		</div>	
	)
}

export default Content
