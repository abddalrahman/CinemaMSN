"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'

const ShowToast = ({info}) => {
	const {messageText, type, changePath= null} = info;
	const noRepeat = useRef(false);
	const router = useRouter();
	useEffect(() => {
		if (!noRepeat.current){
			if (type === "error") {
				toast.error(`${messageText}`);
			} else if (type === "success") {
				toast.success(`${messageText}`);
			} else if (type === "warning") {
				toast.warning(`${messageText}`);
			}
			noRepeat.current = true
			changePath !== null ? router.replace(`${changePath}`): '';
		}
	}, [messageText, type]);

	return null
}

export default ShowToast
