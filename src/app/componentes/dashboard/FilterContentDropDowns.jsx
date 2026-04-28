"use client"
import React, { useEffect, useState } from 'react'
import { MdKeyboardArrowDown } from "react-icons/md";

const FilterContentDropDowns = ({ p }) => {
	const {type, searchVal, setValFunc, existData= null, changeNoRefresh} = p
	const [data, setData] = useState([]);
	const [openDrop, setOpenDrop] = useState({
		oYears: false, 
		oStatus: false, 
		oType: false, 
		oGenre: false, 
	});

	useEffect(() => {
		const run = () => {
			if (type === "years") {
				const years = []
				for (let i = 1890; i <= new Date().getFullYear(); i++ ) {
					years.unshift(i);
				}
				years.unshift("All Years");
				setData(years)
			} else if (type === "status") {
				setData(['All Status', 'upcoming','available','hidden']);
			} else if (type === "type") {
				setData(['All Types', 'Movie','Series']);
			} else if (type === "genres") {
				setData(["All Genres", ...existData]);
			}
		}
		run();
	},[type]);

	if (type === "years") {
		return (
			<div className='filter-year filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 
				rounded-2 gap-2 c-p color-l m-border flex-grow-1' tabIndex={0}
				onClick={() => setOpenDrop({
					...openDrop,
					oYears: !openDrop.oYears
				})}
				onBlur={(e) => {
					if (!e.currentTarget.contains(e.relatedTarget)){
						setTimeout(() =>  setOpenDrop({ ...openDrop, oYears: false }), 100 )
					}
				}}
			>
				<span className='fw-medium'>{searchVal.year !== null ? searchVal.year : "Relazed Year"}</span> <MdKeyboardArrowDown size={18}/>
				<ul className={`dropdown-list position-absolute filter-drop ${openDrop.oYears ? 'show' : ''}`}>
					{
						data.map((y) => {
							return <li key={y}>
									<button className='d-flex align-items-center w-100 h-100 justify-content-center' 
										onClick={() => {
											y != "All Years" ? setValFunc({...searchVal, page: 1, year: y}): setValFunc({...searchVal, page: 1, year: null})
										}}
									>{y}</button> 
								</li>
						})
					}
				</ul>
			</div>
		)
	} else if (type === "status") {
		return (
			<div className='filter-statys filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 
				rounded-2 gap-2 c-p color-l m-border flex-grow-1' tabIndex={1}
				onClick={() => setOpenDrop({
					...openDrop,
					oStatus: !openDrop.oStatus
				})}
				onBlur={(e) => {
					if (!e.currentTarget.contains(e.relatedTarget)){
						setTimeout(() =>  setOpenDrop({ ...openDrop, oStatus: false }), 100 )
					}
				}}
			>
				<span className='fw-medium'>{searchVal.status !== null ? searchVal.status : "Status"}</span> <MdKeyboardArrowDown size={18}/>
				<ul className={`dropdown-list position-absolute filter-drop ${openDrop.oStatus ? 'show' : ''}`}>
					{
						data.map((s) => {
							return <li key={s}>
									<button className='d-flex align-items-center w-100 h-100 justify-content-center' 
										onClick={() => {
											s != "All Status" ? setValFunc({...searchVal, page: 1, status: s}): setValFunc({...searchVal, page: 1, status: null})
										}}
									>{s}</button> 
								</li>
						})
					}
				</ul>
			</div>
		)
	} else if (type === "type") {
		return (
			<div className='filter-type filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 
				rounded-2 gap-2 c-p color-l m-border flex-grow-1' tabIndex={2}
				onClick={() => setOpenDrop({
					...openDrop,
					oType: !openDrop.oType
				})}
				onBlur={(e) => {
					if (!e.currentTarget.contains(e.relatedTarget)){
						setTimeout(() =>  setOpenDrop({ ...openDrop, oType: false }), 100 )
					}
				}}
			>
				<span className='fw-medium'>{searchVal.cType !== null ? searchVal.cType : "Type"}</span> <MdKeyboardArrowDown size={18}/>
				<ul className={`dropdown-list position-absolute filter-drop ${openDrop.oType ? 'show' : ''}`}>
					{
						data.map((t) => {
							return <li key={t}>
									<button className='d-flex align-items-center w-100 h-100 justify-content-center' 
										onClick={() => {
											t != "All Types" ? setValFunc({...searchVal, page: 1, cType: t}): setValFunc({...searchVal, page: 1, cType: null})
										}}
									>{t}</button> 
								</li>
						})
					}
				</ul>
			</div>
		)
	} else if (type === "genres") {
		return (
			<div className='filter-genres filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 
				rounded-2 gap-2 c-p color-l m-border flex-grow-1' tabIndex={3}
				onClick={() => setOpenDrop({
					...openDrop,
					oGenre: !openDrop.oGenre
				})}
				onBlur={(e) => {
					if (!e.currentTarget.contains(e.relatedTarget)){
						setTimeout(() =>  setOpenDrop({ ...openDrop, oGenre: false }), 100 )
					}
				}}
			>
				<span className='fw-medium'>{searchVal.genresID !== null ? data.find(g => g.genre_id === searchVal.genresID)?.name || "Genres" : "Genres"}</span> <MdKeyboardArrowDown size={18}/>
				<ul className={`dropdown-list position-absolute filter-drop ${openDrop.oGenre ? 'show' : ''}`}>
					{
						data.map((g) => {
							return <li key={g.genre_id || g}>
									<button className='d-flex align-items-center w-100 h-100 justify-content-center' 
										onClick={() => {
											g != "All Genres" ? setValFunc({...searchVal, page: 1, genresID: g.genre_id}): setValFunc({...searchVal, page: 1, genresID: null})
										}}
									>{g.name || g}</button> 
								</li>
						})
					}
				</ul>
			</div>
		)
	}

}

export default FilterContentDropDowns