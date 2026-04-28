export const metadata = {
	title: 'CinemaMSN - Content',
	description: `Explore CinemaMSN content. Discover movie, series, genres, and more.`,
	openGraph: {
		title: 'Content - CinemaMSN',
		description: 'Explore CinemaMSN content. Discover movie, series, genres, and more.',
		type: 'website',
	},
}

export default function ContentLayout({ children }) {
  return (
    <>
			{
				children
			}
		</>
  );
}