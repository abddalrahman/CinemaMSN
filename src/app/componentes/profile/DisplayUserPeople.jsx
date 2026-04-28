"use client"
import React, { useEffect, useState } from 'react'
import SectionTitle from '../global/smallComp/SectionTitle'
import { fetchAPIFunc } from '@/utils/clientRandomFunc';
import PersonCard from '../global/PersonCard';
import { Spinner } from 'react-bootstrap';
import { DomainPath } from '@/utils/DomainPath';

const DisplayUserPeople = ({ data }) => {
	const { id, myP, isPrivate } = data;
	const [favorites, setFavorites] = useState({
		data: null,
		dLength: 0
	})
	const [loading, setLoading] = useState(false)

	const getUserFavoritesData = async (limit= null) => {
		try {
			setLoading(true);
			const respons = await fetchAPIFunc(`${DomainPath}/api/users/profile/getFavorite?id=${id}${limit ? "&limited=t": ""}`, "GET", {});
			const result = await respons.json();
			if (respons.status === 200) {
				setFavorites({
					data: result.data,
					dLength: result.dataLength
				});
				setLoading(false);
			} else {
				setFavorites({
					data: undefined,
					dLength: 0
				});
				setLoading(false);
			}
			
		} catch (error) {
			console.log(error);
			setFavorites({
				data: undefined,
				dLength: 0
			});
			setLoading(false);
		}
	}

	useEffect(() => {
		const run = async () => {
			await getUserFavoritesData(true);
		}
		run();
	}, [])

	return (
		<>
			<div className='mb-5 pb-5'>
				<div className='d-flex align-items-center gap-4'>
					<SectionTitle title={"Favorite people"} inHead={favorites.dLength}/>
					<span className='color-y mb-4 fw-semibold'>{isPrivate ? "Private" : "Public"}</span>
				</div>
				<div className='row favorites people-cards'>
					{
						!loading && favorites.data !== null
						?
							favorites.data !== undefined
							?
								favorites.data.length > 0
								?
									favorites.data.map((person) => (
										<PersonCard key={person.person_id} data={{id: person.person_id , pName: person.p_name, image: person.image_url, favorite: true, 
											updateFavorite: getUserFavoritesData, style: "col-6 col-sm-4 col-md-3", myProfile: myP}}
										/>
									))
								:
									<div className='b-g-d3 rounded-1 p-3 color-l'>
										No Favorites Yet
									</div>
							:
								<div className='p-3 color-l rounded-1 b-g-d3'>
									Failed To Get Data
								</div>
						:
						<div className='d-flex align-items-center justify-content-center p-5'>
							<Spinner animation="border" variant="danger" />
						</div>
					}
				</div>
			</div>
			{
				!loading
				?
					favorites.data && favorites.data.length <= 20 && favorites.dLength > 20
					?
						<div className='d-flex align-items-center justify-content-center my-5'>
							<button className='see-all-btn borderd-link px-3 py-2' onClick={() => getUserFavoritesData(null)}>Show All</button>
						</div>
					:
						favorites.data && favorites.data.length > 20
						?
							<div className='d-flex align-items-center justify-content-center my-5'>
								<button className='see-all-btn borderd-link px-3 py-2' onClick={() => getUserFavoritesData(true)}>Show Less</button>
							</div>
						:''
				:''
			}
		</>
	)
}

export default DisplayUserPeople
