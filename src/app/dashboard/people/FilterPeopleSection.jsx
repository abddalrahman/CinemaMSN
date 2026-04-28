"use client"
import React, { useState } from 'react'
import { CiSearch } from 'react-icons/ci';
import { MdKeyboardArrowDown } from 'react-icons/md';

const FilterPeopleSection = ({ data }) => {
	const {searchQ, setSearchQ, searchText, setSearchText} = data;
	const [open, setOpen] = useState(false);

	return (
		<div className='filter-contetn flex-wrap flex-md-nowrap p-3 p-sm-4 d-flex align-items-center gap-3 b-g-d2 rounded-3 mb-4'>
			<h5 className='fw-bold text-uppercase color-g'>Filters:</h5>
			<div className='item-per-page filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 rounded-2 gap-2 c-p color-l m-border' 
				onClick={() => setOpen(!open)}
			>
				<span className='fw-medium'>Item Per Page: {searchQ.limit}</span> <MdKeyboardArrowDown size={18}/>
				<ul className={`dropdown-list position-absolute filter-drop ${open ? 'show' : ''}`}>
					<li>
						<button className='d-flex align-items-center w-100 h-100 justify-content-center' onClick={() => {
							setSearchQ({...searchQ, page: 1, limit: 5}); setOpen(false)
						}}>5</button> 
					</li>
					<li>
						<button className='d-flex align-items-center w-100 h-100 justify-content-center' onClick={() => {
							setSearchQ({...searchQ, page: 1, limit: 10}); setOpen(false)
						}}>10</button>
					</li>
					<li>
						<button className='d-flex align-items-center w-100 h-100 justify-content-center' onClick={() => {
							setSearchQ({...searchQ, page: 1, limit: 25}); setOpen(false)
						}}>25</button> 
					</li>
				</ul>
			</div>
			<div className='input-container'>
				<input type="text" placeholder='Search By Person Name' className='color-g fw-medium m-border rounded-2' maxLength={30}  value={searchText}
					onInput={(e) => setSearchText(e.currentTarget.value.trim())}
				/>
				<span className='color-g b-g-d3 rounded-2'><CiSearch size={18}/></span>
			</div>
		</div>
	)
}

export default FilterPeopleSection