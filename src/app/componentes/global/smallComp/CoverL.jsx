import React from 'react'
import { Spinner } from 'react-bootstrap'

const CoverL = ({ boxed= false }) => {
	return (
		<div className={`d-flex align-items-center justify-content-center cover ${boxed ? 'boxed' : ''}`}>
			<Spinner animation="border" variant="danger" />
		</div>
	)
}

export default CoverL
