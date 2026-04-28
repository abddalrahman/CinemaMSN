"use client"
import React, { useState } from 'react'
import FormLableInp from '../componentes/global/smallComp/FormLableInp';
import { userMessage } from '@/utils/zodValidations';
import { toast } from 'react-toastify';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import CoverL from '../componentes/global/smallComp/CoverL';
import { FaAsterisk } from 'react-icons/fa6';
import { DomainPath } from '@/utils/DomainPath';

const ContactForm = ({ toProfile= false, mID= null, refresh= null }) => {
	const [formData, setFormData] = useState({
		title: "",
		body: ""
	});
	const [loading, setLoading] = useState(false)

	const handleSendMessage = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const objToSend = {
				title: formData.title.trim(),
				body: formData.body.trim()
			};
			if (toProfile && mID !== null) {
				objToSend.reply_to_id = Number(mID)
			}
			const validation = userMessage.safeParse(objToSend);
			if (!validation.success) {
				setLoading(false);
				return toast.error(validation.error.issues[0].message);
			}
			const respons = await fetchAPIFunc(`${DomainPath}/api/users/activity/sendMessage`, "POST", objToSend);
			const result = await respons.json();
			if (respons.status === 200) {
				setLoading(false);
				setFormData({
					title: "",
					body: ""
				})
				if (toProfile && refresh !== null) {
					refresh();
				}
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

	return (
		<>
			{loading ? <CoverL/> : ""}
			<form className={`d-flex flex-column contact-form h-100 ${toProfile ? "to-profile" : ""}`} onSubmit={(e) => handleSendMessage(e)}>
				<FormLableInp data={{req: true, lableT: "Message Title", placeH: "Enter message title", sendData: formData, setSendDataFunc: setFormData, 
					keyIs: "title"}}
				/>
				<div className='main-form-lbl-inp mb-3'>
					<div className='d-flex align-items-center gap-3'>
						<label>Message Body</label><FaAsterisk size={12} className='color-r'/>
					</div>
					<textarea className='border-0' placeholder='Message Body' value={formData.body} onInput={(e) => setFormData({
						...formData, body: e.currentTarget.value}
					)}>
					</textarea>
				</div>
				{
					formData.title.trim().length > 2 && formData.body.trim().length > 10
					?
						<button className={`main-red-btn ${toProfile ? "mt-3" : "mt-5"}`}>SEND</button>
					: 
						<span className={`main-red-btn d-flex disabled ${toProfile ? "mt-3" : "mt-5"}`}>SEND</span>
				}
			</form>
		</>
	)
}

export default ContactForm
