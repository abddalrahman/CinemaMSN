import { getTokenData } from '@/utils/verifyToken';
import { cookies } from 'next/headers'
import React from 'react'
import Navbar from './Navbar';

export const dynamic = 'force-dynamic';

const Header = async () => {
	const cookieStorage = await cookies();
	const jwt = cookieStorage.get("jwtToken")?.value || null;
	const userData = getTokenData(jwt);
	return (
		<header className='position-fixed w-100'>
			<Navbar userID ={userData?.id || false}/>
		</header>
	)
}

export default Header