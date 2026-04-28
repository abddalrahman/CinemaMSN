"use client"
import ConfirmComp from '@/app/componentes/global/smallComp/ConfirmComp';
import FormLableInp from '@/app/componentes/global/smallComp/FormLableInp';
import IconTextTitle from '@/app/componentes/global/smallComp/IconTextTitle'
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { useDebounce } from '@/utils/debounce';
import { DomainPath } from '@/utils/DomainPath';
import { addContentPeopleConnectionValidation, deletContentCastMemberValidation } from '@/utils/zodValidations';
import React, { useEffect, useRef, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { FaPeopleGroup } from "react-icons/fa6";
import { MdAdd, MdClose, MdDelete, MdKeyboardArrowDown } from "react-icons/md";
import { toast } from 'react-toastify';

const CastAndCrew = ({contentId, genres}) => {
	const resultsDiv = useRef();
	const [existCast, setExistCast] = useState(undefined);
	const [searchText, setSearchText] = useState('');
	const [searchResulte, setSearchResulte] = useState({
		loading: false,
		data: []	
	});
	const [newCast, setNewCast] = useState({
		IDs: [],
		info: []
	});
	const [opens, setOpens] = useState({});
	const [loading, setLoading] = useState(false);
	const [deleteControle, setDeleteControle] = useState({
		data: null,
		showConfirm: false
	});
	const debouncedSearchTerm = useDebounce(searchText, 800);

	const getData = async () => {
		try {
			setLoading(true);
			const castRespons = await fetchAPIFunc(`${DomainPath}/api/globals/getContentCast?cid=${contentId}`, "GET", {});
			const castResult = await castRespons.json();
			if (castRespons.status === 200) {
				setExistCast(castResult);
			} else {
				setExistCast(null);
			}
			setLoading(false);
			setSearchResulte({
				loading: false,
				data: []
			})
			setNewCast({
				IDs: [],
				info: []
			})
			setOpens({});
			setDeleteControle({
				data: null,
				showConfirm: false
			})
		} catch (error) {
			console.log(error);
			setExistCast(null);
			setLoading(false);
			setSearchResulte({
				loading: false,
				data: []
			})
			setNewCast({
				IDs: [],
				info: []
			})
			setOpens({});
			setDeleteControle({
				data: null,
				showConfirm: false
			})
		}
	}

	const searchPeopleFunc = async (debouncedSearchTerm) => {
		if (searchText.length > 0) {
			setSearchResulte({
				loading: true,
				data: []
			});
			setTimeout(() => {
				if (resultsDiv.current && !resultsDiv.current.classList.contains('show')) {
					resultsDiv.current.classList.add('show');
				}
			}, 100);
		} else {
			setSearchResulte({
				loading: false,
				data: []
			});
			setTimeout(() => {
				if (resultsDiv.current){
					resultsDiv.current.classList.remove('show');
				}
			}, 100);
		}
		if (searchText.trim().length > 2) {
			const searchObj = JSON.stringify({
				people: true,
				content: false,
				news: false,
			});
			try {
				const resopns = await fetchAPIFunc(`${DomainPath}/api/globals/searchApi?title=${debouncedSearchTerm}&about=${searchObj}`, "GET", {});
				const result = await resopns.json();
				if (resopns.status === 200) {
					setSearchResulte({
						loading: false,
						data: result.people
					});
				} else {
					setSearchResulte({
						loading: false,
						data: []
					});
				}
			} catch (error) {
				console.log(error);
				setSearchResulte({
					loading: false,
					data: []
				});
			}
		}
	}

	useEffect(() => {
		const run = async () => {
			await searchPeopleFunc(debouncedSearchTerm);
		}
		run();
	}, [debouncedSearchTerm])

	const handleDeleteNewCastMember = (id) => {
		const newIDs = newCast.IDs.filter((pId) => pId !== id);
		const newInfo = newCast.info.filter((p) => p.person_id !== id);
		setNewCast({
			IDs: newIDs,
			info: newInfo
		});
	}

	const addNewCast = async () => {
		if (newCast.IDs.length > 0) {
			setLoading(true);
			try {
				const newCastToSend = [];
				newCast.info.map((member) => {
					const memberObj = {
						content_id: parseInt(contentId),
						people_id: parseInt(member.person_id),
						role_id: parseInt(member.role_id),
						is_lead: member.is_lead
					}
					newCastToSend.push(memberObj);
				})
				const validation = addContentPeopleConnectionValidation.safeParse(newCastToSend);
				if (!validation.success) {
					setLoading(false);
					return toast.warning("Enter all Data for all New Cast Place")
				}
				const respons = await fetchAPIFunc(`${DomainPath}/api/admin/content/contentCast`, "POST", newCastToSend);
				const resolt = await respons.json();
				if (respons.status === 200) {
					setLoading(false);
					toast.success("New Cast Members Added Successfuly");
					await getData();
				} else {
					setLoading(false);
					toast.error("SomeThing Want Wrong. Try Again");
				}
			} catch (error) {
				setLoading(false);
				console.log(error);
				return toast.error("SomeThing Want Wrong");
			}
		} else {
			return toast.warning("There is no New Cast Members To Add");
		}
	}

	const deleteMember = (p_id, p_role) => {
		setDeleteControle({
			data: {person_id: parseInt(p_id), content_id: parseInt(contentId), role_genre_id: parseInt(p_role)},
			showConfirm: true
		});
	}
	
	const handleDeleteCastMember = async () => {
		try {
			setLoading(true);
			setDeleteControle({
				...deleteControle,
				showConfirm: false
			});
			const objToSend = deleteControle.data;
			const validation = deletContentCastMemberValidation.safeParse(objToSend);
			if (!validation.success) return toast.error("Data Entered is Wrong");
			const respons = await fetchAPIFunc(`${DomainPath}/api/admin/content/contentCast`, "DELETE", objToSend);
			const result = await respons.json();
			if (respons.status === 200) {
				setDeleteControle({
					data: null,
					showConfirm: false
				});
				setLoading(false);
				toast.success(result.message);
				await getData();
			} else {
				setDeleteControle({
					data: null,
					showConfirm: false
				});
				setLoading(false);
				toast.error(result.message);
			}
		} catch (error) {
			setDeleteControle({
				data: null,
				showConfirm: false
			});
			setLoading(false);
			console.log(error)
			return toast.error("failed to DELETE Member");
		}
	}

	const handleCansle = () => {
		setLoading(false);
		setDeleteControle({
			data: null,
			showConfirm: false
		});
		return;
	}

	useEffect(() => {
		const run = async () => {
			await getData();
		}
		run();
	}, [])

	return (
		<div className='b-g-d3 m-border p-3 p-md-4 rounded-4 mb-5 cast-crew' tabIndex={0}>
			{
				deleteControle.showConfirm
				?
					<ConfirmComp data={{title: "Delete Cast Member", body: "Are You Shur You Want To Delete This Memeber", noBtn: "No", yesBtn: "Delete", bg: "d"}}
						callFuncs={{confirmFunc:handleDeleteCastMember, cansleFunc: handleCansle}}
					/>
				:
					''
			}
			{
				existCast !== null && existCast !== undefined && !loading
				?
					<>
						<IconTextTitle data= {{iconTag: FaPeopleGroup, text: "Cast & Crew", req: false}}/>
						<FormLableInp data={{req: false, lableT: "Search And Add person You Want", placeH: "Enter Person Name (2 letters at less)", 
							sendData: searchText, setSendDataFunc: setSearchText, single: true}}
						/>
						{
							searchText.length > 0
							?
								<div ref={resultsDiv} className='search-result'>
									{
										searchResulte.loading
										?
											<div className='d-flex align-items-center justify-content-center py-5'>
												<Spinner animation="border" variant="danger" />
											</div>
										:
											searchResulte.data.length > 0
											?
												<ul className='mb-0'>
													{
														searchResulte.data.map((person) => (
															newCast.IDs.includes(person.person_id)
															? 
																<span className='color-l' key={1}>No Result</span>
															: 
																<li key={person.person_id}  className='d-flex align-items-center justify-content-between p-2 p-sm-3 c-p mb-1 rounded-2'
																	onClick={() => {
																		setNewCast({
																			IDs: [...newCast.IDs, person.person_id],
																			info: [...newCast.info, { person_id: person.person_id, p_name: person.p_name, image_url: person.image_url,
																				role_genre_id: "", role_id: "", is_lead: false, open : false
																			}]
																		})
																		setSearchResulte({
																			loading: false,
																			data: []
																		});
																		setSearchText("");
																		setOpens({
																			...opens,
																			[person.person_id.toString()]: false
																		})
																	}}
																>
																	<div>
																		<img src={person.image_url} alt={person.p_name} className='rounded-3 me-3'/>
																		<span className='color-l fw-semibold fs-main'>{person.p_name}</span>
																	</div>
																	<MdAdd size={26} className='color-l c-p'/>
																</li>
														))
													}
												</ul>
											:
												<span className='color-l'>No Results</span>
									}
								</div>
							:''
						}
						{
							newCast.IDs.length > 0
							?
								<div className='new-cast'>
									<label className='main-lable mb-3 mt-5'>New Cast Member</label>
									<ul className='rounded-3 s-border fs-main'>
										<li className='d-none d-sm-flex align-items-center gap-2 b-g-d4 p-3 rounded-top-3 overflow-hidden'>
											<div>Member</div> <div>Lead</div> <div>Role</div> <div>Remove</div>
										</li>
										{
											newCast.info.map((person, index) => (
												<li key={index} className='d-flex align-items-center row-gap-3 b-g-d2 p-3 flex-wrap flex-sm-nowrap'>
													<div><img src={person.image_url} alt={person.p_name} className='rounded-3'/> <span className='fw-bold'>{person.p_name}</span></div>
													<div className='color-l d-flex align-items-center gap-2'>
														<span className='d-sm-none'>Lead: </span>
														{person.role_genre_id.toLowerCase() === "actor" ? <input className={person.is_lead ? "on" : ""} onClick={() => {
															const newInfo = [];
															newCast.info.map((p) => (
																p.person_id === person.person_id
																?
																	newInfo.push({...p, is_lead: !p.is_lead})
																: newInfo.push(p)
															))
															setNewCast({...newCast, info: newInfo})
														}} type='checkBox'/> : "_"}
													</div> 
													<div>
														<div className='position-relative c-p d-d-container b-g-d3 d-flex align-items-center'
															onClick={() => {
																setTimeout(() => {
																	setOpens({
																		...opens,
																		[person.person_id]: !opens[person.person_id]
																	})
																}, 100);
															}}
														>
															<span className='d-flex align-items-center justify-content-between w-100'>
																<span>
																	{person.role_genre_id !== "" ? 
																	person.role_genre_id.length > 10 ? person.role_genre_id.slice(0,10) + ".." : person.role_genre_id : "Role"} 
																</span>
																<MdKeyboardArrowDown size={18} className='ms-4'/>
															</span>
															<ul className={`dropdown-list position-absolute ${opens[person.person_id] ? "show" : ""}`}>
																{
																	genres.map((genre) => {
																		if (existCast.some((p) => Number(p.role_genre_id) === Number(genre.genre_id) && 
																			Number(p.person_id) === Number(person.person_id))) return ''
																		return <li key={genre.genre_id}>
																			<button className='d-flex align-items-center w-100 h-100 justify-content-center' 
																				onClick={() => { 
																					const newInfo = [];
																					newCast.info.map((p) => (
																						p.person_id === person.person_id
																						?
																							newInfo.push({...p, role_genre_id: genre.name, role_id: genre.genre_id, is_lead: false})
																						: newInfo.push(p)
																					))
																					setNewCast({...newCast, info: newInfo}) 
																				}}
																			>{genre.name}</button> 
																		</li>
																	})
																}
															</ul>
														</div>
													</div> 
													<div>
														<button className='p-0 border-0 bg-transparent color-l d-sm-none d-flex align-items-center gap-2 fs-sm'
															onClick={() => handleDeleteNewCastMember(person.person_id)}
														>
															<MdClose size={16} className='c-p color-r delete-icon'/>
															<span>Remove</span>
														</button>
														<MdClose size={22} onClick={() => handleDeleteNewCastMember(person.person_id)} 
															className='c-p color-r delete-icon d-none d-sm-flex'
														/>
													</div>
												</li>
											))
										}
									</ul>
									<button className='main-red-btn' onClick={addNewCast}>Add New Cast</button>
								</div>
							:''
						}
						<div className='current-cast mt-5 fs-main overflow-auto'>
							<label className='main-lable mb-3'>Current Cast</label>
							{
								existCast.length > 0
								?
									<ul className='overflow-hidden rounded-3 s-border'>
										<li className='d-sm-flex d-none align-items-center gap-2 b-g-d4 p-3'>
											<div>Member</div> <div>Role</div> <div>Lead</div> <div>Delete</div>
										</li>
										{
											existCast.map((person, index) => (
												<li key={index} className='d-flex flex-wrap flex-sm-nowrap align-items-center row-gap-3 b-g-d2 p-3'>
													<div>
														<img src={person.image_url} alt={person.p_name} className='rounded-3'/> 
														<span className='fw-semibold'>{person.p_name}</span>
													</div>
													<div className='text-uppercase fw-semibold color-g d-flex align-items-center gap-2'>
														<span className='color-l fw-bold d-sm-none'>Role: </span>
														{genres.filter((genre) => genre.genre_id === person.role_genre_id)[0].name}
													</div> 
													<div className='d-flex align-items-center gap-2'>
														<span className='d-sm-none color-l fw-bold'>Lead: </span>
														<span className={`r-op-bg ${person.is_lead ? "color-gr" : "color-r"}`}>{person.is_lead ? "Yes" : "No"}</span>
													</div> 
													<div>
														{<MdDelete size={22} onClick={() => deleteMember(person.person_id, person.role_genre_id)} 
															className='c-p color-r delete-icon'
														/>}
													</div>
												</li>		
											))
										}
									</ul>
								:
									<div className='color-l b-g-d2 p-3 rounded-1'>No Cast Added To this Content</div>
							}
						</div>
					</>
				:
					existCast === undefined || loading
					?
						<div className='p-5 d-flex align-items-center justify-content-center'>
							<Spinner animation="border" variant="danger" />
						</div>
					:
						<div className='color-l b-g-d2 p-3 rounded-1'>Failed To Get Data</div>
			}
		</div>
	)
}

export default CastAndCrew
