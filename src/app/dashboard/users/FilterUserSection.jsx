import React, { useState } from 'react'
import { CiSearch } from 'react-icons/ci';
import { MdKeyboardArrowDown } from 'react-icons/md'

const FilterUserSection = ({ data }) => {
	const {searchQ, setSearchQ, searchText, setSearchText} = data;
	const [openFilters, setOpenFilters] = useState({
		opRole: false,
		opStatus: false,
		opPage: false
	});

	const roleList = ['User Role', 'admin', 'helper', 'user'];
	const statusList = ['User status', 'active','banned', 'nactive'];

	return (
		<div className='filter-contetn p-3 p-md-4 d-flex align-items-center gap-2 gap-md-3 flex-wrap b-g-d2 rounded-3 mb-4'>
				<h5 className='fw-bold text-uppercase color-g'>Filters:</h5>
				<div className='filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 rounded-2 gap-2 c-p color-l m-border' tabIndex={0}
					onClick={() => setOpenFilters({
						...openFilters,
						opRole: !openFilters.opRole
					})}
					onBlur={(e) => {
						if (!e.currentTarget.contains(e.relatedTarget)){
							setTimeout(() =>  setOpenFilters({ ...openFilters, opRole: false }), 100 )
						}
					}}
				>
					<span className='fw-medium'>{searchQ.role !== "" ? searchQ.role : "User Role"}</span> <MdKeyboardArrowDown size={18}/>
					<ul className={`dropdown-list position-absolute filter-drop ${openFilters.opRole ? 'show' : ''}`}>
						{
							roleList.map((r) => {
								return <li key={r}>
									<button className='d-flex align-items-center w-100 h-100 justify-content-center' 
										onClick={() => {
											r != "User Role" ? setSearchQ({...searchQ, role: r, page: 1}): setSearchQ({...searchQ, role: "", page: 1})
										}}
									>{r}</button> 
								</li>
							})
						}
					</ul>
				</div>
				<div className='filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 rounded-2 gap-2 c-p color-l m-border' tabIndex={0}
					onClick={() => setOpenFilters({
						...openFilters,
						opStatus: !openFilters.opStatus
					})}
					onBlur={(e) => {
						if (!e.currentTarget.contains(e.relatedTarget)){
							setTimeout(() =>  setOpenFilters({...openFilters, opStatus: false }), 100 )
						}
					}}
				>
					<span className='fw-medium'>{searchQ.uStatus !== "" ? searchQ.uStatus : "User status"}</span> <MdKeyboardArrowDown size={18}/>
					<ul className={`dropdown-list position-absolute filter-drop ${openFilters.opStatus ? 'show' : ''}`}>
						{
							statusList.map((s) => {
								return <li key={s}>
									<button className='d-flex align-items-center w-100 h-100 justify-content-center' 
										onClick={() => {
											s != "User status" ? setSearchQ({...searchQ, uStatus: s, page: 1}): setSearchQ({...searchQ, uStatus: "", page: 1})
										}}
									>{s}</button> 
								</li>
							})
						}
					</ul>
				</div>
				<div className='item-per-page filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 rounded-2 gap-2 c-p color-l m-border' 
					onClick={() => setOpenFilters({...openFilters, opPage: !openFilters.opPage})}
				>
					<span className='fw-medium'>Item Per Page: {searchQ.limit}</span> <MdKeyboardArrowDown size={18}/>
					<ul className={`dropdown-list position-absolute filter-drop ${openFilters.opPage ? 'show' : ''}`}>
						<li>
							<button className='d-flex align-items-center w-100 h-100 justify-content-center' onClick={() => {
								setSearchQ({...searchQ, page: 1, limit: 5}); setOpenFilters(false)
							}}>5</button> 
						</li>
						<li>
							<button className='d-flex align-items-center w-100 h-100 justify-content-center' onClick={() => {
								setSearchQ({...searchQ, page: 1, limit: 10}); setOpenFilters(false)
							}}>10</button> 
						</li>
						<li>
							<button className='d-flex align-items-center w-100 h-100 justify-content-center' onClick={() => {
								setSearchQ({...searchQ, page: 1, limit: 25}); setOpenFilters(false)
							}}>25</button> 
						</li>
					</ul>
				</div>
				<div className='input-container'>
					<input type="text" placeholder='Search By UserName or User Email' className='color-g fw-medium m-border rounded-2' maxLength={30} 
						value={searchText} onInput={(e) => setSearchText(e.currentTarget.value)}
					/>
					<span className='color-g b-g-d3 rounded-2'><CiSearch size={18}/></span>
				</div>
			</div>
	)
}

export default FilterUserSection
