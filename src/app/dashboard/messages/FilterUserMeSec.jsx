import React, { useState } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md';

const FilterUserMeSec = ({ data }) => {
	const {searchQ, setSearchQ} = data;
	const [open, setOpen] = useState({
		openC: false,
		openP: false
	});

	return (
		<div className='filter-user-messages p-3 p-sm-4 d-flex align-items-center gap-3 b-g-d2 rounded-3 mb-4 flex-wrap'>
			<h5 className='fw-bold text-uppercase color-g'>Filters:</h5>
			<div className='filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 flex-grow-1 
				rounded-2 gap-2 c-p color-l m-border' tabIndex={0}
				onClick={() => setOpen({...open, openC: !open.openC})}
				onBlur={(e) => {
					if (!e.currentTarget.contains(e.relatedTarget)){
						setTimeout(() =>  setOpen({...open, openC: false}), 100 )
					}
				}}
			>
				<span className='fw-medium'>{searchQ.justNotReaded ? "Not Checked" : "Checked"}</span> <MdKeyboardArrowDown size={18}/>
				<ul className={`dropdown-list position-absolute filter-drop ${open.openC ? 'show' : ''}`}>
					<li>
						<button className='d-flex align-items-center w-100 h-100 justify-content-center' 
							onClick={() => {
								setSearchQ({...searchQ, justNotReaded: true, page: 1})
							}}
						>Not Checked</button> 
					</li>
					<li>
						<button className='d-flex align-items-center w-100 h-100 justify-content-center' 
							onClick={() => {
								setSearchQ({...searchQ, justNotReaded: false, page: 1})
							}}
						>Checked</button> 
					</li>
				</ul>
			</div>
			<div className='item-per-page filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 
				rounded-2 gap-2 c-p color-l m-border flex-grow-1' 
				onClick={() => setOpen({...open, openP: !open.openP})}
			>
				<span className='fw-medium'>Item Per Page: {searchQ.limit}</span> <MdKeyboardArrowDown size={18}/>
				<ul className={`dropdown-list position-absolute filter-drop ${open.openP ? 'show' : ''}`}>
					<li>
						<button className='d-flex align-items-center w-100 h-100 justify-content-center' onClick={() => {
							setSearchQ({...searchQ, limit: 5, page: 1}); setOpen({...open, openP: false})
						}}>5</button> 
					</li>
					<li>
						<button className='d-flex align-items-center w-100 h-100 justify-content-center' onClick={() => {
							setSearchQ({...searchQ, limit: 10, page: 1}); setOpen({...open, openP: false})
						}}>10</button> 
					</li>
					<li>
						<button className='d-flex align-items-center w-100 h-100 justify-content-center' onClick={() => {
							setSearchQ({...searchQ, limit: 25, page: 1}); setOpen({...open, openP: false})
						}}>25</button> 
					</li>
				</ul>
			</div>
		</div>
	)
}

export default FilterUserMeSec