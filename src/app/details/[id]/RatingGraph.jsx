import { calcAvgRating, calcRatingNumber, calcRatingPercentage } from '@/utils/clientRandomFunc'
import React from 'react'
import { FaStar } from 'react-icons/fa6'

const RatingGraph = ({data}) => {
	if (!data || data.length === 0) return null
	return (
		<div className='rating-graph d-flex align-items-center gap-4'>
			<div className='d-flex align-items-center gap-2'>
				<FaStar size={50} className='color-yd'/>
				<div className='d-flex flex-column mb-2'>
					<span className='fs-xl color-l fw-semibold'>{calcAvgRating(data)}</span>
					<span className='fs-main color-dg fw-semibold'>{calcRatingNumber(data)}</span>
				</div>
			</div>
			<div className='rate-graph d-flex align-items-end gap-2'>
				<div className='d-flex flex-column align-items-center justify-content-end gap-2'>
					<span style={{height: `${calcRatingPercentage(data, 1)}%`}} className='graph-column b-g-r rounded-1 d-block'></span>
					<span>1</span>
				</div>
				<div className='d-flex flex-column align-items-center justify-content-end gap-2'>
					<span style={{height: `${calcRatingPercentage(data, 2)}%`}} className='graph-column b-g-r rounded-1 d-block'></span>
					<span>2</span>
				</div>
				<div className='d-flex flex-column align-items-center justify-content-end gap-2'>
					<span style={{height: `${calcRatingPercentage(data, 3)}%`}} className='graph-column b-g-r rounded-1 d-block'></span>
					<span>3</span>
				</div>
				<div className='d-flex flex-column align-items-center justify-content-end gap-2'>
					<span style={{height: `${calcRatingPercentage(data, 4)}%`}} className='graph-column b-g-r rounded-1 d-block'></span>
					<span>4</span>
				</div>
				<div className='d-flex flex-column align-items-center justify-content-end gap-2'>
					<span style={{height: `${calcRatingPercentage(data, 5)}%`}} className='graph-column b-g-r rounded-1 d-block'></span>
					<span>5</span>
				</div>
				<div className='d-flex flex-column align-items-center justify-content-end gap-2'>
					<span style={{height: `${calcRatingPercentage(data, 6)}%`}} className='graph-column b-g-r rounded-1 d-block'></span>
					<span>6</span>
				</div>
				<div className='d-flex flex-column align-items-center justify-content-end gap-2'>
					<span style={{height: `${calcRatingPercentage(data, 7)}%`}} className='graph-column b-g-r rounded-1 d-block'></span>
					<span>7</span>
				</div>
				<div className='d-flex flex-column align-items-center justify-content-end gap-2'>
					<span style={{height: `${calcRatingPercentage(data, 8)}%`}} className='graph-column b-g-r rounded-1 d-block'></span>
					<span>8</span>
				</div>
				<div className='d-flex flex-column align-items-center justify-content-end gap-2'>
					<span style={{height: `${calcRatingPercentage(data, 9)}%`}} className='graph-column b-g-r rounded-1 d-block'></span>
					<span>9</span>
				</div>
				<div className='d-flex flex-column align-items-center justify-content-end gap-2'>
					<span style={{height: `${calcRatingPercentage(data, 10)}%`}} className='graph-column b-g-r rounded-1 d-block'></span>
					<span>10</span>
				</div>
			</div>	
			
		</div>
	)
}

export default RatingGraph
