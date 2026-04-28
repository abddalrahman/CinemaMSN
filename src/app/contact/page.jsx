import Link from 'next/link'
import React from 'react'
import ContactForm from './ContactForm'

export const metadata = {
	title: 'CinemaMSN - Contact Us',
	description: `Contact CinemaMSN for any inquiries, feedback, or support. We value your input and look forward to hearing from you.`,
	openGraph: {
		title: 'Contact - CinemaMSN',
		description: 'Contact CinemaMSN for any inquiries, feedback, or support. We value your input and look forward to hearing from you.',
		type: 'website',
	},
}

const ContactUsPage = () => {
	return (
		<div className='contact-page pt-120'>
			<div className='main-container'>
				<h1 className='color-yd fw-semibold'>Contact Us</h1>
				<p className='color-l fw-medium'>Through the messaging system, you can contact the site administration to report any problems you encounter, 
					submit suggestions, or provide any notifications. It is important to  
					<Link href={'/login'} className='color-y fw-bold'> have an account </Link> 
					on the site in order to be able to communicate.
				</p>
				<div className='row pt-5'>
					<div className="col-12 col-lg-6">
						<ContactForm />
					</div>
					<div className="col-12 col-lg-6 d-none d-lg-flex align-items-end justify-content-center">
						<img src="/images/contact.png" alt="contact us" />
					</div>
				</div>
			</div>
		</div>
	)
}

export default ContactUsPage
