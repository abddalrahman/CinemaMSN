"use client"
import React, { useEffect, useState } from 'react'
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import { toast } from 'react-toastify';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdModeEditOutline } from 'react-icons/md';
import Link from 'next/link';
import FilterNewSection from './FilterNewSection';
import ConfirmComp from '@/app/componentes/global/smallComp/ConfirmComp';
import PaginationComp from '@/app/componentes/global/PaginationComp';
import { useDebounce } from '@/utils/debounce';
import { DomainPath } from '@/utils/DomainPath';

const NewsBody = () => {
	const [searchText, setSearchText] = useState("");
	const [totalNews, setTotalNews] = useState(0)
	const [searchQ, setSearchQ] = useState({
		TBtext: null,
		about: null,
		page: 1,
		limit: 10
	});
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [deleteNews, setDeleteNews] = useState({
		NewsID: null,
		showConfirm: false,
	});
	const debouncedSearchTerm = useDebounce(searchText, 800);
	
	const fetchData = async () => {
		try {
			setLoading(true);
			const news = await fetchAPIFunc(`${DomainPath}/api/globals/news/getNewsWithFiltering?about=${searchQ.about?.slice(0,1) || null}&TBtext=
				${searchQ.TBtext}&page=${searchQ.page}&limit=${searchQ.limit}`, "GET", {});
			const result = await news.json();
			if (news.status === 200) {
				setData(result.data)
				setTotalNews(Number(result.dataLength))
			} else {
				toast.error("Failed To Get News");
			}
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error);
			return toast.error("something want wrong")
		}
	}

	useEffect(() => {
		setSearchQ(prev => ({ ...prev, TBtext: debouncedSearchTerm, page: 1 }));
	}, [debouncedSearchTerm]);

	useEffect(() => {
		const run = async () => {
			setDeleteNews({
				NewsID: null,
				showConfirm: false
			})
			await fetchData();
		}
		run();
	}, [searchQ.TBtext, searchQ.about, searchQ.limit, searchQ.page]);

	const deleteContent = (nID) => {
		setDeleteNews({
			NewsID: nID,
			showConfirm: true
		});
	}

	const handleConfirm = async () => {
		setLoading(true)
		setDeleteNews({
			...deleteNews,
			showConfirm: false
		})
		if (deleteNews.NewsID) {
			try {
				const respons = await fetchAPIFunc(`${DomainPath}/api/admin/news`, "DELETE", {id: deleteNews.NewsID});
				const result = await respons.json();
				if (respons.status === 200) {
					setLoading(false);
					toast.success(result.message);
					setDeleteNews({
						NewsID: null,
						showConfirm: false
					});
					await fetchData();
					return;
				} else {
					setLoading(false);
					setDeleteNews({
						NewsID: null,
						showConfirm: false
					});
					return toast.error(result.message);
				}
			} catch (error) {
				console.log(error);
				setLoading(false);
				setDeleteNews({
					NewsID: null,
					showConfirm: false
				});
				return toast.error("something went wrong");
			}
		}
		
	}

	const handleCansle = () => {
		setLoading(false);
		setDeleteNews({
			NewsID: null,
			showConfirm: false
		});
		return;
	}

	return (
		<>
			{
				loading ? <CoverL/> : ''
			}
			{
				deleteNews.showConfirm
				?
					<ConfirmComp data={{title: "Delete News", body: "Are You Shur You Want To Delete This News", noBtn: "No", yesBtn: "Delete", bg: "d"}}
						callFuncs={{confirmFunc:handleConfirm, cansleFunc: handleCansle}}
					/>
				:
					''
			}
			<div className='mt-4'>
				<FilterNewSection data={{searchQ, setSearchQ, searchText, setSearchText}}/>
				<div className='table-container fs-main overflow-auto'>
					<table className='news-table'>
						<thead>
							<tr className='color-g fw-semibold'>
								<td><span>Image</span></td>
								<td><span>Body</span></td>
								<td><span>Title</span></td>
								<td><span>About</span></td>
								<td><span>Action</span></td>
							</tr>
						</thead>
						<tbody className='table-body'>
							{
								data.map((news)=>(
									<tr key={news.news_id}>
										<td><span className='color-l '>
											{
												news.image_url !== null && news.image_url.replace("No Data", "") !== ""
												?
													<img src={news.image_url} alt={news.title} />
												:
													<span>No Image</span>
											}
										</span></td> 
										<td><div className='news-b-container position-relative'><p className='color-g text-start'>{news.body}</p></div></td>
										<td><span className='color-l text-start'>{news.title}</span></td>
										<td className='d-flex flex-column gap-2'>
											{
												news.is_about_movies
												?
												<span className='r-op-bg color-gr'>Movies</span>
												:''
											}
											{
												news.is_about_series
												?
												<span className='r-op-bg color-y'>Series</span>
												:''
											}
											{
												news.is_about_people
												?
												<span className='r-op-bg color-r'>People</span>
												:''
											}
										</td>
										<td>
											<div className='color-g d-flex align-items-center gap-3'>
												<Link href={`/dashboard/news/edit/${news.news_id}`} className='color-g d-flex align-items-center'>
													<MdModeEditOutline className='c-p' size={20}/>
												</Link>
												<RiDeleteBin6Fill className='c-p' size={20} onClick={() => deleteContent(news.news_id)}/>
											</div>
										</td>
									</tr>
								))
							}
						</tbody>
						<tfoot>
							<tr>
								<td className='w-100'>
									<PaginationComp data={{elePerPage: searchQ.limit, total: Number(totalNews), page: searchQ.page, 
										filterVals: searchQ, setFilterPage: setSearchQ}}
									/>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</>
	)
}

export default NewsBody
