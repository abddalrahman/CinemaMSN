"use client"
import CoverL from '@/app/componentes/global/smallComp/CoverL'
import FormLableInp from '@/app/componentes/global/smallComp/FormLableInp'
import IconTextTitle from '@/app/componentes/global/smallComp/IconTextTitle'
import { checkTwoObjIdentical, CreateFormData, fetchAPIFunc, FilterNotUpdatedProp, filterObjectInClient } from '@/utils/clientRandomFunc'
import { editNewsValidation } from '@/utils/zodValidations'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaAsterisk, FaImage } from 'react-icons/fa6'
import { IoIosInformationCircle } from 'react-icons/io'
import { SlCloudUpload } from 'react-icons/sl'
import { MdOutlineClear } from 'react-icons/md'
import { toast } from 'react-toastify'
import { DomainPath } from '@/utils/DomainPath'

const EditNewsForm = ({ oldData }) => {
	const router = useRouter()
	const [loading, setLoading] = useState(false);
	const [dataToSend, setDataToSend] = useState({
		title: oldData?.title || "",
		body: oldData?.body || "",
		image: "",
		is_about_movies: oldData?.is_about_movies || "",
		is_about_series: oldData?.is_about_series || "",
		is_about_people: oldData?.is_about_people || ""
	}); 

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			const btnIS = e.nativeEvent.submitter.name;
			if (btnIS === "subminBtn") {
				setLoading(true);
				const filteringObj = filterObjectInClient(dataToSend, [""]);
				const objWithUpdatedVal = FilterNotUpdatedProp(oldData,filteringObj,["image"]);
				const validationNews = editNewsValidation.safeParse(objWithUpdatedVal);
				if (!validationNews.success) {
					setLoading(false);
					return toast.error(validationNews.error.issues[0].message);
				} else {
					dataToSend.image !== '' ? objWithUpdatedVal.image = dataToSend.image : '';
					if (Object.keys(objWithUpdatedVal).length == 0) {
						return toast.warning("no acceptable change to update");
					}
					objWithUpdatedVal.id = oldData.news_id;
					const formData = CreateFormData(objWithUpdatedVal);
					const respons = await fetchAPIFunc(`${DomainPath}/api/admin/news`, "PUT", formData, null, true);
					const result = await respons.json();
					if (respons.status === 200) {
						setLoading(false);
						toast.success(result.message);
						router.replace("/dashboard/news");
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

	if (oldData === null) {
		return (
			<div className='color-l w-100 p-4 b-g-d3 mt-4'>
				Faild to Get News Info
			</div>
		)
	}
	return (
		<>
			{
				loading ? <CoverL/> : ''
			}
			<form onSubmit={(e) => handleSubmit(e)} className='mt-4'>
				<div className='b-g-d3 m-border p-3 p-md-4 rounded-4 general-content-info mb-5'>
					<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "All Info", req: false}}/>
					<FormLableInp data={{req: true, lableT: "Title", placeH: "News Title", sendData: dataToSend, setSendDataFunc: setDataToSend, 
						keyIs: "title"}}
					/>
					<div className='main-form-lbl-inp mb-3'>
						<div className='d-flex align-items-center gap-3'>
							<label>body</label> <FaAsterisk size={12} className='color-r'/>
						</div>
						<textarea className='border-0' placeholder='News Body' value={dataToSend.body} onInput={(e) => setDataToSend({
							...dataToSend, body: e.currentTarget.value}
						)}>
						</textarea>
					</div>

					<div className='main-form-lbl-inp mb-3'>
						<label>image</label>
						{
							dataToSend.image === ""
							?
								oldData.image_url && oldData.image_url.replace("No Data","") !== "" 
								? <img src={oldData.image_url} alt={dataToSend.title} className='old-news-image' /> 
								: <span className='color-l p-4 b-g-d2'>No Image</span>
							:''
						}
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
										<label className='d-none d-sm-inline-block' onClick={(e) => {e.preventDefault(); setDataToSend({...dataToSend, image: ""})}}>
											Reset
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

					<div className='main-form-lbl-inp mb-4'>
						<div className='d-flex align-items-center gap-3'>
							<label>contnt type</label> <FaAsterisk size={12} className='color-r'/>
						</div>
						<div className='d-flex align-items-center gap-3 color-l flex-wrap'>
							<span className={`fw-semibold check-box-btn flex-grow-1 px-2 ${dataToSend.is_about_movies ? "active" : ''}`} 
								onClick={() => setDataToSend({...dataToSend, is_about_movies: !dataToSend.is_about_movies })}
							>About Movies</span>
							<span className={`fw-semibold check-box-btn flex-grow-1 px-2 ${dataToSend.is_about_series ? "active" : ''}`} 
								onClick={() => setDataToSend({...dataToSend, is_about_series: !dataToSend.is_about_series })}
							>About Series</span>
							<span className={`fw-semibold check-box-btn flex-grow-1 px-2 ${dataToSend.is_about_people ? "active" : ''}`} 
								onClick={() => setDataToSend({...dataToSend, is_about_people: !dataToSend.is_about_people })}
							>About People</span>
						</div>
					</div>
					{
						(checkTwoObjIdentical(oldData, dataToSend,["image"]) || dataToSend.image !== "") && (dataToSend.is_about_movies || 
							dataToSend.is_about_people || dataToSend.is_about_series)
						?
							<input type="submit" name='subminBtn' className="main-red-btn w-100 py-3" value={"SAVE"}/>
						:
							<span className='main-red-btn w-100 py-3 disabled'>SAVE</span>
					}
				</div>
			</form>
		</>
	)
}

export default EditNewsForm
