"use client"
import React from 'react'
import { toast } from 'react-toastify';
import { IoCopyOutline } from "react-icons/io5";

const CopyText = ({text, label, styling}) => {

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success("Your Profile Link Copied Successfuly");
		} catch (error) {
			console.log(error);
			toast.error("failed to Copy Your Profile Link");
		}
	}

	return (
		<span className={styling} onClick={handleCopy}><IoCopyOutline className='me-2'/> {label}</span>
	)
}

export default CopyText
