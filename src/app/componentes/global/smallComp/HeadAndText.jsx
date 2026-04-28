import React from 'react'

const HeadAndText = ({title, text}) => {
	return (
		<div className='head-and-text'>
			<h1 className='color-l fw-bold'>{title}</h1>
			<p className='color-g fw-medium mb-0'>{text}</p>
		</div>
	)
}

export default HeadAndText
