"use client"
import IconTextTitle from '@/app/componentes/global/smallComp/IconTextTitle'
import React, { useEffect, useState } from 'react'
import { IoIosInformationCircle } from "react-icons/io";
import { FaAsterisk, FaFileUpload } from "react-icons/fa";
import { IoTv } from "react-icons/io5";
import { BiSolidMoviePlay, BiSolidVideos } from "react-icons/bi";
import { SlCloudUpload } from "react-icons/sl";
import { MdKeyboardArrowDown, MdOutlineClear } from 'react-icons/md';
import FormLableInp from '@/app/componentes/global/smallComp/FormLableInp';
import { IoIosClose } from "react-icons/io";
import { CreateFormData, fetchAPIFunc, filterObjectInClient } from '@/utils/clientRandomFunc';
import { addContentValidation } from '@/utils/zodValidations';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FaRegImage } from "react-icons/fa6";
import { DomainPath } from '@/utils/DomainPath';
import CoverL from '@/app/componentes/global/smallComp/CoverL';

const AddContentForm = ({contentGenres}) => {
	const router = useRouter();
	const months = ["Month", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const [allYears, setAllYears] = useState([]);
	const [open, setOpen] = useState({
		month: false,
		year: false,
		genres: false,
		cStatus: false
	});
	const [dataToSend, setDataToSend] = useState({
		title: "",
		summary: "",
		release_month: 0,
		release_year: 0,
		duration_minutes: "",
		filming_location: "",
		budget: "",
		revenue: "",
		country: "",
		is_expected_popular: false,
		release_date: "",
		language: "",
		c_status: "upcoming",
		season_number: "",
		episodes_count: "",
		content_type: "M",
		poster: "",
		trailer: "",
		genresList: []
	})
	const [loading, setLoading] = useState(false)
	
	useEffect(() => {
		const run = () => {
			const years = []
			for (let i = 1890; i <= new Date().getFullYear(); i++ ) {
				years.unshift(i);
			}
			years.unshift("Year");
			setAllYears(years);
		}
		run();
	}, [])

	const handleSubmit = async (e) => {
		e.preventDefault();
		const btnIS = e.nativeEvent.submitter.name;
		if (btnIS === "subminBtn") {
			setLoading(true)
			const filteredObj = filterObjectInClient(dataToSend, ["", 0]);
			const validationContent = addContentValidation.safeParse(filteredObj);
			if (!validationContent.success) {
				setLoading(false)
				return toast.error(validationContent.error.issues[0].message);
			} else {
				try {
					const formData = CreateFormData(filteredObj);
					const respons = await fetchAPIFunc(`${DomainPath}/api/admin/content`, "POST", formData, null, true);
					const result = await respons.json();
					if (respons.status === 201) {
						toast.success(result.message);
						setLoading(false)
						router.replace('/dashboard/content');
					} else {
						setLoading(false)
						return toast.error(result.message);
					}
				} catch (error) {
					console.log(error)
					setLoading(false)
					return toast.error("something went wrong");
				}
			}
		}
	}

	return (
		<>
			{loading ? <CoverL/> : ""}
			<form onSubmit={(e) => handleSubmit(e)}>
				<div className='b-g-d3 m-border p-3 p-md-4 rounded-4 general-content-info mb-5'>
					<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "general information", req: true}}/>
					<FormLableInp data={{req: false, lableT: "content title", placeH: "Enter content title", sendData: dataToSend, setSendDataFunc: setDataToSend, 
						keyIs: "title"}}
					/>
					<FormLableInp data={{req: false, lableT: "brief description", placeH: "Enter a brief overview of the movie or series", sendData: dataToSend, 
						setSendDataFunc: setDataToSend, keyIs: "summary"}}
					/>
					<div className='main-form-lbl-inp'>
						<label>contnt type</label>
						<div className='d-flex align-items-center gap-3 color-l'>
							<span className={`fw-semibold check-box-btn w-50 ${dataToSend.content_type === "M" ? "active" : ''}`} 
								onClick={() => setDataToSend({...dataToSend, content_type: 'M'})}
							>
								<BiSolidMoviePlay className='me-2'/> Movie
							</span>
							<span className={`fw-semibold check-box-btn w-50 ${dataToSend.content_type === "S" ? "active" : ''}`} 
								onClick={() => setDataToSend({...dataToSend, content_type: 'S'})}
							>
								<IoTv className='me-2'/> TV Series
							</span>
						</div>
					</div>
				</div>
				{/* content files */}
				<div className='content-files b-g-d3 m-border p-3 p-md-4 rounded-4 mb-5'>
					<IconTextTitle data= {{iconTag: FaFileUpload, text: "Uploade Files", req: false}}/>
					<div className='d-flex align-items-center upload-files-container row'>
						<div className='main-form-lbl-inp mb-3 col-12 col-md-6'>
							<div className='d-flex align-items-center gap-3'>
								<label>poster image</label> <FaAsterisk size={12} className='color-r'/>
							</div>
							<span className='color-dg fs-sm'>{dataToSend.poster !== "" ? dataToSend.poster.name.length > 40 ? 
								dataToSend.poster.name.slice(0, 40) + "..." : dataToSend.poster.name : ''}
							</span>
							<div className='upload-file-container d-flex align-items-center gap-3 p-3 b-g-d2 rounded-2'>
								<SlCloudUpload size={30} className='color-g'/>
								<div className='color-g fw-semibold d-flex flex-column fs-sm'>
									<span>Upload Poster Image</span>
									<span className='color-dg fst-italic fw-normal fs-vxs'>.jpg, jpeg, png, ro .web, max 400KB</span>
								</div>
								{
									dataToSend.poster !== ""
									?
										<>
											<label className='d-none d-lg-inline-block' 
												onClick={(e) => {e.preventDefault(); setDataToSend({...dataToSend, poster: ""})}}>Reset
											</label>
											<label className='d-flex align-items-center justify-content-center d-lg-none px-2' 
												onClick={(e) => {e.preventDefault(); setDataToSend({...dataToSend, poster: ""})}}><MdOutlineClear size={18}/>
											</label>
										</>
									:
										<>
											<label htmlFor="poster" className='d-none d-lg-inline-block'>Select File</label>
											<label htmlFor="poster" className='d-flex align-items-center justify-content-center d-lg-none px-2'><FaRegImage/></label>
										</>
								}
								<input type="file" id='poster' hidden onChange={(e) => setDataToSend({...dataToSend, poster: e.currentTarget.files[0]})}/>
							</div>
						</div>
						<div className='main-form-lbl-inp mb-3 col-12 col-md-6'>
							<div className='d-flex align-items-center gap-3'>
								<label>poster Trailer</label>
							</div>
							<span className='color-dg fs-sm'>{dataToSend.trailer !== "" ? dataToSend.trailer.name.length > 40 ? 
								dataToSend.trailer.name.slice(0, 40) + "..." : dataToSend.trailer.name : ''}
							</span>
							<div className='upload-file-container d-flex align-items-center gap-3 p-3 b-g-d2 rounded-2'>
								<BiSolidVideos size={30} className='color-g'/>
								<div className='color-g fw-semibold d-flex flex-column fs-sm'>
									<span>Upload Trailer Video</span>
									<span className='color-dg fst-italic fw-normal fs-vxs'>.mp4, max 4MB</span>
								</div>
								{
									dataToSend.trailer !== ""
									?
										<>
											<label className='d-none d-lg-inline-block' 
												onClick={(e) => {e.preventDefault(); setDataToSend({...dataToSend, trailer: ""})}}>Reset
											</label>
											<label className='d-flex align-items-center justify-content-center d-lg-none px-2' 
												onClick={(e) => {e.preventDefault(); setDataToSend({...dataToSend, trailer: ""})}}><MdOutlineClear size={18}/>
											</label>
										</>
									:
										<>
											<label htmlFor="trailer" className='d-none d-lg-inline-block'>Select File</label>
											<label htmlFor="trailer" className='d-flex align-items-center justify-content-center d-lg-none px-2'><FaRegImage/></label>
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
						<div className='col-12 col-sm-6 col-md-4 col-lg-3'>
							<FormLableInp data={{req: true, lableT: "Release Date", placeH: "", sendData: dataToSend, setSendDataFunc: setDataToSend, 
								keyIs: "release_date", inpType: "date"}}
							/>
						</div>
						<div className='col-12 col-sm-6 col-md-4 col-lg-3'>
							<FormLableInp data={{req: true, lableT: "Duration (min)", placeH: "number must be integer", sendData: dataToSend, 
								setSendDataFunc: setDataToSend, keyIs: "duration_minutes", isnum: true}}
							/>
						</div>
						<div className="col-12 col-sm-6 col-md-4 col-lg-3">
							<div className='main-form-lbl-inp mb-3'>
								<div className=' d-flex align-items-center gap-3 fs-main'>
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
						<div className="col-12 col-sm-6 col-md-4 col-lg-3">
							<div className='main-form-lbl-inp mb-3'>
								<div className='d-flex align-items-center gap-3 fs-main'>
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
						<div className='col-12 col-sm-6 col-md-4 col-lg-3'>
							<FormLableInp data={{req: false, lableT: "filming location", placeH: "Countries where filming took place", sendData: dataToSend, 
								setSendDataFunc: setDataToSend, keyIs: "filming_location"}}
							/>
						</div>
						<div className='col-12 col-sm-6 col-md-4 col-lg-3'>
							<FormLableInp data={{req: true, lableT: "season number", placeH: "integer number [1-30]", sendData: dataToSend, 
								setSendDataFunc: setDataToSend, keyIs: "season_number", isnum: true}}
							/>
						</div>
						<div className='col-12 col-sm-6 col-md-4 col-lg-3'>
							<FormLableInp data={{req: true, lableT: "language", placeH: "content language", sendData: dataToSend, 
								setSendDataFunc: setDataToSend, keyIs: "language"}}
							/>
						</div>
						<div className='col-12 col-sm-6 col-md-4 col-lg-3'>
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
				{/* content genres */}
				<div className='b-g-d3 m-border p-3 p-md-4 rounded-4 general-content-info mb-5'>
					<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "Content Genres", req: true}}/>
					<div className='main-form-lbl-inp mb-3'>
						<div className='selected-genres d-flex align-items-center gap-3'>
							{
								dataToSend.genresList.map((genre) => {
									const gName = contentGenres.filter((g) => g.genre_id === genre.toString())[0].name;
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
									contentGenres !== null
									?
										contentGenres.map((genre, index) => {
											return <li key={index}>
												<span className={`d-flex align-items-center w-100 h-100 justify-content-center 
													${ dataToSend.genresList.includes(parseInt(genre.genre_id)) ? "light-option": ''}`}
													onClick={(e)  => {e.stopPropagation();  dataToSend.genresList.includes(parseInt(genre.genre_id)) ? 
														setDataToSend({...dataToSend, genresList: [...dataToSend.genresList.filter((g) => g != parseInt(genre.genre_id))]})
													: setDataToSend({...dataToSend, genresList: [...dataToSend.genresList, parseInt(genre.genre_id)]})
													}}>+ {genre.name}</span> 
											</li>
										})
									:
										<li>Failed ro Get Genres</li>
								}
							</ul>
						</div>
					</div>
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
					dataToSend.title.trim() !== "" && dataToSend.summary.trim() !== "" && dataToSend.country.trim() !== "" && dataToSend.language.trim() !== "" 
					&& dataToSend.poster !== "" && dataToSend.content_type.trim() !== "" && dataToSend.release_date !== "" && dataToSend.release_month 
					&& dataToSend.release_year && dataToSend.c_status !== "" && dataToSend.duration_minutes !== "" && dataToSend.season_number !== ""
					&& dataToSend.genresList.length > 0 && (dataToSend.content_type === "S" && dataToSend.episodes_count !== "" || dataToSend.content_type === "M")
					?
						<input type="submit" name='subminBtn' className='main-red-btn w-100 py-3' value={"SAVE"}/>
					:
						<input type="submit" className='main-red-btn disabled w-100 py-3' value={"SAVE"}/>
				}
			</form>
		</>
	)
}

export default AddContentForm
