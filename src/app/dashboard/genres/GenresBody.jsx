"use client"
import React, { useEffect, useState } from 'react'
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import { toast } from 'react-toastify';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import FilterGenresSection from './FilterGenresSection';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import ConfirmComp from '@/app/componentes/global/smallComp/ConfirmComp';
import PaginationComp from '@/app/componentes/global/PaginationComp';
import { useDebounce } from '@/utils/debounce';
import { DomainPath } from '@/utils/DomainPath';

const GenresBody = () => {
	const [totalGenres, setTotalGenres] = useState(0);
	const [searchText, setSearchText] = useState("");
	const [searchQ, setSearchQ] = useState({
		gKind: "",
		gName: "",
		page: 1,
		limit: 10
	});
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [deleteControle, setDeleteControle] = useState({
		genreID: null,
		showConfirm: false
	})
	const debouncedSearchTerm = useDebounce(searchText, 800);
	
	const fetchData = async () => {
		try {
			setLoading(true);
			const genres = await fetchAPIFunc(`${DomainPath}/api/globals/getGenresForTable?gKind=${searchQ.gKind}&gName=${searchQ.gName}
				&page=${searchQ.page}&limit=${searchQ.limit}`, "GET", {});
			const result = await genres.json();
			if (genres.status === 200) {
				setData(result.data)
				setTotalGenres(Number(result.dataLength))
			} else toast.error("Failed To Get genres");
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error);
			return toast.error("something want wrong")
		}
	}

	useEffect(() => {
		setSearchQ(prev => ({ ...prev, gName: debouncedSearchTerm, page: 1 }));
	}, [debouncedSearchTerm]);
	
	useEffect(() => {
		const run = async () => {
			await fetchData();
		}
		run();
	}, [searchQ.gKind, searchQ.gName, searchQ.limit, searchQ.page]);

	const deleteContent = (gID) => {
		setDeleteControle({
			genreID: gID,
			showConfirm: true
		});
	}
	
	const handleConfirm = async () => {
		try {
			setLoading(true)
			setDeleteControle({
				...deleteControle,
				showConfirm: false
			})
			if (deleteControle.genreID) {
				const respons = await fetchAPIFunc(`${DomainPath}/api/admin/genres`, "DELETE", {id: deleteControle.genreID});
				const result = await respons.json();
				if (respons.status === 200) {
					setLoading(false);
					toast.success(result.message);
					setDeleteControle({
						genreID: null,
						showConfirm: false
					});
					await fetchData();
				} else {
					setLoading(false);
					setDeleteControle({
						genreID: null,
						showConfirm: false
					});
					return toast.error(result.message);
				}
			}

		} catch (error) {
			console.log(error);
			return toast.error("something want wrong");
		}
	}
	const handleCansle = () => {
		setLoading(false);
		setDeleteControle({
			genreID: null,
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
				deleteControle.showConfirm
				?
					<ConfirmComp data={{title: "Delete Genre", body: "Are You Shur You Want To Delete This Genre", noBtn: "No", yesBtn: "Delete", bg: "d"}}
						callFuncs={{confirmFunc:handleConfirm, cansleFunc: handleCansle}}
					/>
				:
					''
			}
			<div className='mt-4'>
				<FilterGenresSection data={{searchQ, setSearchQ, searchText, setSearchText}}/>
				<div className='table-container overflow-auto'>
					<table className='genres-table'>
						<thead>
							<tr className='color-g fw-semibold'>
								<td><span>Name</span></td>
								<td><span>Description</span></td>
								<td><span>ID</span></td>
								<td><span>Kind</span></td>
								<td><span>Action</span></td>
							</tr>
						</thead>
						<tbody className='table-body'>
							{
								data.map((genre)=>(
									<tr key={genre.genre_id}>
										<td><span className='color-l '>{genre.name}</span></td> 
										<td><span className='color-l text-start'>{genre.description}</span></td>
										<td><span className='color-g text-capitalize fw-medium'>{genre.genre_id}</span></td>
										<td><span className={`r-op-bg ${genre.kind === "person_role" ? "color-y" : genre.kind === "content_genre" ?
											"color-r" : genre.kind === "content_award" ? "color-g" : "color-gr"}`}>{genre.kind.replace("_", " ")}</span></td>
										<td>
											<button className='color-g d-flex align-items-center bg-transparent border-0 p-0'>
												<RiDeleteBin6Fill className='c-p' size={20} onClick={() => deleteContent(Number(genre.genre_id))}/>
											</button>
										</td>
									</tr>
								))
							}
						</tbody>
						<tfoot>
							<tr>
								<td className='w-100'>
									<PaginationComp data={{elePerPage: searchQ.limit, total: Number(totalGenres), page: searchQ.page, 
										filterVals: searchQ, setFilterPage: setSearchQ}}
									/>
								</td>
								<td>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</>
	)
}

export default GenresBody
