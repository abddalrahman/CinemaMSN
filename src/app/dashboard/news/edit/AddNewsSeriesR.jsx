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

const AddNewsSeriesR = ({ data }) => {
	const {existingSR, dataToSend, setDataToSend, searchResults, setSearchResults, nID, reGetD} = data;
	const existIds = existingSR.length > 0 ? existingSR.map((series) => series.content_id) : [];
	const notExistInExistingSR = searchResults.series.results.filter((series) => !existIds.includes(series.content_id) && 
		!dataToSend.series.ids.includes(series.content_id)
	);
	const searchFieldRef = useRef(null);
	const [deleteHandle, setDeleteHandle] = useState({
		loading: false,
		contentID: null,
		showConfirm: false
	})
	const [searchText, setSearchText] = useState('');
	const debouncedSearchTerm = useDebounce(searchText, 800);

	const getSeriesBySearch = async (textV) => {
		if (textV.trim() === "" || textV.trim().length < 3) {
			setSearchResults({
				...searchResults,
				series: {
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
			const series = await fetchAPIFunc(`${DomainPath}/api/globals/searchApi?title=${textV.trim()}&about=${searchObj}`, "GET", {}, null, false, "no-store");
			const seriesResult = await series.json();
			if (series.status === 200) {
				setSearchResults({
					...searchResults,
					series: {
						results: seriesResult.contents.filter((content) => content.content_type === "S"),
						loading: false,
						searching: true
					}
				});
				return;
			}
		} catch (error) {
			console.log(error);
			return toast.error("failed to search series");
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
			await getSeriesBySearch(debouncedSearchTerm);
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
				<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "Related Series", req: false}}/>
				<div className='main-form-lbl-inp mb-3'>
					<label>Search Series</label>
					<div className='position-relative'>
						<input type="text" placeholder='Search series by title' className='w-100 mb-3' ref={searchFieldRef} value={searchText}
							onInput={(e) => setSearchText(e.currentTarget.value)}
						/>
						{
							searchResults.series.loading
							?	
								<div className='d-flex align-items-center justify-content-center py-5 w-100'>
									<Spinner animation="border" variant="danger" />
								</div>
							:
								<ul className='show-s-m-result fs-main'> 
									{
										
										searchResults.series.results.length > 0 
										? 
											notExistInExistingSR.length > 0
											?
												notExistInExistingSR.map((series) =>
													<li key={series.content_id} className='b-g-d2 color-l p-3 rounded-2 mb-2 d-flex align-items-center gap-2 c-p'
														onClick={() => {
															setDataToSend({...dataToSend, series: {
																ids: [...dataToSend.series.ids, series.content_id],
																data: [...dataToSend.series.data, series]
															}})
															setSearchResults({...searchResults, series: {
																results: [],
																loading: false,
																searching: false
															}});
															searchFieldRef.current.value = "";
														}}
													>
														<img src={series.poster_url} alt={series.title} />
														<span>{series.title}</span>
														<MdAdd size={22} className='color-l ms-auto'/>
													</li>
												) 
											: <li className='b-g-d2 mt-2 rounded-2 color-l p-3'>no result found !</li>
										: searchResults.series.searching && <li className='b-g-d2 mt-2 rounded-2 color-l p-3'>no result found !</li>
									}
								</ul>
						}
					</div>
					{
						dataToSend.series.data.length > 0
						?
							<div className='new-related-series'>
								<label className='main-label mb-3'>New Related Series</label>
								<ul className='fs-main'>
									{
										dataToSend.series.data.map((series) => 
											<li key={series.content_id} className='b-g-d2 color-l p-3 rounded-2 mb-2 d-flex align-items-center gap-2'>
												<img src={series.poster_url} alt={series.title} />
												<span>{series.title}</span>
												<MdClose size={22} className='color-l c-p ms-auto'
													onClick={() => {
														setDataToSend({
															...dataToSend, 
															series: {
															ids: dataToSend.series.ids.filter((id) => id !== series.content_id),
															data: dataToSend.series.data.filter((data) => data.content_id !== series.content_id)
														}})
													}}
												/>
											</li>
										)
									}
								</ul>
							</div>
						:''
					}
					<div className='old-related-series'>
						<label className='main-label mb-3'>Old Related Series</label>
						<ul className='fs-main'>
							{
								existingSR.length > 0 ? existingSR.map((series) => 
									<li key={series.content_id} className='b-g-d2 color-l p-3 rounded-2 mb-2 d-flex align-items-center gap-2'>
										<img src={series.poster_url} alt={series.title} />
										<span>{series.title}</span>
										<RiDeleteBin6Fill size={22} className='color-r c-p ms-auto'
											onClick={() => handleDeleteOldRelation(series.content_id)}
										/>
									</li>
								) : <li className='b-g-d2 mt-2 rounded-2 color-l p-3'>there is not old New Series Relations</li>
							}
						</ul>
					</div>
				</div>
			</div>
		</>
	)
}

export default AddNewsSeriesR