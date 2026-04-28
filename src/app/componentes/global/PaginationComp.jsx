"use client"
import React from 'react'

const PaginationComp = ({ data }) => {
	const {elePerPage, total, page, filterVals, setFilterPage} = data
	const totalPages = Math.ceil(total / elePerPage) || null;
	if (totalPages === null) return;
	if (totalPages === 1) return;
	return (
		<div className='pagination-ele d-flex align-items-center gap-2 mt-5'>
			<button className={`pagination-btn ${page === 1 ? "active" : ""}`} onClick={() => setFilterPage({...filterVals, page: 1}) }>1</button>
			{
				page > 4 && (
					<span className='color-g'>...</span>
				)
			}
			<div className='h-f-c d-flex align-items-center gap-2'>
				{
					(page - 2) > 1 && (
						<button className='pagination-btn' onClick={() => setFilterPage({...filterVals, page: page - 2}) }>{page - 2}</button>
					)
				}
				{
					(page - 1) > 1 && (
						<button className='pagination-btn' onClick={() => setFilterPage({...filterVals, page: page - 1}) }>{page - 1}</button>
					)
				}
				{
					page > 1 && page < totalPages && (
						<button className='pagination-btn active'>{page}</button>
					)
				}
				{
					(page + 1) < totalPages && (
						<button className='pagination-btn' onClick={() => setFilterPage({...filterVals, page: page + 1}) }>{page +1}</button>
					)
				}
				{
					(page + 2) < totalPages && (
						<button className='pagination-btn' onClick={() => setFilterPage({...filterVals, page: page + 2}) }>{page + 2}</button>
					)
				}
			</div>
			{
				page < totalPages - 3 && (
					<span className='color-g'>...</span>
				)
			}
			<button className={`pagination-btn ${page === totalPages ? "active" : ""}`} onClick={() => setFilterPage({...filterVals, page: totalPages}) }>
				{totalPages}
			</button>
		</div>
	)
}

export default PaginationComp
