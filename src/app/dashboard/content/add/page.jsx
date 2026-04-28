import HeadAndText from '@/app/componentes/global/smallComp/HeadAndText'
import AddContentForm from './AddContentForm';
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DomainPath } from '@/utils/DomainPath';

const AddContent = async () => {
	const getCookies = await cookies();
	const token = getCookies.get("jwtToken")?.value;
	if (!token) redirect('/');
	let respons, result = null;
	try {
		respons = await fetchAPIFunc(`${DomainPath}/api/globals/getGenres?type=content_genre`, "GET", {}, token, false, "no-store");
		result = await respons.json();
	} catch (error) {
		console.log(error)
	}

	return (
		<div className='main-container pb-5 pt-120 mb-5'>
			<div className='add-content-page mb-5'>
				<HeadAndText title= "Add Content" text= "Fields marked with an asterisk are required fields; it is recommended to add as much information as possible." />
				<div className='form-container my-5 pb-5'>
					<AddContentForm contentGenres={respons?.status === 200 ? result: null}/>
				</div>
			</div>	
		</div>
	)
}

export default AddContent
