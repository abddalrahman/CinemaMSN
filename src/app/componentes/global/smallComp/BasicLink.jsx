import Image from 'next/image';
import Link from 'next/link';
import React from 'react'


const BasicLink = ({data}) => {
	
	if (data?.typeIs === "btn") {
		return (	
			<button className={data?.styling || ''} onClick={data?.func || null}>
				{
					data?.image
					?
						<Image src={data.image} alt={data?.altText || ''} width={100} height={30} priority/>
					:
						data?.icon
						?
							<>
								<data.icon color={data?.color ? data.color : "#fff"} size={data?.size ? data.size : 16} className="me-2"/>
								{
									data?.label ? <span>{data.label}</span> : ''
								}
							</>
						:
							data.text || ''
				}
			</button>
		)
	}

	return (	
		<Link href={data.To} className={data?.styling || ''} onClick={data?.func || null}>
			{
				data?.image
				?
					<Image src={data.image} alt={data?.altText || ''} width={100} height={30} priority/>
				:
					data?.icon
					?
						<>
							<data.icon color={data?.color ? data.color : "#fff"} size={data?.size ? data.size : 16} className="me-2"/>
							{
								data?.label ? <span>{data.label}</span> : ''
							}
						</>
					:
						data.text || ''
			}
		</Link>
	)
}

export default BasicLink
