import pool from "@/db/connection/pool";

// get all content data in content table
export async function getAllMainContentData (contentID) {
	try {
		const returnObj = {};
		const contentData = await pool.query(`SELECT * FROM content WHERE content_id = $1`, [contentID]);
		if (contentData.rowCount === 0) {
			returnObj.data = null;
		} else {
			returnObj.data = contentData.rows[0];
		}

		const contentGenres = await pool.query(`SELECT * FROM content_genres WHERE content_id = $1`, [contentID]);
		if (contentGenres.rowCount === 0) {
			returnObj.genres = null;
		} else {
			returnObj.genres = contentGenres.rows;
		}
		return returnObj;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get all exist genres for content
export async function getContentGenres (contentID) {
	try {
		const contentGenres = await pool.query(`SELECT * FROM content_genres WHERE content_id = $1`, [contentID]);
		if (contentGenres.rowCount === 0) return null;
		return contentGenres.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get content with filtering from content table
export async function getFilteringContent (page= 1, limit= 10, filter= null) {
	try {
		if (filter === null) {
			const offset = (page - 1) * limit;
			const contents = await pool.query(`SELECT * FROM content ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
				if (contents.rowCount === 0) return {data: [], dataLength: 0};
				const contentsCounts = await pool.query(`SELECT COUNT(*) AS total FROM content`);
			return {data: contents.rows, dataLength: contentsCounts.rows[0].total};
		} else {
			const offset = (page - 1) * limit;
			const {spoiler, report} = filter
			const contents = await pool.query(`SELECT * FROM content 
				WHERE ( $1::int IS NULL OR ($1::int = 1 AND (is_spoiler_by_author = TRUE OR spoiler_reports_count > 0)) OR ( $1::int = 2 AND (is_spoiler_by_author = FALSE AND spoiler_reports_count = 0)) ) AND ( $2::int IS NULL OR ( $2::int = 1 AND abuse_reports_count > 0) OR (
				$2::int = 2 AND abuse_reports_count = 0) )
				ORDER BY created_at DESC, abuse_reports_count DESC LIMIT $3 OFFSET $4`, [spoiler, report, limit, offset]
			);
			if (contents.rowCount === 0) return {data: [], dataLength: 0};
			const contentsCounts = await pool.query(`SELECT COUNT(*) AS total FROM content WHERE ( $1::int IS NULL OR ($1::int = 1 AND 
				(is_spoiler_by_author = TRUE OR spoiler_reports_count > 0)) OR ( $1::int = 2 AND (is_spoiler_by_author = FALSE AND spoiler_reports_count = 0)) )
				AND ( $2::int IS NULL OR ( $2::int = 1 AND abuse_reports_count > 0) OR ($2::int = 2 AND abuse_reports_count = 0) );`, [spoiler, report]
			);
			return {data: contents.rows, dataLength: contentsCounts.rows[0].total};
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

// get content list
export async function getContentListFromArray ( cList ) {
	try {
		const contents = await pool.query(`SELECT content_id, title, poster_url, content_type FROM content WHERE content_id = ANY($1::int[]) 
			ORDER BY created_at DESC `, [cList]
		);
		if (contents.rowCount !== cList.length) return null;
		return contents.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get content have semiler genres
export async function getLikeGenresContent (GList, type, cId) {
	try {
		const genresL = GList.join(", ");
		const contents = await pool.query(`SELECT c.content_id, c.title, c.summary, c.poster_url, c.trailer_url, c.episodes_count, COUNT(cg.genre_id) AS match_count
			FROM content c JOIN content_genres cg ON c.content_id = cg.content_id WHERE  cg.genre_id IN (${genresL}) AND c.content_type = $1 
			AND c.content_id != $2 GROUP BY c.content_id, c.title, c.summary, c.poster_url, c.episodes_count HAVING COUNT(cg.genre_id) > 1 
			ORDER BY match_count DESC, c.release_year DESC;`, [type, cId]
		);
		if (contents.rowCount === 0) return null;
		return contents.rows;
	} catch (error) {
		console.log(error);
		return 0
	}
}

// get rating avg for content list
export async function getContentsRatingAvg (cList) {
	const cIds = cList.join(", ");
	try {
		const ratings = await pool.query(`SELECT content_id, AVG(score) AS avg_rating FROM ratings WHERE content_id IN (${cIds}) GROUP BY content_id;`, 
			[]
		);
		if (ratings.rowCount === 0) return [];
		return ratings.rows;
	} catch (error) {
		console.log(error);
		return 0
	}
}