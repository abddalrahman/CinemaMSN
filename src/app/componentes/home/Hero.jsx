import { fetchAPIFunc } from '@/utils/clientRandomFunc'
import React from 'react'
import "./home.css"
import HeroSwipre from './HeroSwipre';
import { DomainPath } from '@/utils/DomainPath';

const Hero = async () => {
	let heroData, result = null;
	try {
		heroData = await fetchAPIFunc(`${DomainPath}/api/globals/displayAPIs/heroReq`, "GET", {}, null, false, "no-store");
		result = await heroData.json();
	} catch (error) {
		console.log(error);
	}
	
	if (result && heroData && heroData?.status === 200) {
		return (
			<div className='vh-100'>
				<HeroSwipre data={result}/>
			</div>
		)
	} else {
		return (
			<div className='vh-100 position-relative'>
				<img src="/images/alt-hero.jpg" alt="hero section" className='w-100 h-100 object-fit-cover' />
			</div>
		)
	}
}

export default Hero
