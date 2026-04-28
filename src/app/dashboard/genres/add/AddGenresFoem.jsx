"use client"
import CoverL from '@/app/componentes/global/smallComp/CoverL'
import FormLableInp from '@/app/componentes/global/smallComp/FormLableInp'
import IconTextTitle from '@/app/componentes/global/smallComp/IconTextTitle'
import { fetchAPIFunc } from '@/utils/clientRandomFunc'
import { DomainPath } from '@/utils/DomainPath'
import { addGenreValidation } from '@/utils/zodValidations'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { IoIosInformationCircle } from 'react-icons/io'
import { toast } from 'react-toastify'

const AddGenresFoem = () => {
	const router = useRouter()
	const [loading, setLoading] = useState(false);
	const [dataToSend, setDataToSend] = useState({
		name: "",
		kind: "",
		description: ""
	}); 

	const handleSubmit = async (e) => {
		e.preventDefault();
		const btnIS = e.nativeEvent.submitter.name;
		if (btnIS === "subminBtn") {
			setLoading(true);
			const validationContent = addGenreValidation.safeParse(dataToSend);
			if (!validationContent.success) {
				setLoading(false);
				return toast.error(validationContent.error.issues[0].message);
			} else {
				try {
					const respons = await fetchAPIFunc(`${DomainPath}/api/admin/genres`, "POST", dataToSend);
					const result = await respons.json();
					if (respons.status === 201) {
						setLoading(false);
						toast.success(result.message);
						router.replace('/dashboard/genres');
					} else {
						setLoading(false);
						return toast.error(result.message);
					}
				} catch (error) {
					console.log(error);
					setLoading(false);
					return toast.error("something went wrong");
				}
			}
		}
	}

	return (
		<>
			{
				loading ? <CoverL/> : ''
			}
			<form onSubmit={(e) => handleSubmit(e)}>
				<div className='b-g-d3 m-border p-3 p-md-4 rounded-4 general-content-info mb-5'>
					<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "Genres Info", req: true}}/>
					<FormLableInp data={{req: false, lableT: "genres name", placeH: "linke Horror, Drama..", sendData: dataToSend, setSendDataFunc: setDataToSend, 
						keyIs: "name", lower: true}}
					/>
					<div className='main-form-lbl-inp mb-3'>
						<label>description</label>
						<textarea className='border-0' placeholder='Talk about this genre' value={dataToSend.description} onInput={(e) => setDataToSend({
							...dataToSend, description: e.currentTarget.value}
						)}>
						</textarea>
					</div>

					<div className='main-form-lbl-inp'>
						<label>Genre type</label>
						<div className='d-flex align-items-center gap-2 gap-md-3 fs-main color-l flex-wrap'>
							<span className={`fw-semibold check-box-btn flex-grow-1 px-2 ${dataToSend.kind === "person_role" ? "active" : ''}`} 
								onClick={() => setDataToSend({...dataToSend, kind: 'person_role'})}
							>person role</span>
							<span className={`fw-semibold check-box-btn flex-grow-1 px-2 ${dataToSend.kind === "content_genre" ? "active" : ''}`} 
								onClick={() => setDataToSend({...dataToSend, kind: 'content_genre'})}
							>content genre</span>
							<span className={`fw-semibold check-box-btn flex-grow-1 px-2 ${dataToSend.kind === "content_award" ? "active" : ''}`} 
								onClick={() => setDataToSend({...dataToSend, kind: 'content_award'})}
							>content award</span>
							<span className={`fw-semibold check-box-btn flex-grow-1 px-2 ${dataToSend.kind === "person_award" ? "active" : ''}`} 
								onClick={() => setDataToSend({...dataToSend, kind: 'person_award'})}
							>person award</span>
						</div>
					</div>
				</div>
				{
					dataToSend.name.trim() !== "" && dataToSend.kind.trim() !== "" && dataToSend.description.trim() !== ""
					?
						<input type="submit" name='subminBtn' className={`main-red-btn w-100 py-3 ${
							dataToSend.name.trim() !== "" && dataToSend.kind.trim() !== "" && dataToSend.description.trim() !== "" ? "" : "disabled"
						}`} value={"SAVE"}/>
					:
						<span className='main-red-btn w-100 py-3 disabled'>SAVE</span>
					}
			</form>
		</>
	)
}

export default AddGenresFoem
