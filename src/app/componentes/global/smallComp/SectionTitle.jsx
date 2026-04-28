import React from 'react'

const SectionTitle = ({ title, subtitle, inHead= null, sm= false }) => {
	return (
		<div className='mb-4 main-section-title'>
			{
				sm
				?
					<h5 className='color-l fw-bold ps-3 mb-1 position-relative d-flex align-items-center gap-2'>
						<span>{title}</span> {inHead ? <span className='fs-6 color-g'>{inHead}</span> : ''}
					</h5>
				:
					<h3 className='color-l fw-bold ps-3 mb-1 position-relative d-flex align-items-center gap-2'>
						<span>{title}</span> {inHead ? <span className='fs-6 color-g'>{inHead}</span> : ''}
					</h3>
			}
			{
				subtitle && subtitle.trim() !== "" &&
				<span className='color-g fw-semibold mb-0'>{subtitle}</span>
			}
		</div>
	)
}

export default SectionTitle
