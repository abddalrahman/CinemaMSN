"use client"
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import IconTextTitle from '@/app/componentes/global/smallComp/IconTextTitle';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { DomainPath } from '@/utils/DomainPath';
import { checkUpdateContentGenres } from '@/utils/zodValidations';
import React, { useEffect, useState } from 'react'
import { IoIosClose, IoIosInformationCircle } from 'react-icons/io';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { toast } from 'react-toastify';

const GenresUpdate = ({ genres, contentId }) => {
	const [contentG, setContentG] = useState(undefined);
	const [existingG, setExistingG] = useState();
	const [loading, setLoading] = useState(false);
	const [openG, setOpenG] = useState(false);

	const getData = async () => {
		try {
			setLoading(true)
			const genresRespons = await fetchAPIFunc(`${DomainPath}/api/globals/content/getContentGenres?id=${contentId}`, "GET", {});
			const genresResult = await genresRespons.json();
			if (genresRespons.status === 200) {
				setContentG(genresResult);
				setExistingG(genresResult);
			} else {
				setContentG(null);
				setExistingG(null);
			}
			setLoading(false)
		} catch (error) {
			console.log(error);
			setContentG(null);
			setExistingG(null);
			setLoading(false)
		}
	}

	const handleUpdateGenres = async () => {
		try {
			const genresToDelete = [];
			const genresToUpdate = [];
			setLoading(true)
			existingG.map((obj) => {
				const newGenre = contentG.some((item) => item.content_id == obj.content_id && item.genre_id == obj.genre_id)
				if (!newGenre) genresToUpdate.push(parseInt(obj.genre_id));	
			})
			contentG.map((obj) => {
				const removedGenre = existingG.some((item) => item.content_id == obj.content_id && item.genre_id == obj.genre_id)
				if (!removedGenre) genresToDelete.push(parseInt(obj.genre_id));	
			})
			if (genresToDelete.length == 0 && genresToUpdate.length == 0) return toast.warning("no thing change to update");
			const objToSend = {
				updateGenres: genresToUpdate,
				deleteGenres: genresToDelete,
				contentId: parseInt(contentId) 
			}
			const validation = checkUpdateContentGenres.safeParse(objToSend);
			if (!validation.success) {
				return toast.error("Data form Issues");
			}
			const respons = await fetchAPIFunc(`${DomainPath}/api/admin/content/contentGenres`, "PUT", objToSend);
			const result = await respons.json();
			if (respons.status === 200) {
				setLoading(false)
				toast.success(result.message);
				await getData();
			} else {
				setLoading(false)
				return toast.error(result.message);
			}
		} catch (error) {
			console.log(error);
			return toast.error("some thing want wrong");
		}
	}

	useEffect(() => {
		const run = async () => {
			await getData();
		}
		run()
	}, [])

	return (
		<>
			{
				loading || contentG === undefined ? <CoverL /> : ''
			}
			{
				contentG !== null && contentG !== undefined
				?
					<div className='b-g-d3 m-border p-3 p-md-4 rounded-4 general-content-info my-5'>
						<IconTextTitle data= {{iconTag: IoIosInformationCircle, text: "Content Genres", req: true}}/>
						<div className='main-form-lbl-inp mb-3'>
							<div className='selected-genres d-flex align-items-center gap-3 flex-wrap'>
								{
									existingG.map((genre) => {
										const gName = genres.filter((g) => g.genre_id.toString() === genre.genre_id.toString())[0].name;
										return <span key={genre.genre_id} className='main-d-gray-btn' data-genresid={genre.genre_id} onClick={() => setExistingG(
											[...existingG.filter((gn) => gn.genre_id != genre.genre_id)]
										)}>
											{gName}<IoIosClose size={22}/></span>
									})
								}
							</div>
							<div className='genres-d-d d-flex align-items-center justify-content-between dropdown-container c-p position-relative' tabIndex={0} 
								onClick={() => setOpenG(!openG)}
							>
								<span className='fw-medium'>Genres</span> <MdKeyboardArrowDown size={18}/>
								<ul className={`dropdown-list position-absolute filter-drop ${openG ? 'show' : ''}`}>
									{
										genres !== null
										?
											genres.map((genre, index) => {
												return <li key={index}>
													<span className={`d-flex align-items-center w-100 h-100 justify-content-center 
														${ existingG.some((item) => item.content_id == contentId && item.genre_id == genre.genre_id) ? "light-option": ''}`}
														onClick={(e)  => {e.stopPropagation();  existingG.some((item) => item.content_id == contentId && item.genre_id == genre.genre_id) ? 
															setExistingG([...existingG.filter((g) => g.genre_id != genre.genre_id)])
														: setExistingG([...existingG, {content_id: contentId, genre_id: genre.genre_id}])
														}}>+ {genre.name}</span> 
												</li>
											})
										:
											<li>Failed ro Get Genres</li>
									}
								</ul>
							</div>
							{
								contentG.length == existingG.length && contentG.every((item) => {
									return existingG.some((ele) => ele.content_id == item.content_id && ele.genre_id == item.genre_id)
								})
								?
									<span className='main-red-btn py-3 mt-4 disabled'>Updata Genres</span>
								:
									<span className='main-red-btn py-3 mt-4' onClick={handleUpdateGenres}>Updata Genres</span>
							}
						</div>
					</div>
				:
					contentG === null
					?
						<div className='b-g-d3 p-3 rounded-1 color-l mt-4'>Failed to Get Content Genres</div>
					:''
			}
		</>
	)
}

export default GenresUpdate
