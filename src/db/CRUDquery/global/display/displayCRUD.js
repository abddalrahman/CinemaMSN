import pool from "@/db/connection/pool";

// get hero content 
export async function getHeroContent () {
	try {
		const queryStr = `
			SELECT DISTINCT ON (c.content_id) c.content_id, c.title, c.summary, c.trailer_url, c.duration_minutes, c.content_type, cm.file_url 
			FROM content c JOIN content_media cm ON c.content_id = cm.content_id WHERE c.c_status = 'upcoming' AND cm.is_featured = TRUE 
			AND (c.trailer_url IS NOT NULL AND c.trailer_url != '') ORDER BY c.content_id, c.release_date DESC LIMIT 3;
		`
		const heroData = await pool.query(queryStr);
		if (heroData.rowCount === 0) return null;
		return heroData.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

//get most populer content
export async function getMostPopulerContent (type, newPopuler= false) {
	try {
		const filterWatch = newPopuler ? `WHERE created_at >= NOW() - INTERVAL '30 days'` : '';
		const queryStr = type !== "MS" ? `
			SELECT c.content_id, c.title, c.summary, c.poster_url, c.trailer_url, c.episodes_count, COALESCE(r.avg_rating, 0) AS average_rating, 
			COALESCE(w.watchlist_count, 0) AS watchlist_count FROM content c LEFT JOIN (SELECT content_id, AVG(score) AS avg_rating FROM ratings GROUP BY 
			content_id) r ON c.content_id = r.content_id LEFT JOIN (SELECT content_id, COUNT(*) AS watchlist_count FROM watchlist ${filterWatch} GROUP BY 
			content_id) w ON c.content_id = w.content_id WHERE c.content_type = $1 AND c.c_status != 'hidden' 
			ORDER BY COALESCE(w.watchlist_count, 0) DESC, c.created_at DESC LIMIT 30;
		`
		:`
			SELECT c.content_id, c.title, c.summary, c.poster_url, c.duration_minutes, c.release_year, c.episodes_count, c.content_type, 
			COALESCE(r.avg_rating, 0) AS average_rating, COALESCE(w.watchlist_count, 0) AS watchlist_count FROM content c 
			LEFT JOIN (SELECT content_id, AVG(score) AS avg_rating FROM ratings GROUP BY content_id) r ON 
			c.content_id = r.content_id LEFT JOIN (SELECT content_id, COUNT(*) AS watchlist_count FROM watchlist ${filterWatch} GROUP BY content_id) w ON
			c.content_id = w.content_id WHERE c.c_status != 'hidden' ORDER BY COALESCE(w.watchlist_count, 0) DESC, c.created_at DESC LIMIT 30;
		`
		const content = type === "MS" ? await pool.query(queryStr) : await pool.query(queryStr, [type]);
		if (content.rowCount === 0) return null;
		return content.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

//get most populer content
export async function getTopRatedContent (type=false, allYear=false) {
	const typeCondition = type ? `WHERE c.content_type = '${type}'` : '';
	const allYearCondition = !allYear ? `${type && allYear ? ' AND ' : ''}WHERE c.release_year = EXTRACT(YEAR FROM CURRENT_DATE)` : '';
	try {
		const content = await pool.query(`SELECT c.content_id, c.title, c.poster_url, c.trailer_url, c.content_type, c.release_year, c.episodes_count,
			COALESCE(AVG(r.score), 0) AS average_rating, COUNT(r.user_id) AS ratings_count FROM content c LEFT JOIN ratings r ON c.content_id = r.content_id
			${typeCondition + allYearCondition} GROUP BY c.content_id, c.title, c.poster_url, c.trailer_url, c.content_type, c.release_year
			ORDER BY average_rating DESC, ratings_count DESC LIMIT ${type || allYear ? 100 : 30 };`
		);
		if (content.rowCount === 0) return null;
		return content.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

//get most populer people
export async function getPopulerPeople (limit= 30) {
	try {
		const people = await pool.query(`SELECT person_id, p_name, image_url FROM people ORDER BY popularity DESC, created_at DESC LIMIT ${limit};`);
		if (people.rowCount === 0) return null;
		return people.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get top News 
export async function getTopNews (page= 1, limit= 10) {
	try {
		const offset = (page - 1) * limit;
    const news = await pool.query(`SELECT n.news_id, n.title, n.body, n.image_url, n.created_at, n.is_about_movies, n.is_about_series, n.is_about_people, 
			COALESCE(s.saved_count, 0) AS saved_count FROM news n
      LEFT JOIN (SELECT news_id, COUNT(*) AS saved_count FROM saved_news GROUP BY news_id) s ON n.news_id = s.news_id
      ORDER BY COALESCE(s.saved_count, 0) DESC, n.created_at DESC LIMIT $1 OFFSET ${offset};`, [limit]);
		const count = await pool.query(`SELECT COUNT(*) AS total FROM news;`);
    if (news.rowCount === 0) return {data: [], dataLength: 0};
    return {data: news.rows, dataLength: Number(count.rows[0].total)};
  } catch (error) {
    console.log(error);
    return 0;
  }
}

// get user reviews 
export async function getUserReviews (uID, limit= null) {
	try {
		const limitStr = limit ? `LIMIT ${limit}` : `OFFSET ${limit}`;
		const reviews = await pool.query(`SELECT c.content_id, c.title, c.poster_url, cm.comment_id, cm.user_id, cm.title AS comment_title, cm.body, 
			cm.created_at, cm.updated_at, cm.likes_count, cm.is_spoiler_by_author, cm.spoiler_reports_count, cm.abuse_reports_count, r.score AS user_rating
			FROM comments cm JOIN content c ON c.content_id = cm.content_id LEFT JOIN ratings r ON r.user_id = cm.user_id AND r.content_id = cm.content_id
			WHERE cm.user_id = $1 ORDER BY cm.created_at DESC ${limitStr};`, [uID]
		);
		const countAll = await pool.query(`SELECT COUNT(*) AS count FROM comments WHERE user_id = $1`, [uID]);
		if (reviews.rowCount === 0) return {data: [], dataLength: 0};
		return {data: reviews.rows, dataLength: Number(countAll.rows[0].count)};
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get user favorite 
export async function getUserFavorite (uID, limit= null) {
	try {
		const limitStr = limit ? `LIMIT ${limit}` : `OFFSET ${limit}`;
		const reviews = await pool.query(`SELECT p.person_id, p.p_name, p.image_url FROM favorite_people fp JOIN people p ON fp.person_id = p.person_id 
			WHERE fp.user_id = $1 ORDER BY fp.created_at DESC ${limitStr};`, [uID]
		);
		const countAll = await pool.query(`SELECT COUNT(*) AS count FROM favorite_people WHERE user_id = $1`, [uID]);
		if (reviews.rowCount === 0) return {data: [], dataLength: 0};
		return {data: reviews.rows, dataLength: Number(countAll.rows[0].count)};
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get all content info with its relations with genres, people, news and media
export async function getAllContentInfoWithRelations (cID) {
	try {
		const allData = await pool.query(`SELECT c.*, COALESCE(m.media, '[]') AS media, COALESCE(g.genres, '[]') AS genres, COALESCE(p.people, '[]') AS 
			people, COALESCE(n.news_ids, '[]') AS news FROM content c LEFT JOIN LATERAL (SELECT json_agg( json_build_object('url', file_url, 'type', media_type,
			'is_featured', is_featured)) AS media FROM content_media WHERE content_id = c.content_id) m ON TRUE
			LEFT JOIN LATERAL (SELECT json_agg(genre_id) AS genres FROM content_genres WHERE content_id = c.content_id) g ON TRUE
			LEFT JOIN LATERAL (SELECT json_agg(json_build_object('person_id', person_id, 'role_genre_id', role_genre_id, 'is_lead', is_lead)) AS people
    	FROM content_people WHERE content_id = c.content_id) p ON TRUE
			LEFT JOIN LATERAL (SELECT json_agg(news_id) AS news_ids FROM news_content WHERE content_id = c.content_id) n ON TRUE WHERE c.content_id = $1;`
		, [cID]);
		if (allData.rowCount === 0) return null;
		return allData.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get all rating for a content
export async function getContentRatings (cID) {
	try {
		const allRatings = await pool.query(`SELECT user_id, score FROM ratings WHERE content_id = $1;`, [cID]);
		if (allRatings.rowCount === 0) return [];
		return allRatings.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get all reviews for a content
export async function getContentReviews (cID, limited= false) {
	try {
		const allRatings = await pool.query(`SELECT c.comment_id, c.user_id, u.username, u.profile_image_url, c.title, c.body, c.created_at, c.updated_at, 
			c.likes_count, c.is_spoiler_by_author, c.spoiler_reports_count, c.abuse_reports_count, r.score AS rating_score FROM comments c
			JOIN users u ON c.user_id = u.user_id LEFT JOIN ratings r ON c.user_id = r.user_id AND c.content_id = r.content_id WHERE c.content_id = $1
			ORDER BY c.created_at DESC ${limited ? "LIMIT 5" : ""};`, [cID]
		);
		if (allRatings.rowCount === 0) return [];
		return allRatings.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get peoples names and roles
export async function getPeopleNamesAndRolesData (pIDs, rIDs) {
	try {
		const getNames = await pool.query(`SELECT person_id, p_name FROM people WHERE person_id = ANY($1::int[])`, [pIDs]);
		const getRoles = await pool.query(`SELECT genre_id, name FROM genres WHERE genre_id = ANY($1::int[])`, [rIDs]);
		if (getNames.rowCount !== pIDs.length || getRoles.rowCount !== rIDs.length) return null;
		const objToReturn = {
			names: getNames.rows,
			roles: getRoles.rows
		}
		return objToReturn;
	} catch (error) {
		console.log(error)
		return 0;
	}
}

// get related news
export async function getRelatedNews (id, relatedWith) {
	try {
		if (relatedWith === "content") {
			const newsData = await pool.query(`SELECT * FROM news WHERE news_id IN (SELECT news_id FROM news_content WHERE content_id = $1);`, [id]);
			if (newsData.rowCount === 0) return null;
			return newsData.rows;
		} else if (relatedWith === "person") {
			const newsData = await pool.query(`SELECT * FROM news WHERE news_id IN (SELECT news_id FROM news_people WHERE person_id = $1);`, [id]);
			if (newsData.rowCount === 0) return null;
			return newsData.rows;
		} else {
			return null;
		}
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get person data with its ranking
export async function getPersonDataWithRanking (uID) {
	try {
		const personData = await pool.query(`SELECT * FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY popularity DESC, birth_date DESC) AS rank_position
    	FROM people) ranked WHERE person_id = $1;`, [uID]
		);
		if (personData.rowCount === 0) return null;
		return personData.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get person content with his role
export async function getPersonContents (id) {
	try {
		const data = await pool.query(`SELECT c.content_id, c.title, c.poster_url, c.release_year, c.duration_minutes, c.season_number, c.episodes_count,
			c.content_type, cp.role_genre_id, cp.is_lead, COALESCE(r.average_rating, 0) AS average_rating FROM content c JOIN content_people cp 
			ON c.content_id = cp.content_id LEFT JOIN (SELECT content_id, AVG(score) AS average_rating FROM ratings GROUP BY content_id) r 
			ON c.content_id = r.content_id WHERE cp.person_id = $1;`, [id]
		);
		if (data.rowCount === 0) return null;
		return data.rows;

	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get contents list popularity
export async function getContentsListPopularity (cList) {
	try {
		const data = await pool.query(`SELECT t.content_id, COUNT(w.user_id) AS popularity FROM UNNEST($1::int[]) WITH ORDINALITY AS t(content_id, ord)
			LEFT JOIN watchlist w ON w.content_id = t.content_id GROUP BY t.content_id, t.ord ORDER BY popularity DESC;`, [cList]
		);
		if (data.rowCount !== cList.length) return 0;
		return data.rows;

	} catch (error) {
		console.log(error);
		return 0;
	}
}

export async function geteopleGenres(id) {
	try {
		const genres = await pool.query(`SELECT gp.genre_id, g.name FROM people_genres gp LEFT JOIN genres g ON gp.genre_id = g.genre_id
			WHERE gp.person_id = $1;`, [id]
		);
		if(genres.rowCount === 0) return null;
		return genres.rows;
	} catch (error) {
		console.log(error);
		return false;
	}
}

// get content to display with filtering
export async function getContentFilteredToDisplay (page= 1, limit= 10, filter= null) {
	try {
		if (filter === null) {
			const offset = (page - 1) * limit;
			const contents = await pool.query(`SELECT c.content_id, c.title, c.poster_url, c.trailer_url, c.c_status, c.created_at, c.content_type, 
				COALESCE(r.average_rating, 0) AS average_rating FROM content c LEFT JOIN LATERAL (SELECT AVG(score) AS average_rating FROM ratings r 
				WHERE r.content_id = c.content_id) r ON TRUE ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]
			);
			const contentCounts = await pool.query(`SELECT COUNT(*) AS total FROM content`);
			return {data: contents.rowCount === 0 ? [] : contents.rows, dataLength: Number(contentCounts.rows[0].total)};
		} else {
			const offset = (page - 1) * limit;
			const {year, type, genre} = filter
			const contents = await pool.query(`SELECT c.content_id, c.title, c.poster_url, c.trailer_url, c.c_status, c.created_at, c.content_type, 
				COALESCE(r.average_rating, 0) AS average_rating FROM content c LEFT JOIN LATERAL (SELECT AVG(score) AS average_rating FROM ratings r 
				WHERE r.content_id = c.content_id) r ON TRUE WHERE ($1::int IS NULL OR c.release_year = $1::int) AND 
				($2::text IS NULL OR c.content_type = $2::text) AND 
				($3::int IS NULL OR EXISTS (SELECT 1 FROM content_genres cg WHERE cg.content_id = c.content_id AND cg.genre_id = $3::int)) 
				ORDER BY c.created_at DESC LIMIT $4 OFFSET $5;`, [year, type, genre, limit, offset]
			);
			
			const contentCounts = await pool.query(`SELECT COUNT(*) AS total FROM content c WHERE ($1::int IS NULL OR c.release_year = $1::int) AND 
				($2::text IS NULL OR c.content_type = $2::text) AND 
				($3::int IS NULL OR EXISTS (SELECT 1 FROM content_genres cg WHERE cg.content_id = c.content_id AND cg.genre_id = $3::int));`, 
				[year, type, genre]
			);
			return {data: contents.rowCount === 0 ? [] :contents.rows, dataLength: Number(contentCounts.rows[0].total)};
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

// get users profiles images and names from a list
export async function getUserMInfoFromIdsList (IDsList) {
	try {
		const usersData = await pool.query(`SELECT user_id, username, profile_image_url FROM users WHERE user_id = ANY($1::int[])`, [IDsList]);
		if (usersData.rowCount !== IDsList.length) return null;
		return usersData.rows;
	} catch (error) {
		console.log(error);
		return null;
	}
}