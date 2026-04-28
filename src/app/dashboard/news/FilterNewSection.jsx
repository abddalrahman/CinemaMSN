import React, { useState } from 'react'
import { CiSearch } from 'react-icons/ci';
import { MdKeyboardArrowDown } from 'react-icons/md'

const FilterNewSection = ({ data }) => {
	const {searchQ, setSearchQ, searchText, setSearchText} = data;
		const [open, setOpen] = useState({
			openA: false,
			openP: false
		});
		const aboutList = ['All', 'movies',	'series','people'];
	
		return (
			<div className='filter-contetn p-3 p-md-4 flex-wrap flex-md-nowrap d-flex align-items-center gap-2 gap-md-3 b-g-d2 rounded-3 mb-4'>
					<h5 className='fw-bold text-uppercase color-g'>Filters:</h5>
					<div className='filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 rounded-2 gap-2 c-p color-l m-border' tabIndex={0}
						onClick={() => setOpen({...open, openA: !open.openA})}
						onBlur={(e) => {
							if (!e.currentTarget.contains(e.relatedTarget)){
								setTimeout(() =>  setOpen({...open ,opneA: false}), 100 )
							}
						}}
					>
						<span className='fw-medium'>{searchQ.about !== null ? searchQ.about : "All"}</span> <MdKeyboardArrowDown size={18}/>
						<ul className={`dropdown-list position-absolute filter-drop ${open.openA ? 'show' : ''}`}>
							{
								aboutList.map((k) => {
									return <li key={k}>
										<button className='d-flex align-items-center w-100 h-100 justify-content-center' 
											onClick={() => {
												k != "All" ? setSearchQ({...searchQ, about: k, page: 1}): setSearchQ({...searchQ, about: null, page: 1})
											}}
										>About {k}</button> 
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
					<div className='input-container'>
						<input type="text" placeholder='Search By News title or Body' className='color-g fw-medium m-border rounded-2' maxLength={30} 
							value={searchText} onInput={(e) => setSearchText(e.currentTarget.value.trim())}
						/>
						<span className='color-g b-g-d3 rounded-2'><CiSearch size={18}/></span>
					</div>
				</div>
		)
}

export default FilterNewSection
