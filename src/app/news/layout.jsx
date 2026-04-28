export const metadata = {
	title: 'CinemaMSN - News',
	description: `Stay updated with the latest breaking news from the world of cinema. Exclusive updates on upcoming movies, 
		celebrity news, and industry insights only on CinemaMSN.`,
	openGraph: {
		title: 'News - CinemaMSN',
		description: `Stay updated with the latest breaking news from the world of cinema. Exclusive updates on upcoming movies, 
		celebrity news, and industry insights only on CinemaMSN.`,
		type: 'article',
	},
}

export default function NewsLayout({ children }) {
  return (
    <>
			{
				children
			}
		</>
  );
}