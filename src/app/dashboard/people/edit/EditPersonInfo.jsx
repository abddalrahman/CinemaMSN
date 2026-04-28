"use client"
import CoverL from '@/app/componentes/global/smallComp/CoverL'
import FormLableInp from '@/app/componentes/global/smallComp/FormLableInp'
import IconTextTitle from '@/app/componentes/global/smallComp/IconTextTitle'
import { checkTwoArrIdentical, checkTwoObjIdentical, CreateFormData, fetchAPIFunc, FilterNotUpdatedProp, filterObjectInClient } from '@/utils/clientRandomFunc'
import { addPeopleAwardsValidation, deletePeopleAwardsValidation, editPeopleValidation } from '@/utils/zodValidations'
import React, { useEffect, useState } from 'react'
import { IoIosClose, IoIosInformationCircle } from 'react-icons/io';
import { MdDelete, MdKeyboardArrowDown, MdOutlineClear } from 'react-icons/md';
import { SlCloudUpload } from 'react-icons/sl';
import { toast } from 'react-toastify';
import { BsAwardFill } from "react-icons/bs";
import { FaAsterisk, FaImage } from 'react-icons/fa6'
import ConfirmComp from '@/app/componentes/global/smallComp/ConfirmComp'
import { DomainPath } from '@/utils/DomainPath'

