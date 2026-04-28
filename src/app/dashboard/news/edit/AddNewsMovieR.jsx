"use client"
import ConfirmComp from '@/app/componentes/global/smallComp/ConfirmComp';
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import IconTextTitle from '@/app/componentes/global/smallComp/IconTextTitle'
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { useDebounce } from '@/utils/debounce';
import { DomainPath } from '@/utils/DomainPath';
import React, { useEffect, useRef, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { IoIosInformationCircle } from 'react-icons/io'
import { MdAdd, MdClose } from 'react-icons/md';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { toast } from 'react-toastify';

const AddNewsMovieR = ({ data }) => {
	const {existingMR, dataToSend, setDataToSend, searchResults, setSearchResults, nID, reGetD} = data;
	const existIds = existingMR.length > 0 ? existingMR.map((movie) => movie.content_id) : [];
	const notExistInExistingMR = searchResults.movies.results.filter((movie) => !existIds.includes(movie.content_id) && 
		!dataToSend.movies.ids.includes(movie.content_id)
	);
	const searchFieldRef = useRef(null);
	const [deleteHandle, setDeleteHandle] = useState({
		loading: false,
		contentID: null,
		showConfirm: false
	})
	const [searchText, setSearchText] = useState('');
	const debouncedSearchTerm = useDebounce(searchText, 800);

	const getMoviesBySearch = async (textV) => {
		if (textV.trim() === "" || textV.trim().length < 3) {
			setSearchResults({
				...searchResults,
				movies: {
					results: [],
					loading: textV !== "",
					searching: textV !== ""
				}
			})
			return;
		}
		try {
			const searchObj = JSON.stringify({
				people: false,
				content: true,
				news: false,
			});
			const movies = await fetchAPIFunc(`${DomainPath}/api/globals/searchApi?title=${textV.trim()}&about=${searchObj}`, "GET", {});
			const moviesResult = await movies.json();
			if (movies.status === 200) {
				setSearchResults({
					...searchResults,
					movies: {
						results: moviesResult.contents.filter((content) => content.content_type === "M"),
						loading: false,
						searching: true
					}
				});
				return;
			}
		} catch (error) {
			console.log(error);
			return toast.error("failed to search movies");
		}
	}

	const handleDeleteOldRelation = async (cID) => {
		setDeleteHandle({
			loading: false,
			contentID: cID,
			showConfirm: true
		});
	}

	const handleConfirm = async () => {
		setDeleteHandle({
			loading: true,
			contentID: deleteHandle.contentID,
			showConfirm: false
		})
		const objToDelete = {
			content_id: Number(deleteHandle.contentID),
			news_id: Number(nID),
			deleteIs: "content"
		}
		if (nID === null) return toast.error("something went wrong!!");
		try {
			const respons = await fetchAPIFunc(`${DomainPath}/api/admin/news/newsConnections`, "DELETE", objToDelete);
			const result = await respons.json();
			if (respons.status === 200) {
				setDeleteHandle({
					loading: false,
					contentID: null,
					showConfirm: false
				});
				toast.success(result.message);
				reGetD()
			} else {
				setDeleteHandle({
					loading: false,
					contentID: null,
					showConfirm: false
				});
				return toast.error(result.message);
			}
		} catch (error) {
			console.log(error);
			return toast.error("something went wrong!!");
		}
	}

	const handleCansle = () => {
		setDeleteHandle({
			loading: false,
			contentID: null,
			showConfirm: false
		});
		return;
	}

	useEffect(() => {
		const run = async () => {
			await getMoviesBySearch(debouncedSearchTerm);
		}
		run();
	}, [debouncedSearchTerm])

	return (
		<>
			{
				deleteHandle.loading
				?
					<CoverL/>
				: ''
			}
			{
				deleteHandle.showConfirm
				?
					<ConfirmComp data={{title: "Delete Relation", body: "Are You Shur You Want To Delete This Relation", noBtn: "No", yesBtn: "Delete", bg: "d"}}
						callFuncs={{confirmFunc:handleConfirm, cansleFunc: handleCansle}}
					/>
				: ''
			}
			<div className='rounded-4 mt-4'>
				<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "Related Movies", req: false}}/>
				<div className='main-form-lbl-inp mb-3'>
					<label>Search Movies</label>
					<div className='position-relative'>
						<input type="text" placeholder='Search movies by title' className='w-100 mb-3' ref={searchFieldRef} value={searchText}
							onInput={(e) => setSearchText(e.currentTarget.value)}
						/>
						{
							searchResults.movies.loading
							?	
								<div className='d-flex align-items-center justify-content-center py-5 w-100'>
									<Spinner animation="border" variant="danger" />
								</div>
							:
								<ul className='show-s-m-result fs-main'> 
									{
										searchResults.movies.results.length > 0 
										? 
											notExistInExistingMR.length > 0
											?
												notExistInExistingMR.map((movie) =>
													<li key={movie.content_id} className='b-g-d2 color-l p-3 rounded-2 mb-2 d-flex align-items-center gap-2 c-p'
														onClick={() => {
															setDataToSend({...dataToSend, movies: {
																ids: [...dataToSend.movies.ids, movie.content_id],
																data: [...dataToSend.movies.data, movie]
															}});
															setSearchResults({...searchResults, movies: {
																results: [],
																loading: false,
																searching: false
															}});
															searchFieldRef.current.value = "";
														}}
													>
														<img src={movie.poster_url} alt={movie.title} />
														<span>{movie.title}</span>
														<MdAdd size={22} className='color-l ms-auto'/>
													</li>
												) 
											: <li className='b-g-d2 mt-2 color-l p-3'>no result found !</li>
										: searchResults.movies.searching && <li className='b-g-d2 mt-2 color-l p-3'>no result found !</li>
									}
								</ul>
						}
					</div>
					{
						dataToSend.movies.data.length > 0
						?
							<div className='new-related-movies'>
								<label className='main-label mb-3'>New Related Movies</label>
								<ul className='fs-main'>
									{
										dataToSend.movies.data.map((movie) => 
											<li key={movie.content_id} className='b-g-d2 color-l p-3 rounded-2 mb-2 d-flex align-items-center gap-2'>
												<img src={movie.poster_url} alt={movie.title} />
												<span>{movie.title}</span>
												<MdClose size={22} className='color-l c-p ms-auto' onClick={() =>
													setDataToSend({
														...dataToSend,
														movies: {
															ids: dataToSend.movies.ids.filter((id) => id !== movie.content_id),
															data: dataToSend.movies.data.filter((m) => m.content_id !== movie.content_id)
														}
													})
												}/>
											</li>
										)
									}
								</ul>
							</div>
						:''
					}
					<div className='old-related-movies'>
						<label className='main-label mb-3'>Old Related Movies</label>
						<ul className='fs-main'>
							{
								existingMR.length > 0 ? existingMR.map((m) => 
									<li key={m.content_id} className='b-g-d2 color-l p-3 rounded-2 mb-2 d-flex align-items-center gap-2'>
										<img src={m.poster_url} alt={m.title} />
										<span>{m.title}</span>
										<RiDeleteBin6Fill size={22} className='color-r c-p ms-auto'
											onClick={() => handleDeleteOldRelation(m.content_id)}
										/>
									</li>
								) : <li className='b-g-d2 mt-2 rounded-2 color-l p-3'>there is not old New Movies Relations</li>
							}
						</ul>
					</div>
				</div>
			</div>
		</>
	)
}

export default AddNewsMovieR
