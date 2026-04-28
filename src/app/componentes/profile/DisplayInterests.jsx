import React from 'react'
import SectionTitle from '../global/smallComp/SectionTitle';
import Link from 'next/link';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { cookies } from 'next/headers';
import { DomainPath } from '@/utils/DomainPath';

const DisplayInterests = async ({ id }) => {
	const getCookies = await cookies();
	const token = getCookies.get("jwtToken")?.value || null;
	let gIDs = [];
	let interests = [];
	try {
		const respons = await fetchAPIFunc(`${DomainPath}/api/users/activity/userInterests?id=${id}`, "GET", {}, token, false, "no-store");
		const result = await respons.json();
		if (respons.status === 200) {
			gIDs = result.map((item) => Number(item.genre_id));
		} else {
			gIDs = null;
		}
	} catch (error) {
		console.log(error);
		gIDs = null;
	}
	if (gIDs === null) {
		return (
			<div className='mt-5'>
				<SectionTitle title={"Your Interests"} />
				<div className='p-4 b-g-d3 color-l rounded-1'>
					Failed To Get Data
				</div>
			</div>
		)
	} else if (gIDs.length === 0) {
		return (
			<div className='mt-5'>
				<SectionTitle title={"Your Interests"} inHead={"0"} />
				<div className='p-4 b-g-d3 color-l rounded-1'>
					You Have No Interests
				</div>
			</div>
		)
	}

	try {
		const respons = await fetchAPIFunc(`${DomainPath}/api/globals/getGenres?type=content_genre`, "GET", {}, null, false, "no-store");
		const result = await respons.json();
		if (respons.status === 200) {
			interests = result.filter((genre) => gIDs.includes(Number(genre.genre_id)));
		} else {
			interests = null;
		}
	} catch (error) {
		console.log(error)
		interests = null
	}
	
	if (interests === null) {
		return (
			<div className='mt-5'>
				<SectionTitle title={"Your Interests"} />
				<div className='p-4 b-g-d3 color-l rounded-1'>
					Failed To Get Data
				</div>
			</div>
		)
	} else if (interests.length === 0) {
		return (
			<div className='mt-5'>
				<SectionTitle title={"Your Interests"} inHead={"0"} />
				<div className='p-4 b-g-d3 color-l rounded-1'>
					You Have No Interests
				</div>
			</div>
		)
	}
	return (
		<div className='mt-5'>
			<SectionTitle title={"Your Interests"} inHead={interests.length} />
			<div className='d-flex align-items-center flex-wrap gap-2 gap-xl-3'>
				{
					interests.map((item) => (
						<Link key={item.genre_id} className='borderd-link py-1 py-xl-2 px-2 px-xl-3 fs-md rounded-5' target='blank' 
							href={`/content?genre=${item.genre_id}`}>
							{item.name}
						</Link>
					))
				}
			</div>
		</div>
	)
}

export default DisplayInterests
