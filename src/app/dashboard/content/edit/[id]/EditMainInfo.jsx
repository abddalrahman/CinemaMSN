"use client"
import IconTextTitle from '@/app/componentes/global/smallComp/IconTextTitle'
import React, { useEffect, useState } from 'react'
import { IoIosInformationCircle } from "react-icons/io";
import { FaAsterisk, FaFileUpload } from "react-icons/fa";
import { BiSolidVideos } from "react-icons/bi";
import { SlCloudUpload } from "react-icons/sl";
import { MdKeyboardArrowDown, MdOutlineClear } from 'react-icons/md';
import FormLableInp from '@/app/componentes/global/smallComp/FormLableInp';
import { checkTwoObjIdentical, CreateFormData, fetchAPIFunc, FilterNotUpdatedProp, filterObjectInClient } from '@/utils/clientRandomFunc';
import { editContentValidation } from '@/utils/zodValidations';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import { FaImage } from "react-icons/fa6";
import { DomainPath } from '@/utils/DomainPath';

const EditMainInfo = ({contentId}) => {
	const [contentInfo, setContentInfo] = useState(undefined)

	const router = useRouter();
	const months = ["Month", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const [allYears, setAllYears] = useState([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState({
		month: false,
		year: false,
		cStatus: false
	});
	const [dataToSend, setDataToSend] = useState({
		title: contentInfo?.title || "",
		summary: contentInfo?.summary || "",
		release_month: contentInfo?.release_month || 0,
		release_year: contentInfo?.release_year || 0,
		duration_minutes: contentInfo?.duration_minutes || "",
		filming_location: contentInfo?.filming_location || "",
		budget: Number(contentInfo?.budget) || "",
		revenue: Number(contentInfo?.revenue) || "",
		country: contentInfo?.country || "",
		is_expected_popular: contentInfo?.is_expected_popular || false,
		release_date: contentInfo?.release_date ? new Date(contentInfo.release_date).toISOString().split("T")[0] : "" || "",
		language: contentInfo?.language || "",
		c_status: contentInfo?.c_status || "upcoming",
		season_number: contentInfo?.season_number || "",
		episodes_count: contentInfo?.episodes_count || "",
		content_type: contentInfo?.content_type || "M",
		poster: "",
		trailer: ""
	})

	const getData = async () => {
		try {
			setLoading(true);
			const contentMainInfoRespons = await fetchAPIFunc(`${DomainPath}/api/globals/getMainContentData?id=${contentId}`, "GET", {});
			const contentMainInfoResult = await contentMainInfoRespons.json();
			if (contentMainInfoRespons.status === 200) {
				setContentInfo({
					...contentMainInfoResult.data,
					release_date: contentMainInfoResult.data?.release_date ? new Date(contentMainInfoResult.data.release_date).toISOString().split("T")[0] : ''
				})
				const cData = contentMainInfoResult.data || null
				setDataToSend({
					title: cData?.title || "",
					summary: cData?.summary || "",
					release_month: cData?.release_month || 0,
					release_year: cData?.release_year || 0,
					duration_minutes: cData?.duration_minutes || "",
					filming_location: cData?.filming_location || "",
					budget: Number(cData?.budget) || "",
					revenue: Number(cData?.revenue) || "",
					country: cData?.country || "",
					is_expected_popular: cData?.is_expected_popular || false,
					release_date: cData?.release_date ? new Date(cData.release_date).toISOString().split("T")[0] : "" || "",
					language: cData?.language || "",
					c_status: cData?.c_status || "upcoming",
					season_number: cData?.season_number || "",
					episodes_count: cData?.episodes_count || "",
					content_type: cData?.content_type || "M",
					poster: "",
					trailer: ""
				})
			} else {
				setContentInfo(null)
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
			setContentInfo(null)
		}
	}
	
	useEffect(() => {
		const years = []
		for (let i = 1890; i < new Date().getFullYear(); i++ ) {
			years.unshift(i);
		}
		years.unshift("Year");
		const run = async () => {
			setAllYears(years);
			await getData();
		}
		run();
	}, [])
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const btnIS = e.nativeEvent.submitter.name;
			if (btnIS === "subminBtn") {
				setLoading(true)
				const filteredObj = filterObjectInClient(dataToSend, ["", 0, "No Data"]);
				const validationContent = editContentValidation.safeParse(filteredObj);
				if (!validationContent.success) {
					setLoading(false)
					return toast.error(validationContent.error.issues[0].message);
				} else {
					const finalFilteredObj = FilterNotUpdatedProp(contentInfo, filteredObj, ["poster", "trailer"]);
					dataToSend.poster !== '' ? finalFilteredObj.poster = dataToSend.poster : ''
					dataToSend.trailer !== '' ? finalFilteredObj.trailer = dataToSend.trailer : '';
					if (Object.keys(finalFilteredObj).length === 0) {
						setLoading(false)
						return toast.error("No accebtable change");
					}
					finalFilteredObj.id = contentId
					const formData = CreateFormData(finalFilteredObj);
					const respons = await fetchAPIFunc(`${DomainPath}/api/admin/content`, "PUT", formData, null, true);
					const result = await respons.json();
					if (respons.status === 200) {
						setLoading(false)
						toast.success(result.message);
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
		}
	}

	return (
		<>
			{
				loading || contentInfo === undefined ? <CoverL/> : ''
			}
			{
				contentInfo !== null && contentInfo !== undefined
				?
					<form onSubmit={(e) => handleSubmit(e)} className='mt-3'>
						<div className='b-g-d3 m-border p-3 p-md-4 rounded-4 general-content-info mb-5'>
							<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "general information", req: true}}/>
							<FormLableInp data={{req: false, lableT: "content title", placeH: "Enter content title", sendData: dataToSend, setSendDataFunc: setDataToSend, 
								keyIs: "title"}}
							/>
							<FormLableInp data={{req: false, lableT: "brief description", placeH: "Enter a brief overview of the movie or series", sendData: dataToSend, 
								setSendDataFunc: setDataToSend, keyIs: "summary"}}
							/>
						</div>
						{/* content files */}
						<div className='content-files b-g-d3 m-border p-3 p-md-4 rounded-4 mb-5'>
							<IconTextTitle data= {{iconTag: FaFileUpload, text: "Uploade Files", req: false}}/>
							<div className='d-flex align-items-center gap-4 upload-files-container flex-wrap'>
								<div className='main-form-lbl-inp mb-3'>
									<div className='d-flex align-items-center gap-3'>
										<label>poster image</label> <FaAsterisk size={12} className='color-r'/>
									</div>
									{
										dataToSend.poster === ""
										?
											<img src={contentInfo.poster_url} alt="content poster" />
										: ''
									}
									<span className='color-dg fs-sm'>{dataToSend.poster !== "" ? dataToSend.poster.name.length > 40 ? 
										dataToSend.poster.name.slice(0, 40) + "..." : dataToSend.poster.name : ''}
									</span>
									<div className='upload-file-container d-flex align-items-center gap-3 p-3 px-sm-4 b-g-d2 rounded-2'>
										<SlCloudUpload size={30} className='color-g'/>
										<div className='color-g fw-semibold d-flex flex-column fs-sm'>
											<span>Upload Poster Image</span>
											<span className='color-dg fst-italic fw-normal fs-vxs'>.jpg, jpeg, png, ro .web, max 400KB</span>
										</div>
										{
											dataToSend.poster !== ""
											?
												<>
													<label className='d-none d-sm-inline-block' 
														onClick={(e) => {e.preventDefault(); setDataToSend({...dataToSend, poster: ""})}}>Reset
													</label>
													<label className='d-flex align-items-center justify-content-center px-2 d-sm-none' 
														onClick={(e) => {e.preventDefault(); setDataToSend({...dataToSend, poster: ""})}}><MdOutlineClear size={18}/>
													</label>
												</>
											:
												<>
													<label htmlFor="poster" className='d-none d-sm-inline-block'>Select File</label>
													<label htmlFor="poster" className='d-flex d-sm-none align-items-center justify-content-center px-2'><FaImage size={18}/></label>
												</>
										}
										<input type="file" id='poster' hidden onChange={(e) => setDataToSend({...dataToSend, poster: e.currentTarget.files[0]})}/>
									</div>
								</div>
								<div className='main-form-lbl-inp mb-3'>
									<div className='d-flex align-items-center gap-3'>
										<label>poster Trailer</label>
									</div>
									{
										contentInfo.trailer_url && contentInfo.trailer_url.trim().replace('No Data', '') !== '' && dataToSend.trailer === ''
										? 
											<video src={contentInfo.trailer_url} controls/>
										: ''
									}
									<span className='color-dg fs-sm'>{dataToSend.trailer !== "" ? dataToSend.trailer.name.length > 40 ? 
										dataToSend.trailer.name.slice(0, 40) + "..." : dataToSend.trailer.name : ''}
									</span>
									<div className='upload-file-container d-flex align-items-center gap-3 p-3 px-sm-4 b-g-d2 rounded-2'>
										<BiSolidVideos size={30} className='color-g'/>
										<div className='color-g fw-semibold d-flex flex-column fs-sm'>
											<span>Upload Trailer Video</span>
											<span className='color-dg fst-italic fw-normal fs-vxs'>.mp4, max 4MB</span>
										</div>
										{
											dataToSend.trailer !== ""
											?
												<>
													<label className='d-none d-sm-inline-block'
														onClick={(e) => {e.preventDefault(); setDataToSend({...dataToSend, trailer: ""})}}>Reset
													</label>
													<label className='d-flex align-items-center justify-content-center px-2 d-sm-none' 
														onClick={(e) => {e.preventDefault(); setDataToSend({...dataToSend, trailer: ""})}}><MdOutlineClear size={18}/>
													</label>
												</>
											:
												<>
													<label htmlFor="trailer" className='d-none d-sm-inline-block'>Select File</label>
													<label htmlFor="trailer" className='d-flex align-self-center justify-content-center px-2 d-sm-none'><FaImage size={18}/></label>
												</>

										}
										<input type="file" id='trailer' hidden onChange={(e) => setDataToSend({...dataToSend, trailer: e.currentTarget.files[0]})}/>
									</div>
								</div>
							</div>
						</div>
						{/*conten details  */}
						<div className='content-details b-g-d3 m-border p-3 p-md-4 rounded-4 mb-5'>
							<IconTextTitle data= {{iconTag: SlCloudUpload, text: "Content Details", req: false}}/>
							<div className='d-flex align-items-center row'>
								<div className='col-12 col-sm-6 col-lg-3'>
									<FormLableInp data={{req: true, lableT: "Release Date", placeH: "", sendData: dataToSend, setSendDataFunc: setDataToSend, 
										keyIs: "release_date", inpType: "date"}}
									/>
								</div>
								<div className='col-12 col-sm-6 col-lg-3'>
									<FormLableInp data={{req: true, lableT: "Duration (min)", placeH: "number must be integer", sendData: dataToSend, 
										setSendDataFunc: setDataToSend, keyIs: "duration_minutes", isnum: true}}
									/>
								</div>
								<div className="col-12 col-sm-6 col-lg-3">
									<div className='main-form-lbl-inp mb-3'>
										<div className=' d-flex align-items-center gap-3'>
											<label>Production Month</label> <FaAsterisk size={12} className='color-r'/>
										</div>
										<div className='d-flex align-items-center justify-content-between dropdown-container c-p position-relative' tabIndex={0} 
											onClick={() => setOpen({...open, month: !open.month})}
										>
											<span className='fw-medium'>{months[dataToSend.release_month] || "Month"}</span> <MdKeyboardArrowDown size={18}/>
											<ul className={`dropdown-list position-absolute filter-drop ${open.month ? 'show' : ''}`}>
												{
													months.map((month, index) => {
														return <li key={index}>
															<button className='d-flex align-items-center w-100 h-100 justify-content-center' 
																onClick={() => setDataToSend({...dataToSend, release_month: index})}>{month}
															</button> 
														</li>
													})
												}
											</ul>
										</div>
									</div>
								</div>
								<div className="col-12 col-sm-6 col-lg-3">
									<div className='main-form-lbl-inp mb-3'>
										<div className=' d-flex align-items-center gap-3'>
											<label>Production Year</label> <FaAsterisk size={12} className='color-r'/>
										</div>
										<div className='d-flex align-items-center justify-content-between dropdown-container c-p position-relative' tabIndex={0} 
											onClick={() => setOpen({...open, year: !open.year})}
										>
											<span className='fw-medium'>{dataToSend.release_year !== 0 ? dataToSend.release_year : "Year"}</span> <MdKeyboardArrowDown size={18}/>
											<ul className={`dropdown-list position-absolute filter-drop ${open.year ? 'show' : ''}`}>
												{
													allYears.map((year) => {
														return <li key={year}>
															<button className='d-flex align-items-center w-100 h-100 justify-content-center'
																onClick={() => setDataToSend({...dataToSend, release_year: year === "Year" ? 0 : year})} >{year}</button> 
														</li>
													})
												}
											</ul>
										</div>
									</div>
								</div>
							</div>

							<div className='d-flex align-items-center row'>
								<div className='col-12 col-md-6'>
									<FormLableInp data={{req: false, lableT: "budget (USD)", placeH: "$ Enter integer number", sendData: dataToSend, 
										setSendDataFunc: setDataToSend, keyIs: "budget", isnum: true}}
									/>
								</div>
								<div className='col-12 col-md-6'>
									<FormLableInp data={{req: false, lableT: "revenue (USD)", placeH: "$ Enter integer number", sendData: dataToSend, 
										setSendDataFunc: setDataToSend, keyIs: "revenue", isnum: true}}
									/>
								</div>
							</div>

							<div className='d-flex align-items-center row'>
								<div className='col-12 col-sm-6 col-lg-3'>
									<FormLableInp data={{req: false, lableT: "filming location", placeH: "Countries where filming took place", sendData: dataToSend, 
										setSendDataFunc: setDataToSend, keyIs: "filming_location"}}
									/>
								</div>
								<div className='col-12 col-sm-6 col-lg-3'>
									<FormLableInp data={{req: true, lableT: "season number", placeH: "integer number [1-30]", sendData: dataToSend, 
										setSendDataFunc: setDataToSend, keyIs: "season_number", isnum: true}}
									/>
								</div>
								<div className='col-12 col-sm-6 col-lg-3'>
									<FormLableInp data={{req: true, lableT: "language", placeH: "content language", sendData: dataToSend, 
										setSendDataFunc: setDataToSend, keyIs: "language"}}
									/>
								</div>
								<div className='col-12 col-sm-6 col-lg-3'>
									<FormLableInp data={{req: true, lableT: "origin country", placeH: "origin country", sendData: dataToSend, 
										setSendDataFunc: setDataToSend, keyIs: "country"}}
									/>
								</div>
							</div>
							{
								dataToSend.content_type === "S"
								?
									<FormLableInp data={{req: true, lableT: "episodes count", placeH: "Series episodes count", sendData: dataToSend, 
										setSendDataFunc: setDataToSend, keyIs: "episodes_count", isnum: true}}
									/>
								: ''
							}
						</div>

						{/* Final settings*/}
						<div className='b-g-d3 m-border p-3 p-md-4 rounded-4 general-content-info mb-5'>
							<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "Final settings", req: false}}/>
							<div className='d-flex align-items-center row'>
								<div className="col-12 col-sm-6">
									<div className='main-form-lbl-inp mb-3'>
										<div className='d-flex align-items-center gap-3'>
											<label>Release status</label> <FaAsterisk size={12} className='color-r'/>
										</div>
										<div className='d-flex align-items-center justify-content-between dropdown-container c-p position-relative' tabIndex={0} 
											onClick={() => setOpen({...open, cStatus: !open.cStatus})}
										>
											<span className='fw-medium'>{dataToSend.c_status}</span> <MdKeyboardArrowDown size={18}/>
											<ul className={`dropdown-list position-absolute filter-drop ${open.cStatus ? 'show' : ''}`}>
												<li>
													<span className='d-flex align-items-center w-100 h-100 justify-content-center'
														onClick={() => setDataToSend({...dataToSend, c_status: "upcoming"})}
													>upcoming</span> 
												</li>
												<li>
													<span className='d-flex align-items-center w-100 h-100 justify-content-center'
														onClick={() => setDataToSend({...dataToSend, c_status: "available"})}
													>available</span> 
												</li>
												<li>
													<span className='d-flex align-items-center w-100 h-100 justify-content-center'
														onClick={() => setDataToSend({...dataToSend, c_status: "hidden"})}
													>hidden</span> 
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div className="col-12 col-sm-6">
									<div className='main-form-lbl-inp mb-3'>
										<label>expected to be popular.</label>
										<div className='d-flex align-items-center gap-3 color-l'>
											<span className={`fw-semibold check-box-btn w-50 ${dataToSend.is_expected_popular ? "active" : ""}`}
												onClick={() => setDataToSend({...dataToSend, is_expected_popular: true})}
												>Yes</span>
											<span className={`fw-semibold check-box-btn w-50 ${dataToSend.is_expected_popular ? "" : "active"}`}
												onClick={() => setDataToSend({...dataToSend, is_expected_popular: false})}
											>No</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						{
							checkTwoObjIdentical(contentInfo, dataToSend, ["poster", "trailer"], [0, "", "0"]) || dataToSend.poster !="" || dataToSend.trailer !=""
							?
								<input type="submit" name='subminBtn' className='main-red-btn w-100 py-3' value={"SAVE"}/>
							:
								<span className='main-red-btn w-100 py-3 disabled'>SAVE</span>
						}
					</form>
				:
					contentInfo === null
					?
						<div className='b-g-d3 rounded-1 p-3 color-l mt-4'>
							Failed to Get Data
						</div>
					:''
			}
		</>
	)
}

export default EditMainInfo