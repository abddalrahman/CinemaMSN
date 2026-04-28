"use client"
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import FormLableInp from '@/app/componentes/global/smallComp/FormLableInp';
import IconTextTitle from '@/app/componentes/global/smallComp/IconTextTitle';
import { CreateFormData, fetchAPIFunc, filterObjectInClient } from '@/utils/clientRandomFunc';
import { addPeopleValidation } from '@/utils/zodValidations';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { IoIosClose, IoIosInformationCircle } from 'react-icons/io';
import { MdKeyboardArrowDown, MdOutlineClear } from 'react-icons/md';
import { SlCloudUpload } from 'react-icons/sl';
import { toast } from 'react-toastify';
import { FaAsterisk, FaImage } from "react-icons/fa6";
import { DomainPath } from '@/utils/DomainPath';


const AddPeopleForm = ({ peopleGenres }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [dataToSend, setDataToSend] = useState({
		p_name: "",
		bio: "",
		image: "",
		birth_date: "",
		height_cm: "",
		children_count: "",
		nationality: "",
		genresList: []
	})

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			const btnIS = e.nativeEvent.submitter.name;
			if (btnIS === "subminBtn") {
				setLoading(true);
				const filteredObj = filterObjectInClient(dataToSend, [""]);
				const validation = addPeopleValidation.safeParse(filteredObj);
				if (!validation.success) {
					setLoading(false);
					return toast.error(validation.error.issues[0].message);
				} else {
					const formData = CreateFormData(filteredObj);
					const respons = await fetchAPIFunc(`${DomainPath}/api/admin/people`, "POST", formData, null, true);
					const result = await respons.json();
					if (respons.status === 201) {
						setLoading(false);
						toast.success(result.message);
						router.replace('/dashboard/people');
					} else {
						setLoading(false);
						return toast.error(result.message);
					}
				}
			}
			
		} catch (error) {
			setLoading(false);
			console.log(error);
			return toast.error('Something Went Wrong Tyry Again');
		}
	}

	return (
		<>
			{
				loading ? <CoverL/> : ""
			}
			{
				peopleGenres !== null
				?
					<form onSubmit={(e) => handleSubmit(e)}>
						<div className='b-g-d3 m-border p-4 rounded-4 general-content-info mb-5'>
							<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "Person information", req: false}}/>
							<FormLableInp data={{req: true, lableT: "name", placeH: "Enter Person Name", sendData: dataToSend, setSendDataFunc: setDataToSend, 
								keyIs: "p_name"}}
							/>
							<div className='main-form-lbl-inp mb-3'>
								<label>bio</label>
								<textarea className='border-0' placeholder='Talk about this Person' value={dataToSend.description} onInput={(e) => setDataToSend({
									...dataToSend, bio: e.currentTarget.value.trim()}
								)}>
								</textarea>
							</div>
							<div className='content-files mb-5'>
								<div className='main-form-lbl-inp mb-3'>
									<div className='d-flex align-items-center gap-3'>
										<label>person image</label>
										<FaAsterisk size={12} className='color-r'/>
									</div>
									<span className='color-dg fs-sm'>{dataToSend.image !== "" ? dataToSend.image.name.length > 40 ? 
										dataToSend.image.name.slice(0, 40) + "..." : dataToSend.image.name : ''}
									</span>
									<div className='upload-file-container d-flex align-items-center gap-3 py-3 px-4 b-g-d2 rounded-2'>
										<SlCloudUpload size={30} className='color-g'/>
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
													<label htmlFor="image" className='d-flex align-items-center justify-content-center px-2 d-sm-none'><FaImage size={18}/></label>
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
									<FormLableInp data={{req: true, lableT: "Birth Date", placeH: "", sendData: dataToSend, setSendDataFunc: setDataToSend, 
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

						{/* content genres */}
						<div className='b-g-d3 m-border p-4 rounded-4 general-content-info mb-5'>
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
									onClick={() => setOpen(!open)}
								>
									<span className='fw-medium'>Genres</span> <MdKeyboardArrowDown size={18}/>
									<ul className={`dropdown-list position-absolute filter-drop ${open ? 'show' : ''}`}>
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
							dataToSend.p_name.trim() !== "" && dataToSend.image !== "" && dataToSend.birth_date.trim() !== "" && dataToSend.genresList.length > 0
							?
								<input type="submit" name='subminBtn' className='main-red-btn w-100 py-3' value={"SAVE"}/>
							:
								<span className='main-red-btn w-100 py-3 disabled'>SAVE</span>
						}
					</form>
				:
					<div className='p-3 b-g-d3 color-3 rounded-1'>
						Faild to Get Some Important Data
					</div>
			}
		</>
	)
}

export default AddPeopleForm