const EditPersonInfo = ({ personId, peopleGenres, peopleAwards }) => {
	const [pData, setPData] = useState({
		mainInfo: undefined,
		personGenres: undefined, 
		personAwards: undefined
	});
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState({
		genres: false,
		awards: false
	});
	const [dataToSend, setDataToSend] = useState({
		p_name: pData.mainInfo?.p_name || "",
		bio: pData.mainInfo?.bio || "",
		image: "",
		birth_date: pData.mainInfo?.birth_date || "",
		height_cm: pData.mainInfo?.height_cm || "",
		children_count: pData.mainInfo?.children_count || "",
		nationality: pData.mainInfo?.nationality || "",
		genresList: pData.personGenres?.length > 0 ? pData.personGenres.map((item) => parseInt(item.genre_id)) : []
	})
	const [newAwards, setNewAwards] = useState({
		genre_id: null,
    awarded_at: ""
	});
	const [deleteControle, setDeleteControle] = useState({
		data: null,
		showConfirm: false
	});

	const getData = async () => {
		try {
			setLoading(true)
			const personInfoResp = await fetchAPIFunc(`${DomainPath}/api/globals/people/getAllPersonInformation?id=${personId}`, "GET", {});
			const personInfoRest = await personInfoResp.json();
			if (personInfoResp.status === 200) {
				setPData({
					mainInfo: personInfoRest.mainInfo,
					personGenres: personInfoRest.personGenres,
					personAwards: personInfoRest.personAwards
				});
				setDataToSend({
					p_name: personInfoRest.mainInfo?.p_name || "",
					bio: personInfoRest.mainInfo?.bio || "",
					image: "",
					birth_date: personInfoRest.mainInfo?.birth_date || "",
					height_cm: personInfoRest.mainInfo?.height_cm || "",
					children_count: personInfoRest.mainInfo?.children_count || "",
					nationality: personInfoRest.mainInfo?.nationality || "",
					genresList: personInfoRest.personGenres?.length > 0 ? personInfoRest.personGenres.map((item) => parseInt(item.genre_id)) : undefined
				})
			} else {
				setPData({mainInfo: null, personGenres: null, personAwards: null});
				setDataToSend({p_name: "", bio: "", image: "", birth_date: "", height_cm: "", children_count: "", nationality: "", genresList: []})
			}
			setLoading(false)
		} catch (error) {
			console.log(error)
			setPData({mainInfo: null, personGenres: null, personAwards: null});
			setDataToSend({p_name: "", bio: "", image: "", birth_date: "", height_cm: "", children_count: "", nationality: "", genresList: []})
			setLoading(false)
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const btnIS = e.nativeEvent.submitter.name;
			if (btnIS === "subminBtn") {
				setLoading(true)
				const filteredObj = filterObjectInClient(dataToSend, ["", 0, null, "No Data"]);
				const validation = editPeopleValidation.safeParse(filteredObj);
				if (!validation.success) {
					setLoading(false)
					return toast.error(validation.error.issues[0].message);
				} 
				else {
					const finalFilteredObj = FilterNotUpdatedProp(pData.mainInfo, filteredObj, ["image", "genresList"]);
					dataToSend.image !== '' ? finalFilteredObj.image = dataToSend.image : ''
					if (Object.keys(finalFilteredObj).length > 0) {
						finalFilteredObj.id = personId
						const formData = CreateFormData(finalFilteredObj);
						const respons = await fetchAPIFunc(`${DomainPath}/api/admin/people`, "PUT", formData, null, true);
						const result = await respons.json();
						if (respons.status === 200) {
							toast.success(result.message);
							setLoading(false)
						} else {
							setLoading(false)
							return toast.error(result.message);
						}
					} else {
						toast.error("No accebtable change");
					}
					if (!checkTwoArrIdentical(dataToSend.genresList, pData.personGenres.map((item) => Number(item.genre_id)), true)) {
							const toDeleteGenres = pData.personGenres.filter((item) => !dataToSend.genresList.includes(Number(item.genre_id))).map((item) => 
								Number(item.genre_id)
						);
						const toAddGenres = dataToSend.genresList.filter((item) => !pData.personGenres.map((i) => Number(i.genre_id)).includes(item));
						const objToS = {id: Number(personId), AddArray: toAddGenres, deleteArray: toDeleteGenres};
						const respons = await fetchAPIFunc(`${DomainPath}/api/admin/people/peopleGenres`, "PUT", objToS);
						const result = await respons.json();
						if (respons.status === 200) {
							setLoading(false)
							toast.success(result.message);
						} else {
							setLoading(false)
							return toast.error(result.message);
						}
					}
					setLoading(false)
					await getData();
				}
			}
		} catch (error) {
			setLoading(false)
			console.log(error);
			return toast.error('Something Went Wrong Tyry Again');
		} 
	}
	
	const handleAddAward = async (e) => {
		try {
			e.preventDefault();
			const btnIS = e.nativeEvent.submitter.name;
			if (btnIS === "subminBtn") {
				setLoading(true)
				const awardObj = {
					person_id: parseInt(personId),
					genre_name: peopleAwards.filter((item) => item.genre_id == newAwards.genre_id)[0].name || null, 
					awarded_at: newAwards.awarded_at
				};
				const validation = addPeopleAwardsValidation.safeParse(awardObj);
				if (!validation.success) {
					setLoading(false)
					return toast.error(validation.error.issues[0].message);
				} else {
					const respons = await fetchAPIFunc(`${DomainPath}/api/admin/people/pAward`, "POST", awardObj);
					const result = await respons.json();
					if (respons.status === 200) {
						setLoading(false)
						toast.success(result.message);
						setNewAwards({genre_id: null, awarded_at: ""});
						await getData();
					} else {
						setLoading(false)
						return toast.error(result.message);
					}
				}
			}
		} catch (error) {
			setLoading(false)
			console.log(error);
			return toast.error('Something Went Wrong Tyry Again');
		}
	}

	useEffect (() => {
		const run = async () => {
			await getData();
		}
		run()
	}, [])

	const deleteContent = (dataObj) => {
		setDeleteControle({
			data: dataObj,
			showConfirm: true
		});
	}
	
	const handleConfirm = async () => {
		setLoading(true)
		setDeleteControle({
			...deleteControle,
			showConfirm: false
		})
		if (deleteControle.data) {
			try {
				const validationDelete = deletePeopleAwardsValidation.safeParse(deleteControle.data);
				if (!validationDelete.success) {
					setLoading(false);
					return toast.error(validationDelete.error.issues[0].message);
				}
				const respons = await fetchAPIFunc(`${DomainPath}/api/admin/people/pAward`, "DELETE", {...deleteControle.data});
				const result = await respons.json();
				if (respons.status === 200) {
					setLoading(false);
					toast.success(result.message);
					setDeleteControle({
						data: null,
						showConfirm: false
					});
					await getData();
				} else {
					setLoading(false);
					setDeleteControle({
						data: null,
						showConfirm: false
					});
					return toast.error(result.message);
				}
			} catch (error) {
				console.log(error);
				setLoading(false);
				setDeleteControle({
					data: null,
					showConfirm: false
				});
				return toast.error('Something Went Wrong Tyry Again');
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
		<>
			{
				loading || pData.mainInfo === undefined || pData.personAwards === undefined || pData.personGenres === undefined  ? <CoverL/> : ""
			}
			{
				deleteControle.showConfirm
				?
					<ConfirmComp data={{title: "Delete Award", body: "Are You Shur You Want To Delete This Award", noBtn: "No", yesBtn: "Delete", bg: "d"}}
						callFuncs={{confirmFunc:handleConfirm, cansleFunc: handleCansle}}
					/>
				:
					''
			}
			{
				pData.mainInfo !== null && pData.personAwards !== null && pData.personGenres !== null && pData.mainInfo !== undefined 
				&& pData.personAwards !== undefined && pData.personGenres !== undefined
				?
					<>
						<form onSubmit={(e) => handleSubmit(e)}>
							<div className='b-g-d3 m-border p-3 p-md-4 rounded-4 general-content-info mb-5 mt-4'>
								<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "Person information", req: false}}/>
								<FormLableInp data={{req: true, lableT: "name", placeH: "Enter Person Name", sendData: dataToSend, setSendDataFunc: setDataToSend, 
									keyIs: "p_name"}}
								/>
								<div className='main-form-lbl-inp mb-3'>
									<label>bio</label>
									<textarea className='border-0' placeholder='Talk about this Person' value={dataToSend.bio} onInput={(e) => setDataToSend({
										...dataToSend, bio: e.currentTarget.value.trim()}
									)}>
									</textarea>
								</div>
								<div className='content-files mb-5'>
									<div className='main-form-lbl-inp mb-3'>
										<div className='d-flex align-items-center gap-3'>
											<label>person image</label>
										</div>
										{
											dataToSend.image === "" && pData.mainInfo?.image_url.replace("No Data", "") !== null
											?
												<img src={pData.mainInfo.image_url} alt={pData.mainInfo.p_name} className='w-25'/>
											: ''
										}
										<span className='color-dg'>{dataToSend.image !== "" ? dataToSend.image.name.length > 40 ? 
											dataToSend.image.name.slice(0, 40) + "..." : dataToSend.image.name : ''}
										</span>
										<div className='upload-file-container d-flex align-items-center gap-3 py-3 px-4 b-g-d2 rounded-2'>
											<SlCloudUpload size={34} className='color-g'/>
											<div className='color-g fw-semibold d-flex flex-column fs-sm'>
												<span>Upload Person Image</span>
												<span className='color-dg fst-italic fw-normal fs-vxs'>.jpg, jpeg, png, ro .web, max 400KB</span>
											</div>
											{
												dataToSend.image !== ""
												?
													<>
														<label className='d-none d-sm-inline-block' 
															onClick={(e) => {e.preventDefault(); setDataToSend({...dataToSend, image: ""})}}>Reset
														</label>
														<label className='d-flex align-items-center justify-content-center px-2 d-sm-none' 
															onClick={(e) => {e.preventDefault(); setDataToSend({...dataToSend, image: ""})}}><MdOutlineClear size={18}/>
														</label>
													</>
												:
													<>
														<label className='d-none d-sm-inline-block' htmlFor="image">Select File</label>
														<label className='d-flex align-items-center justify-content-center px-2 d-sm-none' htmlFor="image"><FaImage size={18}/></label>
													</>
											}
											<input type="file" id='image' hidden onChange={(e) => setDataToSend({...dataToSend, image: e.currentTarget.files[0]})}/>
										</div>
									</div>
								</div>
								<div className='d-flex align-items-center row'>
									<div className='col-12 col-sm-6 col-lg-3'>
										<FormLableInp data={{req: false, lableT: "nationality", placeH: "Person Contry", sendData: dataToSend, 
											setSendDataFunc: setDataToSend, keyIs: "nationality"}}
										/>
									</div>
									<div className='col-12 col-sm-6 col-lg-3'>
										<FormLableInp data={{req: false, lableT: "Birth Date", placeH: "", sendData: dataToSend, setSendDataFunc: setDataToSend, 
											keyIs: "birth_date", inpType: "date"}}
										/>
									</div>
									<div className='col-12 col-sm-6 col-lg-3'>
										<FormLableInp data={{req: false, lableT: "Height CM", placeH: "number must be integer", sendData: dataToSend, 
											setSendDataFunc: setDataToSend, keyIs: "height_cm", isnum: true}}
										/>
									</div>
									<div className='col-12 col-sm-6 col-lg-3'>
										<FormLableInp data={{req: false, lableT: "Children Count", placeH: "number must be integer", sendData: dataToSend, 
											setSendDataFunc: setDataToSend, keyIs: "children_count", isnum: true}}
										/>
									</div>
								</div>
							</div>

							{/* person genres */}
							<div className='b-g-d3 m-border p-3 p-md-4 rounded-4 general-content-info mb-5'>
								<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "Person Genres", req: true}}/>
								<div className='main-form-lbl-inp mb-3'>
									<div className='selected-genres d-flex flex-wrap align-items-center gap-2 gap-sm-3'>
										{
											dataToSend.genresList.map((genre) => {
												const gName = peopleGenres.filter((g) => g.genre_id === genre.toString())[0].name;
												return <span key={genre} className='main-d-gray-btn' data-genresid={genre} onClick={() => setDataToSend({
													...dataToSend,
													genresList: [...dataToSend.genresList.filter((gn) => gn != parseInt(genre))]
												})}>
													{gName}<IoIosClose size={22}/></span>
											})
										}
									</div>
									<div className='genres-d-d d-flex align-items-center justify-content-between dropdown-container c-p position-relative' tabIndex={0} 
										onClick={() => setOpen({...open, genres: !open.genres})}
									>
										<span className='fw-medium'>Genres</span> <MdKeyboardArrowDown size={18}/>
										<ul className={`dropdown-list position-absolute filter-drop ${open.genres ? 'show' : ''}`}>
											{
												peopleGenres.map((genre, index) => {
													return <li key={index}>
														<span className={`d-flex align-items-center w-100 h-100 justify-content-center 
															${ dataToSend.genresList.includes(parseInt(genre.genre_id)) ? "light-option": ''}`}
															onClick={(e)  => {e.stopPropagation();  dataToSend.genresList.includes(parseInt(genre.genre_id)) ? 
																setDataToSend({...dataToSend, genresList: [...dataToSend.genresList.filter((g) => g != parseInt(genre.genre_id))]})
															: setDataToSend({...dataToSend, genresList: [...dataToSend.genresList, parseInt(genre.genre_id)]})
															}}>+ {genre.name}</span> 
													</li>
												})
											}
										</ul>
									</div>
								</div>
							</div>
							
							
							{
								checkTwoObjIdentical(pData.mainInfo, dataToSend, ["image", "genresList"], [0, null, "No Data", "", "0"]) || dataToSend.image !="" 
								|| !checkTwoArrIdentical(pData.personGenres.map((g) => g.genre_id), dataToSend.genresList, true)
								?
									dataToSend.genresList.length > 0
									?
										<input type="submit" name='subminBtn' className='main-red-btn w-100 py-3' value={"SAVE"}/>
									:
										<span className='main-red-btn w-100 py-3 disabled'>SAVE</span>
								:
									<span className='main-red-btn w-100 py-3 disabled'>SAVE</span>
							}
						</form>
						<form onSubmit={(e) => handleAddAward(e)}>
							<div className='b-g-d3 m-border p-3 p-md-4 rounded-4 general-content-info my-5'>
								<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "Person Awards", req: false}}/>
								<ul className='ps-0 ps-md-3'>
									{
										pData.personAwards.length > 0
										?
											pData.personAwards.map((award, index) => {
												return <li key={index} className=' d-flex align-items-center gap-2 justify-content-between py-4'>
													<div className='d-flex align-items-center gap-3'>
														<BsAwardFill size={30} className='color-yd flex-shrink-0'/>
														<span className='fw-bold fs-mdl color-l'>{peopleAwards.filter((g) => g.genre_id === award.genre_id)[0].name}</span>
													</div>
													<div className='d-flex align-items-center gap-3'>
														<span className='fw-bold fs-md color-g'>{award.awarded_at}</span>
														<MdDelete size={28} className='color-r c-p'
															onClick={() => deleteContent({person_id: Number(personId), genre_id: Number(award.genre_id), awarded_at: award.awarded_at})}
														/>
													</div>
												</li>
											})
										:
											<li className='b-g-d2 p-3 rounded-1 color-l'><span className='color-l'>No Awards Exist</span></li>
									}
								</ul>
								<div className='main-form-lbl-inp'>
									<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "New Award", req: false}}/>
									<div className='d-flex align-items-center gap-3'>
										<label>Award Name</label><FaAsterisk size={12} className='color-r'/>
									</div>
									<div className='genres-d-d d-flex align-items-center justify-content-between dropdown-container c-p position-relative w-100 mb-3' 
										tabIndex={0} onClick={() => setOpen({...open, awards: !open.awards})}
									>
										<span className='fw-medium'>
											{newAwards.genre_id !== null ? peopleAwards.filter((g) => g.genre_id == newAwards.genre_id)[0].name : "Award"}
										</span> <MdKeyboardArrowDown size={18}/>
										<ul className={`dropdown-list position-absolute filter-drop ${open.awards ? 'show' : ''}`}>
											<li onClick={(e)  => {setNewAwards({...newAwards, genre_id: null})
												}}
												><span className='d-flex align-items-center w-100 h-100 justify-content-center'>Award</span>
											</li>
											{
												peopleAwards.map((genre, index) => {
													return <li key={index}>
														<span className="d-flex align-items-center w-100 h-100 justify-content-center"
															onClick={(e)  => {setNewAwards({...newAwards, genre_id: parseInt(genre.genre_id)})
														}}>+ {genre.name}</span> 
													</li>
												})
											}
										</ul>
									</div>
									<FormLableInp data={{req: true, lableT: "awarded at", placeH: "", sendData: newAwards, setSendDataFunc: setNewAwards, 
										keyIs: "awarded_at", inpType: "date"}}
									/>
								</div>
								{
									newAwards.genre_id !== null && newAwards.awarded_at.trim() !== ""
									?
										<input type="submit" name='subminBtn' className='main-red-btn w-100 py-3 mt-4' value={"ADD AWARD"}/>
									:
										<span className='main-red-btn w-100 py-3 disabled mt-4'>ADD AWARD</span>
								}
							</div>
						</form>
					</>
				:
					pData.mainInfo !== null || pData.personAwards !== null || pData.personGenres !== null
					?
						<div className='mt-4 b-g-d3 rounded-1 p-3 color-l'>Failed To Get Data</div>
					:''
			}
		</>
	)
}

export default EditPersonInfo