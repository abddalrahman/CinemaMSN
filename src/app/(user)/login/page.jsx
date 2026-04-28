"use client"
import React, { useState } from 'react'
import "../login.css"
import BasicLink from '@/app/componentes/global/smallComp/BasicLink';
import { GoHome } from "react-icons/go";
import { checkEmail, loginUserValidation, registerUserValidation } from '@/utils/zodValidations';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import FormLableInp from '@/app/componentes/global/smallComp/FormLableInp';
import Link from 'next/link';
import { DomainPath } from '@/utils/DomainPath';

const switchFormExist = (val, setVal) => {
	setVal(val);
}

const Login = () => {
	const router = useRouter();
	const [switchForm, setSwitchForm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loginData, setLoginData] = useState({
		email: "",
		password: ""
	});
	const [registerData, setRegisterData] = useState({
		username: "", 
		email: "",
		password: ""
	});
	const [showFP, setShowFP] = useState({
		show: false,
		email: ""
	})
	
	const handleSubmitLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const validationLoginData = loginUserValidation.safeParse(loginData);
			if (!validationLoginData.success) {
				setLoading(false);
				return toast.error(validationLoginData.error.issues[0].message);
			}
			const respons = await fetchAPIFunc(`${DomainPath}/api/users/login`, "POST", loginData);
			const result = await respons.json();
			if (respons.status == 200) {
				setLoading(false);
				router.push('/');
				router.refresh();
				return;
			} else {
				setLoading(false);
				return toast.error(result.message);
			}
			
		} catch (error) {
			setLoading(false);
			console.log(error);
			return toast.error('Something Went Wrong Tyry Again');
		}
	}

	const handleSubmitRegister = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const validationRegisterData = registerUserValidation.safeParse(registerData);
			if (!validationRegisterData.success) {
				setLoading(false);
				return toast.error(validationRegisterData.error.issues[0].message);
			}
			const respons = await fetchAPIFunc(`${DomainPath}/api/users/register`, "POST", registerData);
			const result = await respons.json();
			if (respons.status == 201 && result.otpSended) {
				setLoading(false);
				toast.success(result.message);
				router.push('/verifyOTP');
			} else if (respons.status == 201 && !result.otpSended) {
				setLoading(false);
				toast.success(result.message);
				router.push(`/`);
			} else {
				setLoading(false);
				return toast.error(result.message);
			}
			
		} catch (error) {
			setLoading(false);
			console.log(error);
			return toast.error('Something Went Wrong Tyry Again');
		}
	}

	const handleForgotPass = async () => {
		try {
			setLoading(true);
			const validation = checkEmail.safeParse({email: showFP.email});
			if (!validation.success) {
				setLoading(false);
				return toast.error("Email is Not Currect");
			}
			const sendEmail = await fetchAPIFunc(`${DomainPath}/api/users/sensitive/forgotPass`, "POST", {email: showFP.email});
			const result = await sendEmail.json();
			if (sendEmail.status === 200) {
				toast.success(result.message);
			} else {
				toast.error(result.message);
			}
			setShowFP({
				show: false,
				email: ""
			});
			setLoading(false);
			return;
		} catch (error) {
			console.log(error);
			setLoading(false);
			setShowFP({
				show: false,
				email: ""
			});
			return toast.error("somethimg want wrong try again")
		}
	}

	return (
		<div className='login-page d-flex align-items-center justify-content-center w-100vw h-100vh position-relative'>
			{loading ? <CoverL/> : ''}
			{
				showFP.show
				?
					<div className='cover forgot-pass d-flex align-items-center justify-content-center'>
						<div className='b-g-d3 p-3 rounded-1'>
							<p className='color-l'>we will send a link to your wmail to update your password. The email address must be the same email 
								address as the account whose password you forgot.
							</p>
							<FormLableInp data={{ req: false, lableT: "Your Email", placeH: "Email", sendData: showFP, setSendDataFunc: setShowFP, 
								keyIs: "email" }}
							/>
							<div className='d-flex align-items-center gap-3 mt-4'>
								<button onClick={handleForgotPass} className='main-red-btn w-100'>Send</button>
								<button onClick={() => setShowFP({show: false, email: ""})} className='main-gray-btn w-100'>Close</button>
							</div>
						</div>
					</div>
				:
					''
			}
			<div 
				className={`forms-container p-4 d-flex align-items-center justify-content-between overflow-hidden position-relative rounded-5
					${switchForm ? "switch" : ''}`
				}
			>
				<Link className='go-home-icon' href={'/'}>
					<GoHome size={26} className='fw-bold color-l'/>
				</Link>
				<span className='position-absolute site-name fw-bold color-l'>CinemaMSN</span>
				<form className='d-flex flex-column align-items-center gap-3 py-5' onSubmit={(e) => handleSubmitLogin(e)}>
					<BasicLink data={{ icon: GoHome, To: "/", size: 24, color: "#f71616", styling: "home-logo position-absolute" }}/>
					<h2 className='fw-semibold color-g'>Login</h2>
					<div className='input-container'>
						<input type="email" id='email' name='email' value={loginData.email} className={loginData.email !== "" ? 'focus' : ''}
							onInput={(e) => setLoginData({...loginData, email: e.currentTarget.value })}
						/>
						<label htmlFor="email">email</label>
					</div>
					<div className='input-container'>
						<input type="password" id='password' name='password' value={loginData.password} 
							className={loginData.password !== "" ? 'focus' : ''}
							onInput={(e) => setLoginData({...loginData, password: e.currentTarget.value })}
						/>
						<label htmlFor="password">password</label>
					</div>
					<span className='color-g fw-semibold c-p' onClick={() => setShowFP({show: true, email: ""})}>Forgot Password?</span>
					<BasicLink data={{typeIs: "btn", text: 'Login', styling:"main-red-larg-btn w-100"}}/>
					<span className='fw-semibold color-g'>Dont have an account?</span>
					<span className='color-r fw-bold c-p' onClick={() => switchFormExist(true, setSwitchForm)}>Sign Up</span>
				</form>

				{/* register form */}
				<form className='d-flex flex-column align-items-center gap-3 py-5' onSubmit={(e) => handleSubmitRegister(e)}>
					<BasicLink data={{ icon: GoHome, To: "/", size: 24, color: "#f71616", styling: "home-logo position-absolute" }}/>
					<h2 className='fw-semibold color-g'>Register</h2>
					<div className='input-container'>
						<input type="text" id='username' name='username' value={registerData.username} 
							className={registerData.username !== "" ? 'focus' : ''}
							onInput={(e) => setRegisterData({...registerData, username: e.currentTarget.value })}/>
						<label htmlFor="username">username</label>
					</div>
					<div className='input-container'>
						<input type="email" id='email' name='email' value={registerData.email} className={registerData.email !== "" ? 'focus' : ''}
							onInput={(e) => setRegisterData({...registerData, email: e.currentTarget.value })}/>
						<label htmlFor="email">email</label>
					</div>
					<div className='input-container'>
						<input type="password" id='password' name='password' value={registerData.password} 
							className={registerData.password !== "" ? 'focus' : ''}
							onInput={(e) => setRegisterData({...registerData, password: e.currentTarget.value })}/>
						<label htmlFor="password">password</label>
					</div>
					<BasicLink data={{typeIs: "btn", text: 'Register', styling:"main-red-larg-btn w-100"}}/>
					<span className='fw-semibold color-g'>Already have an account?</span>
					<span className='color-r fw-bold c-p'onClick={() => switchFormExist(false, setSwitchForm)} >Login</span>
				</form>
			</div>
		</div>
	)
}

export default Login
