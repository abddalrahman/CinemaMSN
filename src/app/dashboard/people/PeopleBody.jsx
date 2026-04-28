"use client"
import React, { useEffect, useState } from 'react'
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import { toast } from 'react-toastify';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import FilterPeopleSection from './FilterPeopleSection';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdModeEditOutline } from 'react-icons/md';
import ConfirmComp from '@/app/componentes/global/smallComp/ConfirmComp';
import { FaUser } from 'react-icons/fa6';
import Link from 'next/link';
import PaginationComp from '@/app/componentes/global/PaginationComp';
import { useDebounce } from '@/utils/debounce';
import { DomainPath } from '@/utils/DomainPath';

const PeopleBody = () => {
	const [totalPeople, setTotalPeople] = useState(0)
	const [searchText, setSearchText] = useState("");
	const [searchQ, setSearchQ] = useState({
		pName: "",
		page: 1,
		limit: 10,
		totalPeople: 0
	});
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [deleteControle, setDeleteControle] = useState({
		personID: null,
		showConfirm: false
	});
	const debouncedSearchTerm = useDebounce(searchText, 800);

	const fetchData = async () => {
		try {
			setLoading(true);
			const people = await fetchAPIFunc(`${DomainPath}/api/globals/people/getPeopleWithFiltering?pName=${searchQ.pName}&page=${searchQ.page}
				&limit=${searchQ.limit}`, "GET", {});
			const result = await people.json();
			if (people.status === 200) {
				setData(result.data)
				setTotalPeople(parseInt(result.dataLength))
			} else toast.error("Failed To Get people");
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error);
			return toast.error("something want wrong")
		}
	}

	useEffect(() => {
		setSearchQ(prev => ({ ...prev, pName: debouncedSearchTerm, page: 1 }));
	}, [debouncedSearchTerm]);

	useEffect(() => {
		const run = async () => {
			await fetchData();
		}
		run();
	}, [searchQ.pName, searchQ.limit, searchQ.page]);

	const deletePeople = (pID) => {
		setDeleteControle({
			personID: pID,
			showConfirm: true
		});
	}
	
	const handleConfirm = async () => {
		try {
			setLoading(true)
			setDeleteControle({
				...deleteControle,
				showConfirm: false
			})
			if (deleteControle.personID) {
				const respons = await fetchAPIFunc(`${DomainPath}/api/admin/people`, "DELETE", {id: Number(deleteControle.personID)});
				const result = await respons.json();
				if (respons.status === 200) {
					setLoading(false);
					toast.success(result.message);
					setDeleteControle({
						personID: null,
						showConfirm: false
					});
					await fetchData();
				} else {
					setLoading(false);
					setDeleteControle({
						personID: null,
						showConfirm: false
					});
					return toast.error(result.message);
				}
			}

		} catch (error) {
			console.log(error);
			return toast.error("something want wrong");
		}
	}
	const handleCansle = () => {
		setLoading(false);
		setDeleteControle({
			personID: null,
			showConfirm: false
		});
		return;
	}

	return (
		<>
			{
				loading ? <CoverL/> : ''
			}
			{
				deleteControle.showConfirm
				?
					<ConfirmComp data={{title: "Delete Person", body: "Are You Shur You Want To Delete This Person", noBtn: "No", yesBtn: "Delete", bg: "d"}}
						callFuncs={{confirmFunc:handleConfirm, cansleFunc: handleCansle}}
					/>
				:
					''
			}
			<div className='mt-4'>
				<FilterPeopleSection data={{searchQ, setSearchQ, searchText, setSearchText}}/>
				<div className='table-container fs-main overflow-auto'>
					<table className='people-table'>
						<thead>
							<tr className='color-g fw-semibold'>
								<td><span>Image</span></td>
								<td><span>Name</span></td>
								<td><span>Popularity</span></td>
								<td><span>ID</span></td>
								<td><span>Action</span></td>
							</tr>
						</thead>
						<tbody className='table-body'>
							{
								data.map((person)=>(
									<tr key={person.person_id}>
										<td>
											{
												person.image_url
												?
													<img src={person.image_url} alt={person.p_name} width={50} height={50} className='rounded-2 h-auto'/>
												:
													<span className='b-g-gd rounded-circle d-flex align-items-end overflow-hidden justify-content-center profile-span'>
														<FaUser size={34} color='#fff'/>
													</span>
											}
										</td> 
										<td><span className='color-l text-start'>{person.p_name}</span></td>
										<td><span className='color-g text-capitalize fw-medium'>{person.popularity}</span></td>
										<td><span className="color-l">{person.person_id}</span></td>
										<td>
											<div className='color-g d-flex align-items-center gap-3'>
												<Link href={`/dashboard/people/edit/${person.person_id}`} className='color-g d-flex align-items-center'>
													<MdModeEditOutline className='c-p' size={20}/>
												</Link>
												<button className='color-g d-flex align-items-center bg-transparent border-0 p-0'>
													<RiDeleteBin6Fill className='c-p' size={20} onClick={() => deletePeople(Number(person.person_id))}/>
												</button>
											</div>
										</td>
									</tr>
								))
							}
						</tbody>
						<tfoot>
							<tr>
								<td className='w-100'>
									<PaginationComp data={{elePerPage: searchQ.limit, total: Number(totalPeople), page: searchQ.page, 
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

export default PeopleBody
