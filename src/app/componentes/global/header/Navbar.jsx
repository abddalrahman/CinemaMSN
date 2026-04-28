"use client"

import React, { useEffect, useRef, useState } from 'react'
import './header.css'
import BasicLink from '../smallComp/BasicLink'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CiSearch, CiLogout, CiLogin } from "react-icons/ci";
import { AiOutlineUser } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { PiUserCircleLight } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import { fetchAPIFunc, Logoutfunction } from '@/utils/clientRandomFunc'
import { toast } from 'react-toastify'
import { LuArrowRight, LuMessageSquare } from "react-icons/lu";
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { GrHomeRounded } from "react-icons/gr";
import { PiNewspaperLight, PiCardsThree, PiInfo } from "react-icons/pi";
import SectionTitle from '../smallComp/SectionTitle'
import { BsCameraReels, BsTv } from "react-icons/bs";
import { RiMovie2Line, RiUserStarLine } from "react-icons/ri";
import { Spinner } from 'react-bootstrap'
import { useDebounce } from '@/utils/debounce'
import { DomainPath } from '@/utils/DomainPath'

const Portal = ({ children }) => {
	const [displayAside, setDisplayAside] = useState(false);
	useEffect(() => {
		setDisplayAside(true);
		return () => setDisplayAside(false);
	}, []);
	return displayAside ? createPortal(children, document.body) : null;
};

