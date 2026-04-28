"use client"
import React, { useEffect, useState } from 'react'
import { MdModeEditOutline } from 'react-icons/md'
import { FaUser } from "react-icons/fa6";
import FilterUserSection from './FilterUserSection';
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import { toast } from 'react-toastify';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import UpdateUserPopUp from './UpdateUserPopUp';
import PaginationComp from '@/app/componentes/global/PaginationComp';
import { useDebounce } from '@/utils/debounce';
import { DomainPath } from '@/utils/DomainPath';

const UserBody = () => {
	const [searchText, setSearchText] = useState("");
	const [totalUsers, setTotalUsers] = useState(0)
	const [searchQ, setSearchQ] = useState({
		role: "",
		uStatus: "",
		userNameEmail: "",
		page: 1,
		limit: 10,
	});
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [open, setOpen] = useState(false);
	const [updateUserDate, setUpdateUserDate] = useState({
		userID: 0,
		uRole: "",
		uStatus: "",
		show: false,
		tokenData: null
	});
	const debouncedSearchTerm = useDebounce(searchText, 800);
	
	const fetchData = async () => {
		try {
			setLoading(true);
			const users = await fetchAPIFunc(`${DomainPath}/api/admin/users/getUsersForTable?role=${searchQ.role}&uStatus=${searchQ.uStatus}
				&userNameEmail=${searchQ.userNameEmail}&page=${searchQ.page}&limit=${searchQ.limit}`, "GET", {});
			const result = await users.json();
			if (users.status === 200) {
				setData(result.data)
				setTotalUsers(Number( result.dataLength))
			} else toast.error("Failed To Get Users");
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error);
			return toast.error("something want wrong")
		}
	}
	
	const getUserTokenData = async () => {
		try {
			const tokenData = await fetchAPIFunc(`${DomainPath}/api/globals/getCookieInfo`, "GET", {});
			const result = await tokenData.json();
			if (tokenData.status === 200) {
				setUpdateUserDate({
					...updateUserDate,
					tokenData: result
				})
			} else {
				setUpdateUserDate({
					...updateUserDate,
					tokenData: null
				})
			}
		} catch (error) {
			console.log(error);
			return;
		}
	}

	useEffect(() => {
		setSearchQ(prev => ({ ...prev, userNameEmail: debouncedSearchTerm, page: 1 }));
	}, [debouncedSearchTerm]);

	useEffect(() => {
		const run = async () => {
			await fetchData();
			await getUserTokenData();
		}
		run();
	}, [searchQ.role, searchQ.uStatus, searchQ.userNameEmail, searchQ.limit, searchQ.page])

	return (
		<>
			{
				loading ? <CoverL/> : ''
			}
			{
				updateUserDate.show
				?
					<UpdateUserPopUp info={{updateUserDate, setUpdateUserDate, data, fetchData}}/>
				:
					''
			}
			<div className='mt-4'>
				<FilterUserSection data={{searchQ, setSearchQ, searchText, setSearchText}}/>
				<div className='table-container fs-main overflow-auto'>
					<table className='users-table'>
						<thead>
							<tr className='color-g fw-semibold'>
								<td><span>image</span></td>
								<td><span>Email</span></td>
								<td><span>UserName</span></td>
								<td><span>Status</span></td>
								<td><span>Action</span></td>
							</tr>
						</thead>
						<tbody className='table-body'>
							{
								data.map((user)=>(
									<tr key={user.user_id}>
										<td>
											<div>
												{
													user.profile_image_url.replace("No Data", '').trim() !== ""
													?
														<img className='rounded-circle rounded-circle' src={user.profile_image_url} alt={user.username} />
													: 
														<span className='b-g-gd rounded-circle d-flex align-items-end overflow-hidden justify-content-center profile-span'>
															<FaUser size={34} color='#fff'/>
														</span>
												}
											</div>
										</td> 
										<td><span className='color-l'>{user.email}</span></td>
										<td><span className='color-g text-capitalize fw-medium'>{user.username}</span></td>
										<td><span className={`r-op-bg ${user.u_status === "nactive" ? "color-y" : user.c_status === "banned" ? "color-r" : "color-gr"}`}>{user.u_status}</span></td>
										<td>
											<button className='color-g d-flex align-items-center bg-transparent border-0 p-0'>
												<MdModeEditOutline className='c-p' size={20} onClick={() => {
													setUpdateUserDate({
														...updateUserDate,
														userID: parseInt(user.user_id),
														uRole: user.u_role,
														uStatus: user.u_status,
														show: true
													})
												}}/>
											</button>
										</td>
									</tr>
								))
							}
						</tbody>
						<tfoot>
							<tr>
								<td className='w-100'>
									<PaginationComp data={{elePerPage: searchQ.limit, total: Number(totalUsers), page: searchQ.page, 
										filterVals: searchQ, setFilterPage: setSearchQ}}
									/>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</>
	)
}

export default UserBody
