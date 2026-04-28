"use client"
import { fetchAPIFunc } from "@/utils/clientRandomFunc";
import "../login.css"
import BasicLink from '@/app/componentes/global/smallComp/BasicLink';
import { clientOTPValidation } from "@/utils/zodValidations";
import React, { useEffect, useRef, useState } from 'react'
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CoverL from "@/app/componentes/global/smallComp/CoverL";
import { DomainPath } from "@/utils/DomainPath";

const VerifyForm = () => {
	const [code, setCode] = useState({num1: '', num2: '', num3: '', num4: '', num5: '', num6: ''});
	const [loading, setLoading] = useState(false);
	const inputRef = useRef([]);
	const router = useRouter();

	const handleCodeChange = (e, fromI, toI) => {
		const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
		if (numbers.includes( Number(e.currentTarget.value) )) {
			setCode({...code, [fromI]: e.currentTarget.value == '' ? e.currentTarget.value : Number(e.currentTarget.value)});
			if (toI !== null) {
				if (e.currentTarget.value === "" && toI > 1) {
					inputRef.current[toI - 2].focus();
					inputRef.current[toI - 2].select();
				} else if (e.currentTarget.value !== "") {
					inputRef.current[toI].focus();
					inputRef.current[toI].select();
				}
			} else if (e.currentTarget.value === "") {
				inputRef.current[inputRef.current.length - 2].focus();
				inputRef.current[inputRef.current.length - 2].select();
			}
		} 
	};
	
	const handleBackspace = (e, inpValue, toI) => {
		if (e.key === "Backspace" && (toI > 1 || toI === null)  && inpValue === "") {
			e.preventDefault();
			inputRef.current[toI !== null ? toI - 2 : inputRef.current.length - 2].focus();
			inputRef.current[toI !== null ? toI - 2 : inputRef.current.length - 2].select();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true)
		try {	
			const validationOTP = clientOTPValidation.safeParse(code);
			if (!validationOTP.success) {
				setLoading(false)
				return toast.error("not Valid Code");
			}
			const bodyToSend = {
				sendingCode: Object.values(code).join('')
			}
			const respons = await fetchAPIFunc(`${DomainPath}/api/users/register/verifyOTP`, "POST", bodyToSend);
			const result = await respons.json();
			if (respons.status == 200) {
				setLoading(false)
				router.push('/');
				router.refresh();
				return toast.success(result.message);
			} else {
				setLoading(false)
				return toast.error(result.message);
			}
		} catch (error) {
			console.log(error);
			setLoading(false)
			return toast.error("Something Went Wrong Tyry Again");
		}
	}

	const resendOTP = async () => {
		try {
			setLoading(true);
			const respons = await fetchAPIFunc(`${DomainPath}/api/users/register/resendOTP`, "POST", {});
			const result = await respons.json();
			if (respons.status === 200) {
				setLoading(false);
				return toast.success(result.message);
			} else if (respons.status === 429) {
				setLoading(false);
				return toast.warning(result.message);
			} else {
				setLoading(false);
				return toast.error(result.message);
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
			return toast.error("something want wrong");
		}
	}

	useEffect(() => {
		inputRef.current[0]?.focus();	
	}, []);

	return (
		<div>
			{
				loading ? <CoverL/> : ''
			}
			<div className='otp-form-container d-flex flex-column align-items-center gap-2'>
				<h1 className="fw-bold color-l mb-0">Verify Your Account</h1>
				<span className="fw-medium color-g">Enter the 6-digit code sent to your email</span>
				<form className="d-flex flex-column gap-3" onSubmit={(e) => handleSubmit(e)}>
					<div className='d-flex align-items-center gap-2'>
						<input type="text" maxLength={1} value={code.num1} ref={(el) => inputRef.current[0] = el}
							onInput={(e) => handleCodeChange(e, "num1", 1)} onKeyDown={(e) => {handleBackspace(e, code.num1, 1)}}
						/>
						<input type="text" maxLength={1} value={code.num2} ref={(el) => inputRef.current[1] = el}
							onInput={(e) => handleCodeChange(e, "num2", 2)} onKeyDown={(e) => {handleBackspace(e, code.num2, 2)}}
						/>
						<input type="text" maxLength={1} value={code.num3} ref={(el) => inputRef.current[2] = el}
							onInput={(e) => handleCodeChange(e, "num3", 3)} onKeyDown={(e) => {handleBackspace(e, code.num3, 3)}}
						/>
						<input type="text" maxLength={1} value={code.num4} ref={(el) => inputRef.current[3] = el}
							onInput={(e) => handleCodeChange(e, "num4", 4)} onKeyDown={(e) => {handleBackspace(e, code.num4, 4)}}
						/>
						<input type="text" maxLength={1} value={code.num5} ref={(el) => inputRef.current[4] = el}
							onInput={(e) => handleCodeChange(e, "num5", 5)} onKeyDown={(e) => {handleBackspace(e, code.num5, 5)}}
						/>
						<input type="text" maxLength={1} value={code.num6} ref={(el) => inputRef.current[5] = el}
							onInput={(e) => handleCodeChange(e, "num6", null)} onKeyDown={(e) => {handleBackspace(e, code.num6, null)}}
						/>
					</div>
					<BasicLink data={{typeIs: "btn", text: 'Verify', styling:"main-red-larg-btn w-100"}}/>
					<div className='d-flex align-items-center justify-content-center'>
						<span className="color-g">Dont receive the code?</span>
						<span className="color-r px-2 c-p" onClick={resendOTP}>Resend</span>
					</div>
				</form>
			</div>
		</div>
	)
}

export default VerifyForm
