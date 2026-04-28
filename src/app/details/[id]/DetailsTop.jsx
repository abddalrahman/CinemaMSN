"use client"
import React, { useEffect, useState } from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { IoShareSocial, IoCheckmark } from "react-icons/io5";
import { TbEyeCheck, TbEye } from "react-icons/tb";
import { MdAdd } from 'react-icons/md';
import { calcAvgRating, calcRatingNumber, CalcTime, fetchAPIFunc } from '@/utils/clientRandomFunc';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addWatchListAndWatched } from '@/utils/zodValidations';
import { GoPlay } from 'react-icons/go';
import RateContentComp from './RateContentComp';
import CoverL from '@/app/componentes/global/smallComp/CoverL';
import ShowTrailer from '@/app/componentes/global/ShowTrailer';
import SharComp from '@/app/componentes/global/smallComp/SharComp';
import { DomainPath } from '@/utils/DomainPath';

const DetailsTop = ({ data }) => {
	const {content_id, title, summary, c_status, content_type, episodes_count, poster_url, trailer_url, release_year, duration_minutes, media, allRating, 
		genres} = data;
	const router = useRouter();
	const [genresAndWatching, setGenresAndWatching] = useState({
		genres: null,
		watching: null,
		rating: null
	});
	const [loading, setLoading] = useState(false)
	const [showRateBox, setShowRateBox] = useState(false)
	const [showTr, setShowTr] = useState({
		show: false,
		title: "",
		url: ""
	})
	const [openShar, setOpenShar] = useState(false);

	const getGenresList = async () => {
		try {
			const getGNames = await fetchAPIFunc(`${DomainPath}/api/globals/getGenres?type=content_genre`, "GET", {});
			const genresResult = await getGNames.json();
			if(getGNames.status !== 200) {
				toast.error("Failed To Get Some Important Data");
				router.push('/');
				return null;
			} else {
				return genresResult;
			}
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	const getRating = async (reset= false) => {
		try {
			const userRating = await fetchAPIFunc(`${DomainPath}/api/users/activity/rating?cid=${content_id}`, "GET", {});
			const userRatingResult = await userRating.json();
			if(userRating.status !== 200) {
				if (reset) {
					setGenresAndWatching({...genresAndWatching, rating: null});
					return
				};
				return null;
			} else {
				if (reset) {
					setGenresAndWatching({...genresAndWatching, rating: userRatingResult});
					return
				};
				return userRatingResult;
			}
		} catch (error) {
			console.log(error);
			return null
		}
	}

	const getWatchingList = async (reset= false) => {
		try {
			const getWatching = await fetchAPIFunc(`${DomainPath}/api/users/activity/userWatching`, "GET", {});
			const watchingResult = await getWatching.json();
			if(getWatching.status !== 200) {
				if (reset) {
					setGenresAndWatching({...genresAndWatching, watching: watchingResult});
					return
				};
				return null;
			} else {
				if (reset) {
					setGenresAndWatching({...genresAndWatching, watching: watchingResult});
					return
				};
				return watchingResult;
			}
		} catch (error) {
			console.log(error);
			return null
		}
	}

	const handleWatchAction = async (status) => {
		if (c_status === "upcoming" && status === "watched") return toast.error("It's Upcoming Content you can't added to watched yet");
		try {
			setLoading(true);
			const dataToSend = {content_id: Number(content_id), wl_status: status};
			const validation = addWatchListAndWatched.safeParse(dataToSend);
			if (!validation.success) {
				setLoading(false);
				return toast.error("Data Form Issue");
			}
			const response = await fetchAPIFunc(`${DomainPath}/api/users/activity/userWatching`, "POST", dataToSend);
			const result = await response.json();
			if (response.status !== 201 && response.status !== 200) {
				if (response.status === 401) {
					toast.error("you have to Login and activate your account");
				} else if (response.status === 403 || response.status === 400) {
					toast.error(result.message);
				} else {
					toast.error("Something Went Wrong Try Again");
				}
			} else {
				await getWatchingList(true);
			}
			setLoading(false);
			return;
		} catch (error) {
			setLoading(false);
			console.log(error);
			return toast.error("Something Went Wrong Try Again");
		}
	}
	
	useEffect(() => {
		const run = async () => {
			const [genresResult, watchingResult, userRatingResult] = await Promise.all([getGenresList(), getWatchingList(), getRating()]);
			if (genresResult !== null) {
				setGenresAndWatching({
					genres: genresResult,
					watching: watchingResult,
					rating: userRatingResult
				});
			}
		}
		run();
	}, [])

	return (
		<>
			{loading ? <CoverL/> : ''}
			{
				showRateBox
				?
					<RateContentComp data={{rate: genresAndWatching.rating, title, cId: content_id, closeRate: setShowRateBox, reGetRating: getRating}}/>
				:
				''
			}
			{
				showTr.show
				?
					<ShowTrailer data={{title, vUrl: trailer_url, closeFunc: setShowTr}}/>
				: ''
			}
			{
				openShar 
				? <SharComp title={"Share Content"} text={title} urlT={`${DomainPath}/details/${content_id}`} 
						closeFunc={setOpenShar}
					/> 
				: ''
			}
			<div className='details-top pt-120 b-g-l pb-5'>
				<div className='main-container'>
					<div className='d-flex justify-content-sm-between flex-column flex-sm-row gap-2 align-items-sm-center'>
						<div className='fs-main mb-2 mb-sm-0'>
							<h1 className='fw-semibold fs-xxl mb-1'>{title}</h1>
							<span className='fw-semibold color-g'>{release_year}</span>
							<span className='fw-semibold color-g'> - </span>
							<span className='fw-semibold color-g'>{CalcTime(duration_minutes, true)}</span>
							<span className='fw-semibold color-g'>{content_type === "M" ? " - Movie" : " - TV Series"}</span>
							{
								content_type === "S"
								?
									<span className='fw-semibold color-g'> - {episodes_count}eps</span>
								:""		
							}
						</div>
						{
							c_status === "upcoming"
							?
								<div className='text-uppercase fw-bold color-l opacity-75 fs-lg me-5'>Upcoming</div>
							:
								<div className='d-flex gap-4'>
									<div className='avg-rating d-flex flex-column align-items-center w-f-c'>
										<h4 className='text-uppercase fw-bold color-l opacity-75 mb-1 fs-main'>Average Rating</h4>
										<div className='d-flex align-items-center gap-2 h-100'>
											<FaStar size={26} className='color-yd'/>
											<div className='d-flex flex-column fs-main'>
												<span className='d-flex align-items-center'> 
													<span className='color-l fw-semibold'>{calcAvgRating(allRating)}</span> <span className='color-l opacity-75'>/10</span>
												</span>
												<span className='color-l opacity-75 fw-semibold'>{calcRatingNumber(allRating)}</span>
											</div>
										</div>
									</div>
									<div className='avg-rating d-flex flex-column align-items-center w-f-c'>
										<h4 className='text-uppercase fw-bold color-l opacity-75 mb-1 fs-main'>Your Rating</h4>
										<div className='d-flex align-items-center gap-2 color-r c-p h-100 fs-main' onClick={() => setShowRateBox(true)}>
											{
												genresAndWatching.rating !== null && genresAndWatching.rating.score !== null
												?
													<>
														<FaStar size={26}/>
														<span className='fw-bold'>{genresAndWatching.rating.score}</span>
													</>
												:
													<>
														<FaRegStar size={26}/>
														<span className='fw-bold'>Rate</span>
													</>
											}
										</div>
									</div>
								</div>
						}
					</div>

					<div className='image-trailer py-4'>
						<div className=''>
							<img src={poster_url} alt={title + " poster"} className='rounded-3'/>
						</div>
						<div className='p-2'>
							<p className='color-l fw-semibold fs-md'>{summary}</p>
						</div>
						<div className='position-relative'>
							{
								trailer_url && trailer_url.replace("No Data", "") !== ""
								?
									<>
										<div className='w-100 h-100 d-flex align-items-center justify-content-center gap-3 c-p position-absolute' onClick={() => setShowTr({
											show: true,
											title: title,
											url: trailer_url
										})}>
											<GoPlay size={80}/>
											<span className='text-capitalize fs-2'>watch trailer</span>
										</div>
										{
											media.length > 0 && media.some((item) => item.is_featured === true && item.type === "image")
											?
											<img src={media.find((item) => item.is_featured === true && item.type === "image").url} alt={title +" trailer"} className='rounded-3'/>
											:
											<img src={"/images/trailer-placeholder.jpg"} alt={title +" trailer"} className='rounded-3'/>
										}
									</>
								:
									<div className='d-flex align-items-center justify-content-center color-l fs-2 fw-bold h-100'>
										No Trailer Available
									</div>
							}
						</div>
						<div className='d-flex flex-column gap-1 fs-main'>
							<button className={`top-details-btns text-uppercase ${loading ? "disabled" : ""}${
								genresAndWatching.watching !== null && genresAndWatching.watching.length > 0
								?
									genresAndWatching.watching.filter((item) => item.content_id == content_id)[0]?.wl_status === "queued"
									? "active" : "" 
								: ""
							}`} onClick={() => handleWatchAction("queued")} 
								disabled={loading}
							>
								{
									genresAndWatching.watching !== null && genresAndWatching.watching.length > 0
									?
										genresAndWatching.watching.filter((item) => item.content_id == content_id)[0]?.wl_status === "queued"
										?
											<IoCheckmark size={22}/>
										:
											<MdAdd size={22}/>
									:
										<MdAdd size={22}/>
								}
								<span>Watchlist</span>
							</button>
							<button className={`top-details-btns text-uppercase ${loading || c_status === "upcoming" ? "disabled" : ""} ${
								genresAndWatching.watching !== null && genresAndWatching.watching.length > 0
								?
									genresAndWatching.watching.filter((item) => item.content_id == content_id)[0]?.wl_status === "watched"
									? "active" : "" 
								: ""
							}`} onClick={() => handleWatchAction("watched")} 
								disabled={loading}
							>
								{
									genresAndWatching.watching !== null && genresAndWatching.watching.length > 0
									?
										genresAndWatching.watching.filter((item) => item.content_id == content_id)[0]?.wl_status === "watched"
										?
											<TbEyeCheck size={22}/>
										:
											<TbEye size={22}/>
									:
										<TbEye size={22}/>
								}
								<span>Watched</span>
							</button>
							<button className='top-details-btns text-uppercase' onClick={() => setOpenShar(true)}><IoShareSocial size={22}/><span>Share</span></button>
						</div>
					</div>
					<div className='genres-summary'>
						<div>
							<div className='d-flex flex-wrap gap-2 gap-lg-3 align-items-center mb-4'>
								{
									genresAndWatching.genres !== null && genresAndWatching.genres.length > 0
									?
										genres.map((item) => (
											<Link key={item} href={`/content?genre=${item}`} className='borderd-link fs-main'>
												{genresAndWatching.genres.filter((g) => g.genre_id == item)[0].name}
											</Link>
										))
									:''
								}
							</div>
							<p className='main-details-summary color-l fw-semibold'>{summary}</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default DetailsTop