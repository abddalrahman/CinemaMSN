"use cleint"
import { calcAge, fetchAPIFunc } from '@/utils/clientRandomFunc'
import { DomainPath } from '@/utils/DomainPath';
import { useState } from 'react';
import { BsBookmark, BsBookmarkCheckFill } from "react-icons/bs";
import { toast } from 'react-toastify';

const NewsBigCard = ({data, getSavedAgain, savedNews}) => {
	const [loading, setLoading] = useState(false);
	const saveAndDeleteNews = async () => {
		try {
			setLoading(true);
			const dataToSend = {news_id: Number(data.news_id)};
			const respons = await fetchAPIFunc(`${DomainPath}/api/users/activity/userNews`, "POST", dataToSend);
			const result = await respons.json();
			if (respons.status === 201 || respons.status === 200) {
				toast.success(result.message);
				setLoading(false);
				await getSavedAgain();
			} else {
				toast.error(result.message);
				setLoading(false);
			}
			return;
		} catch (error) {
			console.log(error);
			setLoading(false);
			return
		}
	};

	return (
		<div className='news-details mb-5 pb-4'>
			<div className='d-flex gap-4 flex-column flex-sm-row'>
				<h1 className='color-l fs-xl d-block d-sm-none'>{data.title}</h1>
				{
					data.image_url && data.image_url.replace("No Data", "") !== ""
					?
						<img src={data.image_url} alt={data.title} className='rounded-1' />
					:''
				}
				<div className='d-flex flex-column justify-content-between'>
					<h1 className='color-l fs-xl d-none d-sm-block'>{data.title}</h1>
					<div className='color-dg d-flex align-items-center justify-content-between small'> 
						<div className='d-flex align-items-center gap-2'>
							<span>Published At:</span>{calcAge(data.created_at)}
						</div>
						<div className='d-flex align-items-center gap-2'>
							<span>Last Update:</span>{calcAge(data.updated_at)}
						</div>
					</div>
				</div>
			</div>
			<p className='mt-4 color-g fw-semibold fs-main'>{data.body}</p>
			<button className={`main-red-btn d-flex align-items-center gap-2 py-2 px-4 ${loading ? "disabled" : ""}`} onClick={saveAndDeleteNews}>
				{
					savedNews.includes(Number(data.news_id)) 
					?
						<>
							<BsBookmarkCheckFill size={18}/>
							<span>REMOVE</span>
						</>
					:
						<>
							<BsBookmark size={18}/>
							<span>SAVE</span>
						</>
				}
			</button>
		</div>
	)
}

export default NewsBigCard
