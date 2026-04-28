"use client"
import React from 'react'
import { FaAsterisk } from 'react-icons/fa'

const FormLableInp = ({data}) => {
	const {req, lableT, placeH, sendData, setSendDataFunc, keyIs, inpType= "text", isnum= false, single= false} = data
	if (!req) {
		return (
			<div className='main-form-lbl-inp mb-3 fs-main'>
				<label>{lableT}</label>
				<input type={`${inpType}`} placeholder={`${placeH}`} value={single ? sendData : sendData[keyIs] || ""}
					onInput={(e) => isnum ? parseInt(e.currentTarget.value.replace(/,/g, '')) || e.currentTarget.value === ""  ? 
						setSendDataFunc(single ? parseInt(e.currentTarget.value.replace(/,/g, '')) || "" : 
							{...sendData, [keyIs]: parseInt(e.currentTarget.value.replace(/,/g, '')) || ""}
						) : '' : setSendDataFunc(single ? e.currentTarget.value : {...sendData, [keyIs]: e.currentTarget.value})
				}
				/>
			</div>
		)
	}
	return (
		<div className='main-form-lbl-inp mb-3 fs-main'>
			<div className='d-flex align-items-center gap-3'>
				<label>{lableT}</label> <FaAsterisk size={12} className='color-r'/>
			</div>
			<input type={`${inpType}`} placeholder={`${placeH}`} value={single ? sendData : sendData[keyIs] || ""}
				onInput={(e) => isnum ? parseInt(e.currentTarget.value.replace(/,/g, '')) || e.currentTarget.value === ""  ?  
					setSendDataFunc(single ? parseInt(e.currentTarget.value.replace(/,/g, '')) || "" : 
						{...sendData, [keyIs]: parseInt(e.currentTarget.value.replace(/,/g, '')) || ""}
					) : '' : setSendDataFunc(single ? e.currentTarget.value : {...sendData, [keyIs]: e.currentTarget.value})
			}
			/>
		</div>
	)
}

export default FormLableInp
