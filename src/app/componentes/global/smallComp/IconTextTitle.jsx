import React from 'react'
import { FaAsterisk } from "react-icons/fa";

const IconTextTitle = ({data}) => {
	return (
		<div className='d-flex align-items-center gap-2 mb-4'>
			<data.iconTag size={22} className="color-r"/> <h5 className='fw-bold text-capitalize color-l mb-0'>{data.text}</h5>
			{
				data.req
				?
					<FaAsterisk size={12} className='color-r ms-2'/>
				:
					''
			}
		</div>
	)
}

export default IconTextTitle
