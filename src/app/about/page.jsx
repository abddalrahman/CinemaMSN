import React from 'react'
import "./about.css";

export const metadata = {
  title: "CinemaMSN - About",
  description: `Learn about the tech stack behind CinemaMSN. Explore how we built this platform using Next.js, modern libraries, 
		and advanced web development techniques to ensure high performance.`,
  openGraph: {
    title: "CinemaMSN - About",
    description: `Learn about the tech stack behind CinemaMSN. Explore how we built this platform using Next.js, modern libraries, 
			and advanced web development techniques to ensure high performance.`,
    type: "website"
  }
};

const About = () => {
	return (
		<div className='pt-120'>
			<div className='main-container'>
				
				<h1 className='fs-vxl color-l fw-bold mb-5 pb-5'>About CinemaMSN</h1>
				<div className='mb-5'>
					<h2 className='sec-t position-relative ps-3 mb-3 color-l fw-semibold fs-xxl'>Overview</h2>
					<p className='color-g fw-medium ps-3 fs-mdl'>
						CinemaMSN is a comprehensive cinematic ecosystem designed for enthusiasts who seek more than just a movie list. Our platform provides deep 
						insights, real-time updates, and an interactive community experience, bridging the gap between global cinematic data and end-user 
						engagement.
					</p>
				</div>
				<div className='mb-5 platform-services pb-3'>
					<h2 className='sec-t position-relative ps-3 mb-3 color-l fw-semibold fs-xxl'>Platform Services</h2>
					<ul className='ps-4 color-g fs-mdl'>
						<li className='mb-2'>
							Comprehensive Databases: Instant access to detailed information on thousands of movies and series.
						</li>
						<li className='mb-2'>
							Celebrity Insights: Full biographies and filmographies of industry icons.
						</li>
						<li className='mb-2'>
							Real-time News: The latest breaking news and trends in the entertainment world.
						</li>
						<li>
							Smart Rankings: Curated (Top 100) lists powered by user-driven statistics.
						</li>
					</ul>
				</div>
				<div className='mb-5 access-security pb-3'>
					<h2 className='sec-t position-relative ps-3 mb-3 color-l fw-semibold fs-xxl'>Access & Security</h2>
					<ul className='ps-4 color-g fs-mdl fw-medium'>
						<li className='mb-2'>
							<span className='color-l fw-bold'>Guest Access:</span>
							<p>Browsing movie details, reading news, and viewing public statistics.</p>
						</li>
						<li className='mb-2'>
							<span className='color-l fw-bold'>Registered Members:</span>
							<p>
								Customize your profile. Add reviews and ratings, interact with other reviews, follow other users' accounts, send messages to the 
								site administration and reply to messages from the administration, create personal lists of watched content, saved news, ratings, 
								reviews, favorite celebrities, and genres you are interested in.
							</p>
						</li>
						<li className='mb-2'>
							<span className='color-l fw-bold'>Security & Recovery:</span>
							<p>
								We prioritize user data integrity. Our authentication flow includes a robust OTP (One-Time Password) verification for account 
								activation and a secure, encrypted Password Reset mechanism to ensure a seamless and safe user recovery journey.
							</p>
						</li>
					</ul>
				</div>
				<div className='mb-5 technical-deep'>
					<h2 className='sec-t position-relative ps-3 mb-3 color-l fw-semibold fs-xxl'>The Technical Deep Dive</h2>
					<ul className='ps-4 color-g fs-mdl fw-medium'>
						<li className='mb-4'>
							<span className='color-l fw-bold'>Frontend Mastery & Media Optimization: </span>
							<ul className='ps-3 color-g'>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Next.js Architecture: </span>
									<p>Built with Next.js 16+, leveraging Server Components for SEO optimization and Client Components for rich interactivity.</p>
								</li>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Cloudinary Integration: </span>
									<p>
										Integrated Cloudinary SDK for high-performance media management. All images, trailers, and user avatars are hosted on a 
										specialized cloud infrastructure, ensuring lightning-fast delivery via Global CDN, which significantly reduces server load 
										and boosts page speed.
									</p>
								</li>
							</ul>
						</li>
						<li className='mb-4'>
							<span className='color-l fw-bold'>Professional System Architecture</span>
							<ul className='ps-3 color-g'>
								<p>I followed a Clean Architecture approach to ensure the codebase remains scalable and maintainable.</p>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Separation of Concerns: </span>
									<p>Clearly separated logic into dedicated directories for Helper Functions, API Handlers, and Database Queries.</p>
								</li>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Data Access Layer: </span>
									<p>A specialized layer handles all interactions with the PostgreSQL database, ensuring clean and reusable query logic.</p>
								</li>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Modular Pages: </span>
									<p>Organized the Next.js App Router into logical groups, making navigation and maintenance seamless</p>
								</li>
							</ul>
						</li>
						<li className='mb-4'>
							<span className='color-l fw-bold'>Robust API Ecosystem (RESTful Design)</span>
							<ul className='ps-3 color-g'>
								<p>Built approximately 100 RESTful API endpoints to facilitate seamless communication between the frontend and backend.</p>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Methodology: </span>
									<p>Full implementation of GET, POST, PUT, and DELETE methods.</p>
								</li>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Self-Documenting Code: </span>
									<p>Each API is meticulously documented using a standardized header</p>
								</li>
							</ul>
						</li>
						<li className='mb-4'>
							<span className='color-l fw-bold'>Advanced Security & Authentication</span>
							<ul className='ps-3 color-g'>
								<p>Security was a top priority in this architecture.</p>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Authentication Flow: </span>
									<p>mplemented a secure session management system using Cookies and JSON Web Tokens (JWT) for reliable identity verification.</p>
								</li>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Data Encryption: </span>
									<p>Sensitive information, such as passwords, is hashed using bcryptjs before being stored.</p>
								</li>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Strict Validation: </span>
									<p>
										Leveraged Zod for rigorous End-to-End schema validation. Inputs are validated on both the Client-side (for UX) and Server-side 
										(for Security).
									</p>
								</li>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Safe Account Recovery: * Activation: </span>
									<p>A 6-digit OTP system integrated via Nodemailer.</p>
								</li>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Password Reset: </span>
									<p>
										A sophisticated token-based recovery system that validates unique identifiers stored in the database against encrypted payload 
										tokens for maximum security.
									</p>
								</li>
							</ul>
						</li>
						<li className='mb-4'>
							<span className='color-l fw-bold'>Database & State Management</span>
							<ul className='ps-3 color-g'>
								<li className='mb-2'>
									<span className='color-l fw-bold'>PostgreSQL (pg): </span>
									<p>Designed a complex relational database schema to handle movies, celebrities, news, and user interactions.</p>
								</li>
								<li className='mb-2'>
									<span className='color-l fw-bold'>State & Cookies: </span>
									<p>Adopted a cookie-based strategy for persistent user sessions, ensuring a smooth and lightweight state management experience.</p>
								</li>
							</ul>
						</li>
						<li className='mb-4'>
							<span className='color-l fw-bold'>UI/UX Excellence</span>
							<ul className='ps-3 color-g'>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Styling: </span>
									<p>Utilized Bootstrap 5 for a responsive, mobile-first design, while keeping custom CSS to an absolute minimum for optimal performance.</p>
								</li>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Interactive Components: * Swiper: </span>
									<p>For high-performance, touch-friendly sliders.</p>
								</li>
								<li className='mb-2'>
									<span className='color-l fw-bold'>React-Toastify: </span>
									<p>For real-time, non-intrusive user notifications.</p>
								</li>
								<li className='mb-2'>
									<span className='color-l fw-bold'>React-Icons: </span>
									<p>For a consistent and lightweight visual language.</p>
								</li>
							</ul>
						</li>
						<li className='mb-4'>
							<span className='color-l fw-bold'>Administrative Control (Admin Dashboard)</span>
							<ul className='ps-3 color-g'>
								<p>A comprehensive, secure Dashboard was engineered to manage the entire platform</p>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Content Management: </span>
									<p>Full CRUD operations for Content, Celebrities, News, Reviews, and Messages.</p>
								</li>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Role Management: </span>
									<p>Exclusive authority for the Protected Admin to modify user permissions and platform settings.</p>
								</li>
							</ul>
						</li>
						<li className='mb-4'>
							<span className='color-l fw-bold'>Complex Community Features</span>
							<ul className='ps-3 color-g'>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Smart Interaction: </span>
									<p>Users can report, like, or mark comments as (Spoilers).</p>
								</li>
								<li className='mb-2'>
									<span className='color-l fw-bold'>Advanced Logic: </span>
									<p>
										Implemented a system that distinguishes between user-flagged and author-flagged spoilers, applying different visual treatments 
										while ensuring the content remains hidden until the user explicitly chooses to view it.
									</p>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

export default About