const Navbar = ({ userID }) => {
	const router = useRouter();
	const [open, setOpen] = useState({
		handleOpen: false,
		showOpen: false
	});
	const [showAside, setShowAside] = useState(false);
	const [loadingSearch, setLoadingSearch] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchMain, setSearchMain] = useState({
		about: {
			people: true,
			content: true,
			news: true
		},
		data: {
			allContent: [],
			allNews: [],
			allPeople: []
		}
	});
	const debouncedSearchTerm = useDebounce(searchText, 800);
	const navBlur = useRef();
	const pathName = usePathname();
	const searchParams = useSearchParams();
	const getTValue = searchParams.get('getT') || null;

	const ProfileDropDown = (openVal, setOpenFunc, eventType) => {
		if (eventType === "c") {
			if (!openVal) {
				setOpenFunc({
					handleOpen: true,
					showOpen: false
				});
				setTimeout(() => {
					setOpenFunc({
						handleOpen: true,
						showOpen: true
					});
				}, 100);
			} else {
				setOpenFunc({
					handleOpen: true,
					showOpen: false
				});
				setTimeout(() => {
					setOpenFunc({
						handleOpen: false,
						showOpen: false
					});
				}, 100);
			}
		} else {
			setTimeout(() => {
				setOpenFunc({
					handleOpen: true,
					showOpen: false
				});
			}, 100);
			setTimeout(() => {
				setOpenFunc({
					handleOpen: false,
					showOpen: false
				});
			}, 200)
		}
	}

	const getSearchData = async () => {
		try {
			setLoadingSearch(true);
			const respons = await fetchAPIFunc(`${DomainPath}/api/globals/searchApi?title=${searchText}&about=${JSON.stringify(searchMain.about)}`, 
			"GET", {}
		);
		const result = await respons.json();
		if (respons.status === 200) {
			setSearchMain({
				...searchMain,
				data: {
					allContent: result.contents,
					allNews: result.news,
					allPeople: result.people
				}
			});
		} else {
			setSearchMain({
				...searchMain,
				data: {
					allContent: [],
					allNews: [],
					allPeople: []
				}
			});
		}
		setLoadingSearch(false);
	} catch (error) {
		console.log(error);
		setSearchMain({
			...searchMain,
			data: {
				allContent: [],
				allNews: [],
				allPeople: []
			}
		});
		setLoadingSearch(false);
		}
	}

	const handleLogout = async () => {
		const result = await Logoutfunction();
		if (result === 200) {
			toast.success("loged out");
		} else {
			toast.error("Something Went Wrong");
		}
		setShowAside(false);
		router.replace('/');
		router.refresh();
	}

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				navBlur.current.classList.add("blur-nav");
			} else {
				navBlur.current.classList.remove("blur-nav");
			}
		}
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [])

	useEffect(() => {
		setShowAside(false)
	}, [pathName])

	useEffect(() => {
		const run = async () => {
			if (debouncedSearchTerm.trim().length > 2) {
				await getSearchData();
			} else {
				setSearchMain({
					...searchMain,
					data: {
						allContent: [],
						allNews: [],
						allPeople: []
					}
				});
			}
		}
		run();
	}, [debouncedSearchTerm])
	if (pathName.startsWith("/login") || pathName.startsWith("/verifyOTP") || pathName.startsWith("/forgotPassReset")) {
		return null
	}
	return (
		<div className="main-nav" ref={navBlur}>
			<nav className="main-container d-flex align-items-center justify-content-between py-3">
				<Link href={'/'} className='main-logo'>
					<img src="/images/logo-01.png" alt="logo" />
				</Link>
				<ul className='p-0 m-0 d-none d-lg-flex align-items-center nav-links fs-main'>
					<li className='px-2'>
						<BasicLink data={{ text: "Home", To: "/", styling: `${pathName == "/" ? "active" : ""}` }} />
					</li>
					<li className='px-2'>
						<BasicLink data={{ text: "News", To: "/news", styling: `${pathName == "/news" ? "active" : ""}` }} />
					</li>
					<li className='px-2'>
						<BasicLink data={{ text: "Content", To: "/content", styling: `${pathName == "/content" ? "active" : ""}` }} />
					</li>
					<li className='px-2'>
						<BasicLink data={{ text: "Contact Us", To: "/contact", styling: `${pathName == "/contact" ? "active" : ""}` }} />
					</li>
					<li className='px-2'>
						<BasicLink data={{ text: "About", To: "/about", styling: `${pathName == "/about" ? "active" : ""}` }} />
					</li>
				</ul>
				<div className='d-flex align-items-center'>
					<div className="search-box">
						<div className='d-flex align-items-center'>
							<input type="search" name="searchText" placeholder='Search Here..' className='py-2 px-2 fs-md' value={searchText} 
								onInput={(e) => setSearchText(e.currentTarget.value)} 
							/>
							<CiSearch color='#fff' size={20} />
						</div>
					</div>
					<div className="user-profile ms-4 d-none d-sm-block">
						{
							userID === false
								?
								<BasicLink data={{ text: "Login", To: "/login", styling: "main-red-btn" }} />
								:
								<div className='position-relative'>
									<div
										className='d-flex align-items-center gap-2 profile-logo'
										onClick={() => ProfileDropDown(open.showOpen, setOpen, 'c')} onBlur={() => ProfileDropDown(open.showOpen, setOpen, 'b')} tabIndex={0}
									>
										<span className='rounded-circle d-flex align-items-center justify-content-center'>
											<AiOutlineUser color='#fff' size={20} />
										</span>
										<IoIosArrowDown color='#fff' className={open.showOpen ? 'flip' : ''} />
									</div>
									<ul className={`dropdown-list profile-drop position-absolute ${open.showOpen ? 'show' : ''} ${open.handleOpen ? 'handle-open' : ''}`}>
										<li>
											<BasicLink data={{
												icon: PiUserCircleLight, label: "Profile", To: `/profile/${userID}`,
												styling: "d-flex align-items-center w-100 h-100"
											}} />
										</li>
										<li>
											<BasicLink data={{
												typeIs: "btn", icon: FiLogOut, label: "Logout", To: "/logout",
												styling: "d-flex align-items-center w-100 h-100", func: handleLogout
											}} />
										</li>
									</ul>
								</div>
						}
					</div>
					<RxHamburgerMenu color='#fff' className='ms-2 ms-md-4 c-p' size={22} onClick={() => setShowAside(!showAside)} />
				</div>
			</nav>
			<Portal>
				<div className={`nav-aside-container cover ${showAside ? "show" : ""}`}>
					<aside className={`nav-aside position-fixed p-3 rounded-2 ${showAside ? "show" : ""}`}>
						<div className='aside-top d-flex align-items-center justify-content-between pb-3 mb-3'>
							<img src="/images/logo-01.png" alt="logo" />
							<LuArrowRight size={20} className='color-l c-p' onClick={() => setShowAside(false)} />
						</div>
						<SectionTitle title="Main pages" sm={true} />
						<ul className='mb-3 mt-3'>
							<li className='mb-1'>
								<Link href={'/'} className={`d-flex align-items-center gap-2 ${pathName == "/" ? "active" : ""}`}>
									<GrHomeRounded size={pathName == "/" ? 22 : 20}/> <span>Home</span>
								</Link>
							</li>
							<li className='mb-1'>
								<Link href={'/news'} className={`d-flex align-items-center gap-2 ${pathName == "/news" ? "active" : ""}`}>
									<PiNewspaperLight size={pathName == "/news" ? 22 : 20}/> <span>News</span>
								</Link>
							</li>
							<li className='mb-1'>
								<Link href={'/content'} className={`d-flex align-items-center gap-2 ${pathName == "/content" ? "active" : ""}`}>
									<PiCardsThree size={pathName == "/content" ? 22 : 20}/> <span>Content</span>
								</Link>
							</li>
							<li className='mb-1'>
								<Link href={'/contact'} className={`d-flex align-items-center gap-2 ${pathName == "/contact" ? "active" : ""}`}>
									<LuMessageSquare size={pathName == "/contact" ? 22 : 20}/> <span>Contact Us</span>
								</Link>
							</li>
							<li className='mb-1'>
								<Link href={'/about'} className={`d-flex align-items-center gap-2 ${pathName == "about" ? "active" : ""}`}>
									<PiInfo size={pathName == "/about" ? 22 : 20}/> <span>About</span>
								</Link>
							</li>
							{
								userID === false
								?
									<li className='mb-1'>
										<Link href={`/login`} className={`d-flex align-items-center gap-2 ${pathName == `/login` ? "active" : ""}`}>
											<CiLogin size={pathName == `/login` ? 22 : 20}/> <span>Login</span>
										</Link>
									</li>
								:
									<>
										<li className='mb-1'>
											<Link href={`/profile/${userID}`} className={`d-flex align-items-center gap-2 ${pathName == `/profile/${userID}` ? "active" : ""}`}>
												<PiUserCircleLight size={pathName == `/profile/${userID}` ? 22 : 20}/> <span>Profile</span>
											</Link>
										</li>
										<li className='mb-1'>
											<button className={`logout-btn d-flex align-items-center gap-2 w-100`} onClick={handleLogout}>
												<CiLogout size={pathName == `/profile/${userID}` ? 22 : 20}/> <span>Logout</span>
											</button>
										</li>
									</>
							}
						</ul>
						<SectionTitle title="statistics" sm={true} />
						<ul className='mb-0 mt-3'>
							<li className='mb-1'>
								<Link href={'/statistics?getT=c'} className={`d-flex align-items-center gap-2 
									${pathName == "/statistics" && (getTValue && getTValue == "c") ? "active" : ""}`}
								>
									<BsCameraReels size={pathName == "/statistics?getT=c" && (getTValue && getTValue == "c") ? 22 : 20}/> 
									<span>Top 100 On CinemaMSN</span>
								</Link>
							</li>
							<li className='mb-1'>
								<Link href={'/statistics?getT=m'} className={`d-flex align-items-center gap-2 
									${pathName == "/statistics" && (getTValue && getTValue == "m") ? "active" : ""}`}
								>
									<RiMovie2Line size={pathName == "/statistics?getT=m" && (getTValue && getTValue == "m") ? 22 : 20}/> 
									<span>Top 100 Movie On CinemaMSN</span>
								</Link>
							</li>
							<li className='mb-1'>
								<Link href={'/statistics?getT=s'} className={`d-flex align-items-center gap-2 
									${pathName == "/statistics" && (getTValue && getTValue == "s") ? "active" : ""}`}
								>
									<BsTv size={pathName == "/statistics?getT=s" && (getTValue && getTValue == "s") ? 22 : 20}/>
									<span>Top 100 Series On CinemaMSN</span>
								</Link>
							</li>
							<li className='mb-1'>
								<Link href={'/statistics?getT=p'} className={`d-flex align-items-center gap-2 
									${pathName == "/statistics" && (getTValue && getTValue == "p") ? "active" : ""}`}
								>
									<RiUserStarLine size={pathName == "/statistics?getT=p" && (getTValue && getTValue == "p") ? 22 : 20}/> 
									<span>Top 100 Populer Celebrities</span>
								</Link>
							</li>
						</ul>
					</aside>
				</div>
			</Portal>
			<div className={`main-search-result b-g-d2 position-absolute rounded-1 overflow-hidden ${searchText.trim() !== "" ? "show" : ""}`}>
				{
					loadingSearch || searchText.trim().length < 3
					?
						<div className='p-5 d-flex align-items-center justify-content-center'>
							<Spinner animation="border" variant="danger" />
						</div>
					:
						searchText.trim() !== ""
						?
							<ul className='overflow-auto'>
								{
									searchMain.data.allContent.length > 0
									?
										searchMain.data.allContent.map((content) => (
											<li key={content.content_id}>
												<Link className='d-flex align-items-center gap-2 p-3' href={`/details/${content.content_id}`}>
													<img src={`${content.poster_url}`} alt="poster" className='rounded-1' />
													<span className='color-l'>{content.title}</span>
													<span className='ms-auto color-dg'>{content.content_type === "S" ? "TV Series" : "Movie"}</span>
												</Link>
											</li>
										))
										:''
									}
								{
									searchMain.data.allPeople.length > 0
									?
										searchMain.data.allPeople.map((person) => (
											<li key={person.person_id}>
												<Link className='d-flex align-items-center gap-2 p-3' href={`/personD/${person.person_id}`}>
													<img src={`${person.image_url}`} alt={person.p_name} className='rounded-1'/>
													<span className='color-l'>{person.p_name}</span>
													<span className='ms-auto color-dg'>Celebrities</span>
												</Link>
											</li>
										))
										:''
								}
								{
									searchMain.data.allNews.length > 0
									?
										searchMain.data.allNews.map((news) => (
											<li key={news.news_id}>
												<Link className='d-flex align-items-center gap-2 p-3' href={`/news/${news.news_id}`}>
													<img src={`${news.image_url}`} alt={news.title} className='rounded-1' />
													<span className='color-l'>{news.title}</span>
													<span className='ms-auto color-dg'>News</span>
												</Link>
											</li>
										))
									:''
								}
								{
									searchMain.data.allContent.length === 0 && searchMain.data.allNews.length === 0 && searchMain.data.allPeople.length === 0
									?
										<li className='p-3 color-l'>No Data Found</li>
									:''
								}
							</ul>
						:''
				}
				<div className='p-3 d-flex align-items-center gap-2'>
					<span className='color-dg fw-semibold'>Results Count: </span>
					<span className='color-l'>{searchMain.data.allContent.length + searchMain.data.allNews.length + searchMain.data.allPeople.length}</span>
					<button className='ms-auto bg-transparent p-0 border-0 color-y' onClick={() => {
						setSearchText("")
						setSearchMain({
							...searchMain,
							data: {
								allContent: [],
								allNews: [],
								allPeople: []
							}
						});
					}}>Close</button>
				</div>
			</div>
		</div>
	)
}

export default Navbar
