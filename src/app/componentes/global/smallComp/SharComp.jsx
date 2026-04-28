import Link from 'next/link';
import React from 'react'
import { MdClose } from 'react-icons/md';

const SharComp = ({title, text, urlT, closeFunc}) => {
	const encodedUrl = encodeURIComponent(urlT);
  const encodedTitle = encodeURIComponent(text);
	return (
		<div className='cover d-flex align-items-center justify-content-center'>
			<div className='shar-container b-g-d3 p-3 rounded-1'>
				<div className='d-flex align-items-center justify-content-between mb-4 gap-2'>
					<h3 className='color-y fs-main'>{title}</h3>
					<MdClose size={18} className='color-l c-p' onClick={() => closeFunc(false)}/>
				</div>
				<div className='d-flex align-items-center justify-content-between'>
					<Link target='_blank' href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} className='d-flex flex-column align-items-center gap-2'
						onClick={() => closeFunc(false)}
					>
						<img src="/images/WhatsApp_icon.png" alt="WhatsApp" />
						<span className='color-dg fs-sm'>Whatsapp</span>
					</Link>
					<Link target='_blank' href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`} 
						className='d-flex flex-column align-items-center gap-2'
						onClick={() => closeFunc(false)}
					>
						<img src="/images/Telegram_logo.svg.webp" alt="Telegram" />
						<span className='color-dg fs-sm'>Telegram</span>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default SharComp
