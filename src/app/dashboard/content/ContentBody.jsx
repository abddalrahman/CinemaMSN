"use client"
import FilterContentDropDowns from '@/app/componentes/dashboard/FilterContentDropDowns';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import React, { useEffect, useState } from 'react'
import { MdKeyboardArrowDown, MdModeEditOutline } from 'react-icons/md';
import { toast } from 'react-toastify';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import Link from 'next/link';
import ConfirmComp from '@/app/componentes/global/smallComp/ConfirmComp';
import PaginationComp from '@/app/componentes/global/PaginationComp';
import { useDebounce } from '@/utils/debounce';
import { DomainPath } from '@/utils/DomainPath';

const ContentBody = ({genres}) => {
	const [open, setOpen] = useState();
	const [searchText, setSearchText] = useState("");
	const [totalContent, setTotalContent] = useState(0);
	const [searchQ, setSearchQ] = useState({
		year: null,
		status: null,
		cType: null,
		genresID: null,
		limit: 10,
		page: 1,
		title: null
	});
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [deleteControle, setDeleteControle] = useState({
		contentID: null,
		showConfirm: false,
	});
	const debouncedSearchTerm = useDebounce(searchText, 800);

	const fetchData = async () => {
		try {
			setLoading(true);
			const content = await fetchAPIFunc(`${DomainPath}/api/admin/content/getContent?year=${searchQ.year}&status=${searchQ.status}
				&type=${searchQ.cType}&genre=${searchQ.genresID}&title=${searchQ.title}&page=${searchQ.page}&limit=${searchQ.limit}`, "GET", {});
			const result = await content.json();
			if (content.status === 200) {
				setData(result.data)
				setTotalContent(result.dataLength)
			} else toast.error("Failed To Get Content");
			setLoading(false);
			
		} catch (error) {
			console.log(error);
			return toast.error("something want wrong")
		}
	}

	useEffect(() => {
    setSearchQ(prev => ({ ...prev, title: debouncedSearchTerm, page: 1 }));
  }, [debouncedSearchTerm]);
	
	useEffect(() => {
		const run = async () => {
			if (genres === 0) {
				toast.warning("Failed to Get Genres Filter")
			}
			setDeleteControle({
				contentID: null,
				showConfirm: false
			})
			await fetchData();
		}
		run();
	}, [searchQ.year, searchQ.status, searchQ.cType, searchQ.genresID, searchQ.title, searchQ.limit, searchQ.page])

	const deleteContent = (cID) => {
		setDeleteControle({
			contentID: cID,
			showConfirm: true
		});
	}
	
	const handleConfirm = async () => {
		setLoading(true)
		setDeleteControle({
			...deleteControle,
			showConfirm: false
		})
		if (deleteControle.contentID) {
			try {
				const respons = await fetchAPIFunc(`${DomainPath}/api/admin/content`, "DELETE", {id: deleteControle.contentID});
				const result = await respons.json();
				if (respons.status === 200) {
					setLoading(false);
					toast.success(result.message);
					setDeleteControle({
						contentID: null,
						showConfirm: false
					});
					await fetchData();
				} else {
					setLoading(false);
					setDeleteControle({
						contentID: null,
						showConfirm: false
					});
					return toast.error(result.message);
				}
			} catch (error) {
				console.log(error);
				setLoading(false);
				setDeleteControle({
					contentID: null,
					showConfirm: false
				});
				return toast.error("something want wrong")
			}
		}
		
	}
	const handleCansle = () => {
		setLoading(false);
		setDeleteControle({
			contentID: null,
			showConfirm: false
		});
		return;
	}
	

	return (
		<div>
			{loading ? <CoverL/> : ''}
			{
				deleteControle.showConfirm
				?
					<ConfirmComp data={{title: "Delete Content", body: "Are You Shur You Want To Delete This Content", noBtn: "No", yesBtn: "Delete", bg: "d"}}
						callFuncs={{confirmFunc:handleConfirm, cansleFunc: handleCansle}}
					/>
				:
					''
			}
			<div className='filter-contetn p-3 p-lg-4 d-flex flex-wrap align-items-center gap-2 gap-lg-3 b-g-d2 rounded-3 mb-4'>
				<h5 className='fw-bold text-uppercase color-g'>Filters:</h5>
				<div className='d-flex align-items-center flex-wrap flex-xl-nowrap gap-2 gap-lg-3'>
					<FilterContentDropDowns p={{type: "years", searchVal: searchQ, setValFunc: setSearchQ}}/>
					<FilterContentDropDowns p={{type: "status", searchVal: searchQ, setValFunc: setSearchQ}}/>
					<FilterContentDropDowns p={{type: "type", searchVal: searchQ, setValFunc: setSearchQ}}/>
					{
						genres !== 0
						?
							<FilterContentDropDowns p={{type: "genres", searchVal: searchQ, setValFunc: setSearchQ, existData: genres}}/>
						:
							""
					}
					<div className='item-per-page filter-ele position-relative b-g-d3 d-flex align-items-center justify-content-between px-3 py-1 
						rounded-2 gap-2 c-p color-l m-border flex-grow-1' 
						onClick={() => setOpen(!open)}
					>
						<span className='fw-medium'>Item Per Page: {searchQ.limit}</span> <MdKeyboardArrowDown size={18}/>
						<ul className={`dropdown-list position-absolute filter-drop ${open ? 'show' : ''}`}>
							<li>
								<button className='d-flex align-items-center w-100 h-100 justify-content-center' onClick={() => {
									setSearchQ({...searchQ, limit: 5, page: 1}); setOpen(false)
								}}>5</button> 
							</li>
							<li>
								<button className='d-flex align-items-center w-100 h-100 justify-content-center' onClick={() => {
									setSearchQ({...searchQ, limit: 10, page: 1}); setOpen(false)
								}}>10</button> 
							</li>
							<li>
								<button className='d-flex align-items-center w-100 h-100 justify-content-center' onClick={() => {
									setSearchQ({...searchQ, limit: 25, page: 1}); setOpen(false)
								}}>25</button> 
							</li>
						</ul>
					</div>
					<div className='input-container'>
						<input type="text" placeholder='Search By Content Title' className='color-g fw-medium m-border rounded-2' maxLength={34} value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
						/>
						<span className='color-g b-g-d3 rounded-2'><CiSearch size={18}/></span>
					</div>
				</div>
			</div>	
			<div className='table-container overflow-auto'>
				<table className='fs-main content-table'>
					<thead>
						<tr className='color-g fw-semibold'>
							<td><span>Poster</span></td>
							<td><span>Title</span></td>
							<td><span>Type</span></td>
							<td><span>Status</span></td>
							<td><span>Action</span></td>
						</tr>
					</thead>
					<tbody className='table-body'>
						{
							data.map((content)=>(
								<tr key={content.content_id}>
									<td>
										<div>
											<img className='rounded-3' src={content.poster_url} alt={content.title} />
										</div>
									</td> 
									<td><span className='color-l'>{content.title}</span></td>
									<td><span className='color-g text-capitalize fw-medium'>{content.content_type === "M" ? "Movie" : "Series"}</span></td>
									<td><span className={`r-op-bg ${content.c_status === "upcoming" ? "color-y" : content.c_status === "hidden" ? "color-r" : "color-gr"}`}>{content.c_status}</span></td>
									<td>
										<div className='color-g d-flex align-items-center gap-3'>
											<Link href={`/dashboard/content/edit/${content.content_id}`} className='color-g d-flex align-items-center'>
												<MdModeEditOutline className='c-p' size={18}/>
											</Link>
											<RiDeleteBin6Fill className='c-p' size={18} onClick={() => deleteContent(content.content_id)}/>
										</div>
									</td>
								</tr>
							))
						}
					</tbody>
					<tfoot>
						<tr>
							<td className='w-100'>
								<PaginationComp data={{elePerPage: searchQ.limit, total: Number(totalContent), page: searchQ.page, 
									filterVals: searchQ, setFilterPage: setSearchQ}}
								/>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	)
}

export default ContentBody
