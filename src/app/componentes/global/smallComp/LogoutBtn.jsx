"use client"
import { Logoutfunction } from '@/utils/clientRandomFunc';
import { useRouter } from 'next/navigation';
import React from 'react'
import { FiLogOut } from "react-icons/fi";
import { toast } from 'react-toastify';

const LogoutBtn = ({styling}) => {
	const router = useRouter();

	const handleLogout = async () => {
		const result = await Logoutfunction();
		if (result === 200) {
			toast.success("loged out");
		} else {
			toast.error("Something Went Wrong");
		}
		router.replace('/');
		router.refresh();
	}

	return (
		<span className={`d-flex align-items-center gap-2 ${styling}`} onClick={handleLogout}><FiLogOut/> Logout</span>
	)
}

export default LogoutBtn
