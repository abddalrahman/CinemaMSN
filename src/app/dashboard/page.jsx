import React from 'react'
import "./dashboard.css"
import HeadAndText from '../componentes/global/smallComp/HeadAndText'
import { fetchAPIFunc } from '@/utils/clientRandomFunc'
import { cookies } from 'next/headers';
import Statistic from '../componentes/dashboard/Statistic';
import SecondTitile from '../componentes/global/smallComp/SecondTitile';
import RecentContent from '../componentes/dashboard/RecentContent';
import RecentPeople from '../componentes/dashboard/RecentPeople';
import ReportedComment from '../componentes/dashboard/ReportedComment';
import ManagementSections from '../componentes/dashboard/ManagementSections';
import { redirect } from 'next/navigation';
import { DomainPath } from '@/utils/DomainPath';

const Dashboard = async () => {
	const getCookies = await cookies();
	const token = getCookies.get("jwtToken")?.value;
	if (!token) redirect('/');
	
	let statistics, sResult, contents, cResult, people, pResult = null;
	try {
		statistics = await fetchAPIFunc(`${DomainPath}/api/admin/showData/statistics`, "GET", {}, token, false, "no-store");
		sResult = await statistics.json();
	} catch (error) {
		console.log(error);
	}
	try {
		contents = await fetchAPIFunc(`${DomainPath}/api/admin/content/getContent?page=1&limit=5`, "GET", {}, token, false, "no-store");
		cResult = await contents.json();
	} catch (error) {
		console.log(error);
	}
	try {
		people = await fetchAPIFunc(`${DomainPath}/api/globals/people/getPeople?page=1&limit=5`, "GET", {}, token, false, "no-store");
		pResult = await people.json();
	} catch (error) {
		console.log(error);
	}



	return (
		<div className='main-container pt-120'>
			<HeadAndText title= "Dashboard" text= {`On this page, you will be able to view various general statistics and access site management through links
				to user information, content, news, people, and comments. You will also be able to access messages and comment notifications. Management 
				includes adding, editing, deleting, and general viewing.`}
			/>
			<section>
				<SecondTitile text={"Statistics"}/>
				<Statistic data={statistics?.status == 200 ? sResult : 0}/>
			</section>

			<section>
				<SecondTitile text={"Recent Active"}/>
				<div className='d-flex row'>
					<RecentContent data={contents?.status == 200 ? cResult : 0}/>
					<RecentPeople data={people?.status == 200 ? pResult : 0}/>
				</div>
				<ReportedComment />
			</section>

			<section>
				<SecondTitile text={"Management"}/>
				<ManagementSections/>
			</section>
		</div>
	)
}

export default Dashboard
