"use client"
import Link from 'next/link';
import React, { useState } from 'react'
import { IoShareSocial } from "react-icons/io5";
import { FaLinkedin, FaInstagramSquare, FaGithub } from "react-icons/fa";
import { FaRegCopyright, FaLocationDot } from "react-icons/fa6";
import { usePathname } from 'next/navigation';
import { MdOutlineAlternateEmail } from "react-icons/md";
import { BsTelephoneFill } from "react-icons/bs";
import SharComp from '../smallComp/SharComp';
import { DomainPath } from '@/utils/DomainPath';

const Footer = () => {
	const [open, setOpen] = useState(false);
	const pathName = usePathname()
	if (pathName.startsWith("/login") || pathName.startsWith("/verifyOTP") || pathName.startsWith("/forgotPassReset")) {
		return null
	}
	return (
		<>
			{
				open ? <SharComp title={"Share This WebSite"} text={"CinemaMSN WebSite"} urlT={`${DomainPath}`} closeFunc={setOpen}/> : ''
			}
			<footer className='w-100 overflow-hidden'>
				<div className='w-100 h-100 position-relative hold-footer-bg pt-5'>
					<span className='animat-bg-1 position-absolute'></span>
					<span className='animat-bg-2 position-absolute'></span>
					<span className='animat-bg-3 position-absolute'></span>
					<div className='main-container'>
						<div className='d-flex align-items-center justify-content-between gap-2'>
							<div className='d-flex flex-column'>
								<span className='fs-2 color-l fw-medium'>Like my work?</span>
								<span className='color-l opacity-75'>Sharing this site means real support for my journey as a web developer.</span>
							</div>
							<button className='d-flex align-items-center justify-content-center gap-2 share-btn' onClick={() => setOpen(true)}>
								<IoShareSocial size={22}/> <span>Share</span>
							</button>
						</div>
						<div className='py-5 footer-links row'>
							<div className='col-12 col-sm-6 col-lg-4 col-xl-3 mb-4'>
								<div>
									<Link href={'/'}><img src="/images/second-site-logo.png" alt="logo" /></Link>
								</div>
								<div className='social d-flex align-items-center gap-3 mt-4'>
									<Link href={'https://github.com/abddalrahman?tab=repositories'} target='_black' className='color-l'><FaGithub size={26}/></Link>
									<Link href={'www.linkedin.com/in/abdalrahman-alani-ba7187381'} target='_black' className='color-l'><FaLinkedin size={26}/></Link>
									<Link href={'https://www.instagram.com/abd_alrahmanalani?igsh=YXRvMjZheDk2Zmxs'} target='_black' className='color-l'>
										<FaInstagramSquare size={26}/>
									</Link>
								</div>
							</div>
							<div className='other-links col-12 col-sm-6 col-lg-4 col-xl-3 mb-4'>
								<ul className='mb-0'>
									<li>Main Links</li>
									<li><Link href={'/'}>Home</Link></li>
									<li><Link href={'/news'}>News</Link></li>
									<li><Link href={'content'}>Content</Link></li>
									<li><Link href={'/contact'}>Contact Us</Link></li>
									<li><Link href={'/about'}>About Us</Link></li>
								</ul>
							</div>
							<div className='other-links col-12 col-sm-6 col-lg-4 col-xl-3 mb-4'>
								<ul className='mb-0'>
									<li>Statistics</li>
									<li><Link href={'/statistics?getT=c'}>Top 100 On CinemaMSN</Link></li>
									<li><Link href={'/statistics?getT=m'}>Top 100 Movie On CinemaMSN</Link></li>
									<li><Link href={'/statistics?getT=s'}>Top 100 Series On CinemaMSN</Link></li>
									<li><Link href={'/statistics?getT=p'}>Top 100 Populer Celebrities</Link></li>
								</ul>
							</div>
							<div className='other-links col-12 col-sm-6 col-lg-4 col-xl-3 mb-4'>
								<ul className='mb-0'>
									<li>info</li>
									<li className='d-flex align-items-center gap-3 mb-2'>
										<span><FaLocationDot size={18}/></span>
										<span >Al-Hama/Damascus/Syria</span>
									</li>
									<li className='d-flex align-items-center gap-2 mb-2'>
										<span><MdOutlineAlternateEmail size={18}/></span>
										<span>abdalrahman2003it@gmail.com</span>
									</li>
									<li className='d-flex align-items-center gap-2'>
										<span><BsTelephoneFill size={18}/></span>
										<span>+963988658276</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className='copy-r d-flex align-items-center justify-content-center gap-3 small color-l opacity-75 py-4'>
						<FaRegCopyright size={14}/>
						<span>2026 CinemaMSN. All rights reserved.</span>
					</div>
				</div>
			</footer>
		</>
	)
}

export default Footer
