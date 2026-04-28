"use client"
import ConfirmComp from '@/app/componentes/global/smallComp/ConfirmComp';
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import IconTextTitle from '@/app/componentes/global/smallComp/IconTextTitle';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { useDebounce } from '@/utils/debounce';
import { DomainPath } from '@/utils/DomainPath';
import React, { useEffect, useRef, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { IoIosInformationCircle } from 'react-icons/io';
import { MdAdd, MdClose } from 'react-icons/md';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { toast } from 'react-toastify';

const AddNewsPR = ({ data }) => {
	const {existingPR, dataToSend, setDataToSend, searchResults, setSearchResults, nID, reGetD} = data;
	const existIds = existingPR.length > 0 ? existingPR.map((person) => person.person_id) : [];
	const notExistInexistingPR = searchResults.people.results.filter((person) => !existIds.includes(person.person_id) && 
		!dataToSend.people.ids.includes(person.person_id)
	);
	const searchFieldRef = useRef(null);
	const [deleteHandle, setDeleteHandle] = useState({
		loading: false,
		personID: null,
		showConfirm: false
	})
	const [searchText, setSearchText] = useState('');
	const debouncedSearchTerm = useDebounce(searchText, 800);

	const getPeopleBySearch = async (textV) => {
		if (textV.trim() === "" || textV.trim().length < 3) {
			setSearchResults({
				...searchResults,
				people: {
					results: [],
					loading: textV !== "",
					searching: textV !== ""
				}
			})
			return;
		}
		try {
			const searchObj = JSON.stringify({
				people: true,
				content: false,
				news: false,
			});
			const people = await fetchAPIFunc(`${DomainPath}/api/globals/searchApi?title=${textV.trim()}&about=${searchObj}`, "GET", {});
			const peopleResult = await people.json();
			if (people.status === 200) {
				setSearchResults({
					...searchResults,
					people: {
						results: peopleResult.people,
						loading: false,
						searching: true
					}
				});
				return;
			}
		} catch (error) {
			console.log(error);
			return toast.error("failed to search people");
		}
	}

	const handleDeleteOldRelation = async (pID) => {
		setDeleteHandle({
			loading: false,
			personID: pID,
			showConfirm: true
		});
	}

	const handleConfirm = async () => {
		setDeleteHandle({
			loading: true,
			personID: deleteHandle.personID,
			showConfirm: false
		})
		const objToDelete = {
			person_id: Number(deleteHandle.personID),
			news_id: Number(nID),
			deleteIs: "people"
		}
		if (nID === null) return toast.error("something went wrong!!");
		try {
			const respons = await fetchAPIFunc(`${DomainPath}/api/admin/news/newsConnections`, "DELETE", objToDelete);
			const result = await respons.json();
			if (respons.status === 200) {
				setDeleteHandle({
					loading: false,
					personID: null,
					showConfirm: false
				});
				toast.success(result.message);
				reGetD()
			} else {
				setDeleteHandle({
					loading: false,
					personID: null,
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
			personID: null,
			showConfirm: false
		});
		return;
	}

	useEffect(() => {
		const run = async () => {
			await getPeopleBySearch(debouncedSearchTerm);
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
				<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "Related People", req: false}}/>
				<div className='main-form-lbl-inp mb-3'>
					<label>Search People</label>
					<div className='position-relative'>
						<input type="text" placeholder='Search people by title' className='w-100 mb-3' ref={searchFieldRef} value={searchText}
							onInput={(e) => setSearchText(e.currentTarget.value)}
						/>
						{
							searchResults.people.loading
							?	
								<div className='d-flex align-items-center justify-content-center py-5 w-100'>
									<Spinner animation="border" variant="danger" />
								</div>
							:
								<ul className='show-s-m-result fs-main'> 
									{
										searchResults.people.results.length > 0 
										? 
											notExistInexistingPR.length > 0
											?
												notExistInexistingPR.map((person) =>
													<li key={person.person_id} className='b-g-d2 color-l p-3 rounded-2 mb-2 d-flex align-items-center gap-2 c-p'
														onClick={() => {
															setDataToSend({...dataToSend, people: {
																ids: [...dataToSend.people.ids, person.person_id],
																data: [...dataToSend.people.data, person]
															}});
															setSearchResults({...searchResults, people: {
																results: [],
																loading: false,
																searching: false
															}});
															searchFieldRef.current.value = "";
														}}
													>
														<img src={person.image_url} alt={person.p_name} />
														<span>{person.p_name}</span>
														<MdAdd size={22} className='color-l ms-auto'/>
													</li>
												) 
											: <li className='b-g-d2 mt-2 color-l p-3'>no result found !</li>
										: searchResults.people.searching && <li className='b-g-d2 mt-2 color-l p-3'>no result found !</li>
									}
								</ul>
						}
					</div>
					{
						dataToSend.people.data.length > 0
						?
							<div className='new-related-people'>
								<label className='main-label mb-3'>New Related People</label>
								<ul className='fs-main'>
									{
										dataToSend.people.data.map((person) => 
											<li key={person.person_id} className='b-g-d2 color-l p-3 rounded-2 mb-2 d-flex align-items-center gap-2'>
												<img src={person.image_url} alt={person.p_name} />
												<span>{person.p_name}</span>
												<MdClose size={22} className='color-l c-p ms-auto' onClick={() =>
													setDataToSend({
														...dataToSend,
														people: {
															ids: dataToSend.people.ids.filter((id) => id !== person.person_id),
															data: dataToSend.people.data.filter((p) => p.person_id !== person.person_id)
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
					<div className='old-related-people'>
						<label className='main-label mb-3'>Old Related People</label>
						<ul className='fs-main'>
							{
								existingPR.length > 0 ? existingPR.map((p) => 
									<li key={p.person_id} className='b-g-d2 color-l p-3 rounded-2 mb-2 d-flex align-items-center gap-2'>
										<img src={p.image_url} alt={p.p_name} />
										<span>{p.p_name}</span>
										<RiDeleteBin6Fill size={22} className='color-r c-p ms-auto'
											onClick={() => handleDeleteOldRelation(p.person_id)}
										/>
									</li>
								) : <li className='b-g-d2 mt-2 rounded-2 color-l p-3'>there is not old New People Relations</li>
							}
						</ul>
					</div>
				</div>
			</div>
		</>
	)
}

export default AddNewsPR
