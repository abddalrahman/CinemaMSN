import { calcAge } from '@/utils/clientRandomFunc'
import React from 'react'
import PersonImageWithFavBtn from './PersonImageWithFavBtn';
import { FaRankingStar } from "react-icons/fa6";

const PersonTopData = async ({id, result}) => {

	return (
		<div className='top-person-data pt-120 pb-5'>
			<div className='main-container'>
				<div className='row'>
					<PersonImageWithFavBtn id={id} name={result.p_name} imgUrl={result.image_url} style="col-4 col-sm-3 col-md-4 col-lg-3"/>
					<div className='col-8 col-sm-9 col-md-8 col-lg-9'>
						<div className='d-flex flex-column justify-content-between h-100 gap-3'>
							<div>
								<div className='flex-column flex-md-row d-flex flex-wrap gap-3 align-items-md-center justify-content-between'>
									<h1 className='color-l fs-xxl fw-bold mb-0'>{result.p_name}</h1>
									<div className='d-flex pupolarity-div align-items-center color-l gap-3'>
										<span className=''>CinemaMSN Pupularity</span>
										<FaRankingStar className='color-r'/>
										<span className='fs-xxl fw-bold'>{result.rank_position}</span>
									</div>
								</div>
								<div className='color-g mt-2 fs-mdl d-flex align-items-center gap-2'>
									<span className='fw-semibold'>Born:</span> <span></span>{calcAge(result.birth_date)} 
								</div>
							</div>
							<div className='bio-container w-f-c h-f-c d-none d-md-flex align-items-end'>
								<p className='color-l fw-semibold fs-md opacity-75 overflow-auto mb-0 h-f-c'>{result.bio}</p>
							</div>
						</div>
					</div>
					<div className='col-12 bio-container w-f-c h-f-c d-flex align-items-end d-md-none mt-4'>
						<p className='color-l fw-semibold fs-md opacity-75 overflow-auto mb-0 h-f-c'>{result.bio}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PersonTopData
