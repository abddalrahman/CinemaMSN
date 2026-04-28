"use client"
import IconTextTitle from '@/app/componentes/global/smallComp/IconTextTitle'
import React, { useEffect, useState } from 'react'
import { SlCloudUpload } from 'react-icons/sl';
import { IoMdImages } from "react-icons/io";
import { PiCursorClickFill } from "react-icons/pi";
import { MdDelete, MdOutlineClear } from "react-icons/md";
import { CreateFormData, fetchAPIFunc } from '@/utils/clientRandomFunc';
import ConfirmComp from '@/app/componentes/global/smallComp/ConfirmComp';
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import { toast } from 'react-toastify';
import { FaImage } from "react-icons/fa6";
import { Spinner } from 'react-bootstrap';
import { DomainPath } from '@/utils/DomainPath';

const AddContentImages = ({contentId}) => {
	const [oldImages, setOldImages] = useState({
		allImages: [],
		toDelete: [],
		selectMode: false
	});
	const [loading, setLoading] = useState(false);
	const [images, setImages] = useState({
		newImages: [],
		featured: [],
		selectMode: false
	});
	const [loadAndConfirm, setLoadAndConfirm] = useState({
		loading: false,
		showConfirm: false
	});

	const getData = async () => {
		try {
			setLoading(true);
			const imagesRespons = await fetchAPIFunc(`${DomainPath}/api/globals/getContentImages?id=${contentId}`, "GET", {});
			const imagesResult = await imagesRespons.json();
			if (imagesRespons.status === 200) {
				setOldImages({
					allImages: imagesResult,
					toDelete: [],
					selectMode: false
				});
			} else {
				setOldImages({
					allImages: null,
					toDelete: [],
					selectMode: false
				});
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
			setOldImages({
				allImages: null,
				toDelete: [],
				selectMode: false
			});
			setLoading(false);
		}
	}

	const deleteExistImages = async () => {
		setLoadAndConfirm({
			loading: false,
			showConfirm: true
		});
	}

	const handleConfirm = async () => {
		setLoadAndConfirm({
			loading: true,
			showConfirm: false
		})
		if (oldImages.toDelete.length > 0) {
			try {
				const respons = await fetchAPIFunc(`${DomainPath}/api/admin/content/contentImages`, "DELETE", {imagesIDS: oldImages.toDelete});
				const result = await respons.json();
				if (respons.status === 200) {
					setLoadAndConfirm({
						loading: false,
						showConfirm: false
					});
					toast.success(result.message);
					await getData();
				} else {
					setLoadAndConfirm({
						loading: false,
						showConfirm: false
					});
					return toast.error(result.message);
				}
			} catch (error) {
				console.log(error);
				setLoadAndConfirm({
					loading: false,
					showConfirm: false
				});
				return toast.error("something went wrong");
			}
		}
		
	}
	const handleCansle = () => {
		setOldImages({
			...oldImages,
			toDelete: [],
			selectMode: false
		})
		setLoadAndConfirm({
			loading: false,
			showConfirm: false
		});
		return;
	}

	const uploadImages = async () => {
		if (images.newImages.length === 0 || ! contentId) return toast.warning("no Data To Upload");
		setLoadAndConfirm({
			...loadAndConfirm,
			loading: true,
		})
		const objToUpload = {
			images: images.newImages,
			featured: images.featured,
			content_id: contentId,
		}
		try {
			const formData = CreateFormData(objToUpload);
			const respons = await fetchAPIFunc(`${DomainPath}/api/admin/content/contentImages`, "POST", formData, null, true);
			const result = await respons.json();
			if (respons.status === 200) {
				setLoadAndConfirm({
					...loadAndConfirm,
					loading: false,
				})
				toast.success(result.message);
				await getData();
				setImages({
					newImages: [],
					featured: [],
					selectMode: false
				})
			} else {
				setLoadAndConfirm({
					...loadAndConfirm,
					loading: false,
				})
				return toast.error(result.message);
			}
		} catch (error) {
			console.log(error);
			setLoadAndConfirm({
				...loadAndConfirm,
				loading: false,
			})
			return toast.error("something went wrong");
		}
	}

	useEffect(() => {
		const run = async () => {
			await getData();
		}
		run();
	}, [])

	return (
		<div className='b-g-d3 m-border p-3 p-md-4 rounded-4 mb-5 mt-3'>
			{loadAndConfirm.loading ? <CoverL/> : ''}
			{
				loadAndConfirm.showConfirm
				?
					<ConfirmComp data={{title: "Delete Images", body: "Are You Shur You Want To Delete This Images", noBtn: "No", yesBtn: "Delete", bg: "d"}}
						callFuncs={{confirmFunc:handleConfirm, cansleFunc: handleCansle}}
					/>
				: ''
			}
			<IconTextTitle data= {{iconTag: IoMdImages, text: "Content Images", req: false}}/>
			<div className='exist-images main-form-lbl-inp content-images mb-5'>
				{
					oldImages.allImages !== null && !loading
					?
						<>
							<div className='d-flex align-items-center justify-content-between'>
								<label>Exist Images</label>
								<div className='d-flex align-items-center gap-3 color-l old-images-cotrols'>
									<PiCursorClickFill size={24} className={`c-p ${oldImages.selectMode ? "active" : ""}`} 
										onClick={() => setOldImages({...oldImages, toDelete: [], selectMode: !oldImages.selectMode})}
									/> 
									{oldImages.toDelete.length > 0 ? <MdDelete className='color-r c-p' size={24} onClick={deleteExistImages}/> : ''}
								</div>
							</div>
							<div className={`d-flex gap-2 flex-wrap content-images-container ${oldImages.selectMode ? "select" : ""}`}>
								{
									oldImages.allImages.length > 0
									?
										oldImages.allImages.map((image)=> (
											<div key={image.media_id} className={`img-holder ${oldImages.toDelete.includes(parseInt(image.media_id)) ? "selected" : ''}`} 
											onClick={() => {
												oldImages.selectMode
												?
													oldImages.toDelete.includes(parseInt(image.media_id))
													?
														setOldImages({...oldImages, toDelete: oldImages.toDelete.filter((imgId) => imgId != parseInt(image.media_id))})
													:
														setOldImages({...oldImages, toDelete: [...oldImages.toDelete, parseInt(image.media_id)]})
												:''
											}}>
												<img src={image.file_url} alt="content image"/>
											</div>
										))
									:
										<div className='color-l rounded-1 p-3 b-g-d2 w-100'>
											No Old Images
										</div>
								}
							</div>
						</>
					:
						loading
						?
							<div className='p-5 d-flex align-items-center justify-content-center'>
								<Spinner animation="border" variant="danger" />
							</div>
						:
							<div className='color-l rounded-1 p-3 b-g-d2'>
								Failed to Get Data
							</div>
				}
			</div>
			<div className='upload-files-container'>
				<div className='main-form-lbl-inp mb-3'>
					<div >
						<label>New Images</label>
						<div className='d-flex align-items-center justify-content-between color-l new-images-conrols gap-2'>
							<span className='mt-2 fs-main'>After selecting the images, you can mark the images that you want to designate as featured</span>
							{images.newImages.length > 0 ? <PiCursorClickFill size={24} className={`c-p flex-shrink-0 ${images.selectMode ? "active" : ""}`} 
								onClick={() => setImages({...images, featured: [], selectMode: !images.selectMode})}
							/> : ''}
							
						</div>
					</div>
					<div className={`new-images-container d-flex gap-2 flex-wrap ${images.selectMode ? "select" : ""}`}>
						{
							images.newImages.length > 0
							?
								images.newImages.map((image, index) => {
									return <div key={index} className={`${images.featured.includes(image.name) ? "selected" : ''}`} onClick={()=> {
										images.featured.includes(image.name)
										?
											setImages({...images, featured: images.featured.filter((img) => img != image.name)})
										:
											setImages({...images, featured: [...images.featured, image.name]})
									}}>
										<img src={URL.createObjectURL(image)} alt="new content image" />
									</div>
								})
							:''
						}
					</div>
					<div className='upload-file-container d-flex align-items-center gap-3 py-3 px-3 px-sm-4 b-g-d2 rounded-2'>
						<SlCloudUpload size={30} className='color-g flex-shrink-0'/>
						<div className='color-g fw-semibold d-flex flex-column'>
							<span className='fs-sm'>Upload Content Images</span>
							<span className='color-dg fst-italic fw-normal fs-vxs'>.jpg, jpeg, png, ro .web, max 300KB</span>
						</div>
						{
							images.newImages.length > 0
							?
								<>
									<label className='d-none d-sm-inline-block' 
										onClick={(e) => { e.preventDefault(); setImages({newImages: [], featured: [], selectMode: false}) }}>Reset
									</label>
									<label className='d-flex align-items-center justify-content-center px-2 d-sm-none' 
										onClick={(e) => { e.preventDefault(); setImages({newImages: [], featured: [], selectMode: false}) }}><MdOutlineClear size={18}/>
									</label>
								</>
							:
								<>
									<label htmlFor="images" className='d-flex align-items-center justify-content-center d-sm-none px-2'><FaImage size={18}/></label>
									<label htmlFor="images" className='d-none d-sm-inline-block'>Select File</label>
								</>
						}
						<input type="file" multiple id='images' hidden 
							onChange={ (e) => setImages({newImages:[...e.currentTarget.files], featured: [], selectMode: false}) }
						/>
					</div>
					<button className={`main-red-btn upload-btn ${images.newImages.length > 0 ? 'active' : ''}`} onClick={uploadImages}>Upload Images</button>
				</div>
			</div>
		</div>
	)
}

export default AddContentImages
