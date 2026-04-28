import React, { useState } from 'react'
import { CiSearch } from 'react-icons/ci';
import { MdKeyboardArrowDown } from 'react-icons/md'

const FilterGenresSection = ({ data }) => {
	const {searchQ, setSearchQ, searchText, setSearchText} = data;
	const [open, setOpen] = useState({
		openK: false,
		openP: false
	});
	const kindList = ['Genres Kind', 'person role',	'content genre','content award','person award'];

	return (
		<div className='filter-contetn p-3 p-md-4 d-flex flex-wrap flex-md-nowrap align-items-center gap-3 b-g-d2 rounded-3 mb-4'>
			<h5 className='fw-bold text-uppercase color-g'>Filters:</h5>
			<div className='filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 rounded-2 gap-2 c-p color-l m-border' tabIndex={0}
				onClick={() => setOpen({...open, openK: !open.openK})}
				onBlur={(e) => {
					if (!e.currentTarget.contains(e.relatedTarget)){
						setTimeout(() =>  setOpen({...open, openK: false}), 100 )
					}
				}}
			>
				<span className='fw-medium'>{searchQ.gKind !== "" ? searchQ.gKind.replace("_", " ") : "Genres Kind"}</span> <MdKeyboardArrowDown size={18}/>
				<ul className={`dropdown-list position-absolute filter-drop ${open.openK ? 'show' : ''}`}>
					{
						kindList.map((k) => {
							return <li key={k}>
								<button className='d-flex align-items-center w-100 h-100 justify-content-center' 
									onClick={() => {
										k != "Genres Kind" ? setSearchQ({...searchQ, gKind: k.replace(" ", "_"), page: 1}): setSearchQ({...searchQ, gKind: "", page: 1})
									}}
								>{k}</button> 
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
				<input type="text" placeholder='Genre Name' className='color-g fw-medium m-border rounded-2' maxLength={30} 
					value={searchText} onInput={(e) => setSearchText(e.currentTarget.value)}
				/>
				<span className='color-g b-g-d3 rounded-2'><CiSearch size={18}/></span>
			</div>
		</div>
	)
}

export default FilterGenresSection
