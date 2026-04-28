import React, { useState } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'

const FilterCommentSection = ({ data }) => {
	const {searchQ, setSearchQ} = data;
	const [open, setOpen] = useState({
		openR: false,
		openS: false,
		openP: false
	});
	const reportList = ['All', 'Reoprted Comments',	'Not Reported Comments'];
	const spoilerList = ['All', 'Comments With Spoiler',	'Comments Without Spoiler'];

	return (
		<div className='filter-contetn p-3 p-md-4 flex-wrap d-flex align-items-center gap-2 gap-md-3 b-g-d2 rounded-3 mb-4'>
			<h5 className='fw-bold text-uppercase color-g'>Filters:</h5>
			<div className='filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 rounded-2 gap-2 c-p color-l m-border' tabIndex={0}
				onClick={() => setOpen({...open, openR: !open.openR})}
				onBlur={(e) => {
					if (!e.currentTarget.contains(e.relatedTarget)){
						setTimeout(() =>  setOpen({...open, openR: false}), 100 )
					}
				}}
			>
				<span className='fw-medium'>{reportList[searchQ.report]}</span> <MdKeyboardArrowDown size={18}/>
				<ul className={`dropdown-list position-absolute filter-drop ${open.openR ? 'show' : ''}`}>
					{
						reportList.map((comm) => {
							return <li key={comm}>
								<button className='d-flex align-items-center w-100 h-100 justify-content-center' 
									onClick={() => {
										comm != "All" ? setSearchQ({...searchQ, report: comm == "Reoprted Comments" ? 1 : 2, page: 1}): 
										setSearchQ({...searchQ, report: 0, page: 1})
									}}
								>{comm}</button> 
							</li>
						})
					}
				</ul>
			</div>
			<div className='filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 rounded-2 gap-2 c-p color-l m-border' tabIndex={0}
				onClick={() => setOpen({...open, openS: !open.openS})}
				onBlur={(e) => {
					if (!e.currentTarget.contains(e.relatedTarget)){
						setTimeout(() =>  setOpen({...open, openS: false}), 100 )
					}
				}}
			>
				<span className='fw-medium'>{spoilerList[searchQ.spoiler]}</span> <MdKeyboardArrowDown size={18}/>
				<ul className={`dropdown-list position-absolute filter-drop ${open.openS ? 'show' : ''}`}>
					{
						spoilerList.map((comm) => {
							return <li key={comm}>
								<button className='d-flex align-items-center w-100 h-100 justify-content-center' 
									onClick={() => {
										comm != "All" ? setSearchQ({...searchQ, spoiler: comm == "Comments With Spoiler" ? 1 : 2, page: 1}): 
											setSearchQ({...searchQ, spoiler: 0, page: 1})
									}}
								>{comm}</button> 
							</li>
						})
					}
				</ul>
			</div>
			<div className='item-per-page filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 rounded-2 gap-2 c-p color-l m-border' 
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

export default FilterCommentSection
