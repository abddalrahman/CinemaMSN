"use client"
import CoverL from '@/app/componentes/global/smallComp/CoverL'
import FormLableInp from '@/app/componentes/global/smallComp/FormLableInp'
import IconTextTitle from '@/app/componentes/global/smallComp/IconTextTitle'
import { CreateFormData, fetchAPIFunc } from '@/utils/clientRandomFunc'
import { DomainPath } from '@/utils/DomainPath'
import { addNewNewsValidation } from '@/utils/zodValidations'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaImage } from 'react-icons/fa6'
import { IoIosInformationCircle } from 'react-icons/io'
import { MdOutlineClear } from 'react-icons/md'
import { SlCloudUpload } from 'react-icons/sl'
import { toast } from 'react-toastify'

const AddNewsForm = () => {
	const router = useRouter()
	const [loading, setLoading] = useState(false);
	const [dataToSend, setDataToSend] = useState({
		title: "",
		body: "",
		image: "",
		is_about_movies: "",
		is_about_series: "",
		is_about_people: ""
	}); 

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			const btnIS = e.nativeEvent.submitter.name;
			if (btnIS === "subminBtn") {
				const validationObj = {
					...dataToSend,
					image: dataToSend.image === "" ? undefined : dataToSend.image,
					is_about_movies: dataToSend.is_about_movies === "t" ? true : false,
					is_about_series: dataToSend.is_about_series === "t" ? true : false,
					is_about_people: dataToSend.is_about_people === "t" ? true : false
				}
				setLoading(true);
				const validationContent = addNewNewsValidation.safeParse(validationObj);
				if (!validationContent.success) {
					setLoading(false);
					return toast.error(validationContent.error.issues[0].message);
				} else {
					const formData = CreateFormData(dataToSend);
					const respons = await fetchAPIFunc(`${DomainPath}/api/admin/news`, "POST", formData, null, true);
					const result = await respons.json();
					if (respons.status === 201) {
						setLoading(false);
						toast.success(result.message);
						router.replace('/dashboard/news');
					} else {
						setLoading(false);
						return toast.error(result.message);
					}
				}
			}
			
		} catch (error) {
			console.log(error);
			setLoading(false);
			return toast.error("Something Want Wrong");
		}
	}

	return (
		<>
			{
				loading ? <CoverL/> : ''
			}
			<form onSubmit={(e) => handleSubmit(e)}>
				<div className='b-g-d3 m-border p-4 rounded-4 general-content-info mb-5'>
					<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "All Info", req: true}}/>
					<FormLableInp data={{req: false, lableT: "Title", placeH: "News Title", sendData: dataToSend, setSendDataFunc: setDataToSend, 
						keyIs: "title"}}
					/>
					<div className='main-form-lbl-inp mb-3'>
						<label>body</label>
						<textarea className='border-0' placeholder='News Body' value={dataToSend.body} onInput={(e) => setDataToSend({
							...dataToSend, body: e.currentTarget.value}
						)}>
						</textarea>
					</div>

					<div className='main-form-lbl-inp mb-3'>
						<label>image</label>
						<span className='color-dg fs-sm'>{dataToSend.image !== "" ? dataToSend.image.name.length > 40 ? 
							dataToSend.image.name.slice(0, 40) + "..." : dataToSend.image.name : ''}
						</span>
						<div className='upload-file-container d-flex align-items-center gap-3 py-3 px-4 b-g-d2 rounded-2'>
							<SlCloudUpload size={34} className='color-g'/>
							<div className='color-g fw-semibold d-flex flex-column fs-sm'>
								<span>Upload News Image</span>
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
										<label htmlFor="image" className='d-none d-sm-inline-block'>Select File</label>
										<label htmlFor="image" className='d-flex align-items-center justify-content-center px-2 d-sm-none'><FaImage size={18}/></label>
									</>
							}
							<input type="file" id='image' hidden onChange={(e) => setDataToSend({...dataToSend, image: e.currentTarget.files[0]})}/>
						</div>
					</div>

					<div className='main-form-lbl-inp'>
						<label>contnt type</label>
						<div className='d-flex align-items-center gap-2 gap-md-3 color-l flex-wrap'>
							<span className={`fw-semibold check-box-btn flex-grow-1 px-2 ${dataToSend.is_about_movies === "t" ? "active" : ''}`} 
								onClick={() => setDataToSend({...dataToSend, is_about_movies: dataToSend.is_about_movies == "t" ? "" : "t"})}
							>About Movies</span>
							<span className={`fw-semibold check-box-btn flex-grow-1 px-2 ${dataToSend.is_about_series === "t" ? "active" : ''}`} 
								onClick={() => setDataToSend({...dataToSend, is_about_series: dataToSend.is_about_series == "t" ? "" : "t"})}
							>About Series</span>
							<span className={`fw-semibold check-box-btn flex-grow-1 px-2 ${dataToSend.is_about_people === "t" ? "active" : ''}`} 
								onClick={() => setDataToSend({...dataToSend, is_about_people: dataToSend.is_about_people == "t" ? "" : "t"})}
							>About People</span>
						</div>
					</div>
				</div>
				{
					dataToSend.title.trim() !== "" && dataToSend.body.trim() !== "" && dataToSend.image !== "" && 
					(dataToSend.is_about_movies.trim() !== "" || dataToSend.is_about_series.trim() !== "" || dataToSend.is_about_people.trim() !== "")
					?
						<input type="submit" name='subminBtn' className="main-red-btn w-100 py-3" value={"SAVE"}/>
					:
						<span className='main-red-btn w-100 py-3 disabled'>SAVE</span>
					}
			</form>
		</>
	)
}

export default AddNewsForm
