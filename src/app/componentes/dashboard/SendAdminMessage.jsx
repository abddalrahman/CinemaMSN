import React, { useEffect, useRef, useState } from 'react'
import CoverL from '../global/smallComp/CoverL';
import FormLableInp from '../global/smallComp/FormLableInp';
import { MdClose } from 'react-icons/md';
import { adminMessage } from '@/utils/zodValidations';
import { toast } from 'react-toastify';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { DomainPath } from '@/utils/DomainPath';

const SendAdminMessage = ({ data }) => {
	const {info, closeForm} = data
	const [formData, setFormData] = useState({
		title: "",
		body: "",
	});
	const [loading, setLoading] = useState(false)
	const formRef = useRef();

	const handleSendMessage = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const objToSend = {
				title: formData.title.trim(),
				body: formData.body.trim(),
				resever_id: Number(info.userID),
				reply_to_id: info.messageID === null ? null : Number(info.messageID)
			};
			const validation = adminMessage.safeParse(objToSend);
			if (!validation.success) {
				setLoading(false);
				return toast.error(validation.error.issues[0].message);
			}
			const respons = await fetchAPIFunc(`${DomainPath}/api/admin/messages`, "POST", objToSend);
			const result = await respons.json();
			if (respons.status === 200) {
				setLoading(false);
				setFormData({
					title: "",
					body: ""
				})
				closeForm({...info, show: false})
				return toast.success(result.message);
			} else {
				setLoading(false);
				return toast.error(result.message);
			}
			
		} catch (error) {
			setLoading(false);
			console.log(error);
			return toast.error("Something Went Wrong Try Again");
		}
	}

	useEffect(() => {
		setTimeout(() => {
			formRef.current.classList.add("show");
		}, 50);
	}, [])
	if (!info.userID) return null;
	return (
		<div ref={formRef} className='admin-message-box position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'>
			{loading ? <CoverL/> : ""}
			<form className='send-admin-m p-3 b-g-d3 rounded-1' onSubmit={(e) => handleSendMessage(e)}>
				<div className='d-flex align-items-center justify-content-between'>
					<h5 className='color-l'>User ID: {info.userID}</h5>
					<MdClose size={20} className='color-l c-p' onClick={() => {
						formRef.current.classList.remove("show");
						setTimeout(() => {
							closeForm({...info, show: false})
						}, 200);
					}}/>
				</div>
				<FormLableInp data={{req: true, lableT: "Message Title", placeH: "Enter message title", sendData: formData, setSendDataFunc: setFormData, 
					keyIs: "title"}}
				/>
				<div className='main-form-lbl-inp mb-3'>
					<label>Message Body</label>
					<textarea className='border-0' placeholder='Message Body' value={formData.body} onInput={(e) => setFormData({
						...formData, body: e.currentTarget.value}
					)}>
					</textarea>
				</div>
				{
					formData.title.trim().length > 2 && formData.body.trim().length > 10
					?
						<button className='main-red-btn mt-3 py-2 w-100'>SEND</button>
					: 
						<span className='main-red-btn d-flex disabled mt-3 py-2 w-100'>SEND</span>
				}
			</form>
		</div>
	)
}

export default SendAdminMessage