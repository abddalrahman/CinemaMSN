"use client"
import { fetchAPIFunc } from '@/utils/clientRandomFunc'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import CoverL from '../componentes/global/smallComp/CoverL'
import ContentCardsList from '../componentes/global/ContentCardsList'
import SectionTitle from '../componentes/global/smallComp/SectionTitle'
import FilterContentDropDowns from '../componentes/dashboard/FilterContentDropDowns'
import { MdKeyboardArrowDown } from 'react-icons/md'
import PaginationComp from '../componentes/global/PaginationComp'
import { DomainPath } from '@/utils/DomainPath'
import { Spinner } from 'react-bootstrap'


const ContentDisplayContent = () => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState({
		gOpen: false,
		pOpen: false
	});
	const [contentsData, setContentsData] = useState([]);
	const [contentGenres, setContentGenres] = useState([]);
	const [filteringParams, setFilteringParams] = useState({
		page: 1,
		limit: 5,
		year: null,
		cType: null,
	});
	const [dataLength, setDataLength] = useState(0);
	const genreParam = searchParams.get("genre");
	
	const handleGenreChange = (genre) => {
		if (genre === null) {
			router.replace(pathname);
		} else {
			router.replace(pathname + `?genre=${genre}`);
		}
  };

	const getFilteredContent = useCallback (async () => {
		try {
			setLoading(true);
			const contents = await fetchAPIFunc(`${DomainPath}/api/globals/content/getFilteredContentToDisplay?page=${filteringParams.page}
				&limit=${filteringParams.limit}&year=${filteringParams.year}&type=${filteringParams.cType}&genre=${genreParam}`, "GET", {}
			);
			const result = await contents.json();
			if (contents.status === 200) {
				setLoading(false);
				setContentsData(result.data);
				setDataLength(result.dataLength)
			} else {
				setLoading(false);
				setContentsData(null);
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
			setContentsData(null);
		}
	}, [filteringParams.page, filteringParams.limit, filteringParams.year, filteringParams.cType, genreParam])

	const getContentGenres = async () => {
		try {
			const genres = await fetchAPIFunc(`${DomainPath}/api/globals/getGenres?type=content_genre`, "GET", {});
			const result = await genres.json();
			if (genres.status === 200) {
				setContentGenres(["All Genres", ...result]);
			} else{
				setContentGenres(null);
			}
		} catch (error) {
			console.log(error);
			setContentGenres(null);
		}
	}

	useEffect(() => {
		const run = async () => {
			await getContentGenres();
		}
		run();
	}, [])

	useEffect(() => {
		const run = () => {
			getFilteredContent();
		}
		run();
	}, [getFilteredContent])
	
	if (contentGenres === null) {
		return (
			<div className='color-l p-3 b-g-d3 rounded-1'>
				Failed To Get Data Try Again
			</div>
		)
	}
	return (
		<>
			{loading ? <CoverL/> : ''}
			<div className='content-page pt-120'>
				<div className="main-container">
					<SectionTitle title={"Content"} subtitle={"Browse the content and use filters to get results closer to what you're looking for."} 
						inHead={dataLength}
						/>
					{/* filtering section */}
					<div className="filter-section my-5 p-3 p-md-4 b-g-d2 rounded-2 d-flex align-items-center gap-2 gap-md-4 flex-wrap">
						<h3 className='color-g fw-bold'>Filters:</h3>
						<FilterContentDropDowns p={{type: "years", searchVal: filteringParams, setValFunc: setFilteringParams}}/>
						<FilterContentDropDowns p={{type: "type", searchVal: filteringParams, setValFunc: setFilteringParams}}/>
						<div className='filter-genres filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 
							rounded-2 gap-2 c-p color-l m-border' tabIndex={3}
							onClick={() => setOpen({...open, gOpen: !open.gOpen})}
							onBlur={(e) => {
								if (!e.currentTarget.contains(e.relatedTarget)){
									setTimeout(() =>  setOpen({...open, gOpen: false}), 100 )
								}
							}}
						>
							<span className='fw-medium'>
								{genreParam ? contentGenres.find(g => g.genre_id == genreParam)?.name || "Genres" : "Genres"}
							</span> <MdKeyboardArrowDown size={18}/>
							<ul className={`dropdown-list position-absolute filter-drop ${open.gOpen ? 'show' : ''}`}>
								{
									contentGenres.map((g) => {
										return <li key={g.genre_id || g}>
												<button className='d-flex align-items-center w-100 h-100 justify-content-center' 
													onClick={() => handleGenreChange(g.genre_id || null)}
												>{g.name || g}</button> 
											</li>
									})
								}
							</ul>
						</div>
						<div className='d-flex align-items-center gap-3 ms-lg-auto'>
							<span className='color-l'>Item Per Page: </span>
							<div className='item-per-page filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 
								rounded-2 gap-2 c-p color-l m-border' onClick={() => setOpen({...open, pOpen: !open.pOpen})}
							>
								<span className='fw-medium'>{filteringParams.limit}</span> <MdKeyboardArrowDown size={18}/>
								<ul className={`dropdown-list position-absolute filter-drop small-list ${open.pOpen ? 'show' : ''}`}>
									<li>
										<button className='d-flex align-items-center w-100 h-100 justify-content-center' onClick={() => {
											setFilteringParams({...filteringParams, page: 1, limit: 5}); setOpen({...open, pOpen: false})
										}}>5</button> 
									</li>
									<li>
										<button className='d-flex align-items-center w-100 h-100 justify-content-center' onClick={() => {
											setFilteringParams({...filteringParams, page: 1, limit: 10}); setOpen({...open, pOpen: false})
										}}>10</button> 
									</li>
									<li>
										<button className='d-flex align-items-center w-100 h-100 justify-content-center' onClick={() => {
											setFilteringParams({...filteringParams, page: 1, limit: 25}); setOpen({...open, pOpen: false})
										}}>25</button> 
									</li>
								</ul>
							</div>
						</div>
					</div>
					{/* genre information */}
					{
						genreParam &&  contentGenres.map(g => Number(g.genre_id) || null).includes(Number(genreParam))
						?
							<div className='genre-desc mb-5 pb-3'>
								<h2 className='color-y fw-bold'>
									{contentGenres.filter((g) => Number(g.genre_id) == Number(genreParam))[0].name}
								</h2>
								<span className='color-dg fw-medium fs-5 mb-2 d-block'>Genre</span>
								<p className='color-l'>
									{contentGenres.filter((g) => Number(g.genre_id) == Number(genreParam))[0].description}
								</p>
							</div>
						: ''
					}
					{/* contents display */}
					{
						contentsData === null
						?
							<div className='color-l p-3 b-g-d3 rounded-1'>
								Failed To Get Data Try Again
							</div>
						:
							contentsData.length > 0
							?
								<>
									<ContentCardsList data= {contentsData}/>
									<PaginationComp data={{elePerPage: filteringParams.limit, total: Number(dataLength), page: filteringParams.page, 
										filterVals: filteringParams, setFilterPage: setFilteringParams}}
									/>
								</>
							:	
								<div className='color-l p-3 b-g-d3 rounded-1'>
									No Data Available
								</div>
					}
				</div>
			</div>
		</>
	)
}

const ContentDisplay = () => {
	return (
    <Suspense fallback={<div className='p-5 pt-120 d-flex align-items-center justify-content-center'>
			<Spinner animation="border" variant="primary" />
		</div>}>
      <ContentDisplayContent />
    </Suspense>
  )
}
	
export default ContentDisplay