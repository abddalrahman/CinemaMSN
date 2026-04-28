import pool from "@/db/connection/pool";

export async function getStatistic () {
	try {
		const statistic = await pool.query(`SELECT (SELECT COUNT(*) FROM users) AS total_users, (SELECT COUNT(*) FROM people) AS total_people, 
			(SELECT COUNT(*) FROM content) AS total_content, (SELECT COUNT(*) FROM news) AS total_news;`);
		if (statistic.rowCount === 0) return null;
		return statistic.rows[0];

	} catch (error) {
		console.log(error);
		return null;
	}
}

// get main data from content table
export async function getMainConetntInfo (page= 1, limit= 10, filter= null) {
	try {
		if (filter === null) {
			const offset = (page - 1) * limit;
			const contents = await pool.query(`SELECT content_id, title, poster_url, release_date, c_status, created_at, content_type FROM content 
				ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
				if (contents.rowCount === 0) return {data: [], dataLength: 0};
				const contentCounts = await pool.query(`SELECT COUNT(*) AS total FROM content`);
			return {data: contents.rows, dataLength: contentCounts.rows[0].total};
		} else {
			const offset = (page - 1) * limit;
			const {year, status, type, genre, title} = filter
			const contents = await pool.query(`SELECT c.content_id, c.title, c.poster_url, c.c_status, c.created_at, c.content_type FROM content c 
				WHERE ($1::int IS NULL OR c.release_year = $1::int) AND ($2::text IS NULL OR c.c_status = $2::text) AND 
				($3::text IS NULL OR c.content_type = $3::text) AND ($4::int IS NULL OR EXISTS 
				( SELECT 1 FROM content_genres cg WHERE cg.content_id = c.content_id AND cg.genre_id = $4::int )) AND 
				($5::text IS NULL OR c.title ILIKE  '%' || $5::text || '%') ORDER BY created_at DESC LIMIT $6 OFFSET $7`,
				[year, status, type, genre, title, limit, offset]);
			if (contents.rowCount === 0) return {data: [], dataLength: 0};
			const contentCounts = await pool.query(`SELECT COUNT(*) AS total FROM content c WHERE ($1::int IS NULL OR c.release_year = $1::int) AND 
				($2::text IS NULL OR c.c_status = $2::text) AND ($3::text IS NULL OR c.content_type = $3::text) AND 
				($4::int IS NULL OR EXISTS ( SELECT 1 FROM content_genres cg WHERE cg.content_id = c.content_id AND cg.genre_id = $4::int )) AND
				($5::text IS NULL OR c.title ILIKE  '%' || $5::text || '%');`, 
				[year, status, type, genre, title]);
			return {data: contents.rows, dataLength: contentCounts.rows[0].total};
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

// get main data from people table
export async function getMainPeopleInfo (page= 1, limit= 10) {
	try {
		const offset = (page - 1) * limit;
		const people = await pool.query(`SELECT person_id, p_name, image_url, birth_date, popularity, created_at FROM people 
			ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
		if (people.rowCount === 0) return [];
		return people.rows;

	} catch (error) {
		console.log(error);
		return null;
	}
}

// get filtering people 
export async function getFilteringPeople (page= 1, limit= 10, filterName= null) {
	try {
		const offset = (page - 1) * limit;
		if (filterName === null) {
			const people = await pool.query(`SELECT person_id, p_name, image_url, birth_date, popularity, created_at FROM people 
				ORDER BY popularity DESC LIMIT $1 OFFSET $2`, [limit, offset]
			);
			if (people.rowCount === 0) return {data: [], dataLength: 0};
			const peopleCounts = await pool.query(`SELECT COUNT(*) AS total FROM people`);
			return {data: people.rows, dataLength: peopleCounts.rows[0].total};
			
		} else {
			const people = await pool.query(`SELECT person_id, p_name, image_url, birth_date, popularity, created_at FROM people 
				WHERE p_name ILIKE '%' || $1::text || '%' ORDER BY popularity DESC LIMIT $2 OFFSET $3`, [filterName, limit, offset]
			);
			if (people.rowCount === 0) return {data: [], dataLength: 0};
			const peopleCounts = await pool.query(`SELECT COUNT(*) AS total FROM people WHERE p_name ILIKE '%' || $1::text || '%'`, [filterName]);
			return {data: people.rows, dataLength: peopleCounts.rows[0].total};
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

// 
export async function getReportedComments (page= 1, limit= 10) {
	try {
		const offset = (page - 1) * limit;
		const comments = await pool.query(`SELECT comment_id, user_id, content_id, title, body, created_at, abuse_reports_count FROM comments WHERE 
			abuse_reports_count > 0 ORDER BY abuse_reports_count DESC LIMIT $1 OFFSET $2`, [limit, offset]);
		if (comments.rowCount === 0) return [];
		return comments.rows;

	} catch (error) {
		console.log(error);
		return null;
	}
}

// get main data from users table
export async function getMainUserInfo (page= 1, limit= 10, filter= null) {
	try {
		if (filter === null) {
			const offset = (page - 1) * limit;
			const users = await pool.query(`SELECT user_id, username, bio, profile_image_url, email, u_role, u_status FROM users 
				ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
				if (users.rowCount === 0) return {data: [], dataLength: 0};
				const usersCounts = await pool.query(`SELECT COUNT(*) AS total FROM users`);
			return {data: users.rows, dataLength: usersCounts.rows[0].total};
		} else {
			const offset = (page - 1) * limit;
			const {role, uStatus, userNameEmail} = filter
			const users = await pool.query(`SELECT user_id, username, bio, profile_image_url, email, u_role, u_status FROM users 
				WHERE ($1::text IS NULL OR u_role = $1::text) AND ($2::text IS NULL OR u_status = $2::text) AND 
				($3::text IS NULL OR username ILIKE '%' || $3::text || '%' OR email ILIKE '%' || $3::text || '%')
				ORDER BY created_at DESC LIMIT $4 OFFSET $5`,
				[role, uStatus, userNameEmail, limit, offset]);
			if (users.rowCount === 0) return {data: [], dataLength: 0};
			const usersCounts = await pool.query(`SELECT COUNT(*) AS total FROM users WHERE ($1::text IS NULL OR u_role = $1::text) AND 
				($2::text IS NULL OR u_status = $2::text) AND 
				($3::text IS NULL OR username ILIKE '%' || $3::text || '%' OR email ILIKE '%' || $3::text || '%') ;`, 
				[role, uStatus, userNameEmail]);
			return {data: users.rows, dataLength: usersCounts.rows[0].total};
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

// get data with filtering from genres table
export async function getGenresWithFiltering (page= 1, limit= 10, filter= null) {
	try {
		if (filter === null) {
			const offset = (page - 1) * limit;
			const genres = await pool.query(`SELECT * FROM genres ORDER BY kind DESC, name DESC LIMIT $1 OFFSET $2`, [limit, offset]);
				if (genres.rowCount === 0) return {data: [], dataLength: 0};
				const genresCounts = await pool.query(`SELECT COUNT(*) AS total FROM genres`);
			return {data: genres.rows, dataLength: genresCounts.rows[0].total};
		} else {
			const offset = (page - 1) * limit;
			const {gKind, gName} = filter
			const genres = await pool.query(`SELECT * FROM genres 
				WHERE ($1::text IS NULL OR kind = $1::text) AND ($2::text IS NULL OR name ILIKE '%' || $2::text || '%')
				ORDER BY kind DESC, name DESC LIMIT $3 OFFSET $4`, [gKind, gName, limit, offset]
			);
			if (genres.rowCount === 0) return {data: [], dataLength: 0};
			const genresCounts = await pool.query(`SELECT COUNT(*) AS total FROM genres WHERE ($1::text IS NULL OR kind = $1::text) 
				AND ($2::text IS NULL OR name ILIKE '%' || $2::text || '%');`, [gKind, gName]
			);
			return {data: genres.rows, dataLength: genresCounts.rows[0].total};
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

// get comments with filtering from comments table
export async function getCommentsWithFiltering (page= 1, limit= 10, filter= null) {
	try {
		if (filter === null) {
			const offset = (page - 1) * limit;
			const comments = await pool.query(`SELECT * FROM comments ORDER BY created_at DESC, abuse_reports_count DESC LIMIT $1 OFFSET $2`, [limit, offset]);
				if (comments.rowCount === 0) return {data: [], dataLength: 0};
				const commentsCounts = await pool.query(`SELECT COUNT(*) AS total FROM comments`);
			return {data: comments.rows, dataLength: commentsCounts.rows[0].total};
		} else {
			const offset = (page - 1) * limit;
			const {spoiler, report} = filter
			const comments = await pool.query(`SELECT * FROM comments 
				WHERE ( $1::int IS NULL OR ($1::int = 1 AND (is_spoiler_by_author = TRUE OR spoiler_reports_count > 0)) OR ( $1::int = 2 AND (is_spoiler_by_author = FALSE AND spoiler_reports_count = 0)) ) AND ( $2::int IS NULL OR ( $2::int = 1 AND abuse_reports_count > 0) OR (
				$2::int = 2 AND abuse_reports_count = 0) )
				ORDER BY created_at DESC, abuse_reports_count DESC LIMIT $3 OFFSET $4`, [spoiler, report, limit, offset]
			);
			if (comments.rowCount === 0) return {data: [], dataLength: 0};
			const commentsCounts = await pool.query(`SELECT COUNT(*) AS total FROM comments WHERE ( $1::int IS NULL OR ($1::int = 1 AND 
				(is_spoiler_by_author = TRUE OR spoiler_reports_count > 0)) OR ( $1::int = 2 AND (is_spoiler_by_author = FALSE AND spoiler_reports_count = 0)) )
				AND ( $2::int IS NULL OR ( $2::int = 1 AND abuse_reports_count > 0) OR ($2::int = 2 AND abuse_reports_count = 0) );`, [spoiler, report]
			);
			return {data: comments.rows, dataLength: commentsCounts.rows[0].total};
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

// get data with filtering from news table
export async function getfilteringNews (page= 1, limit= 10, filter= null) {
	try {
		if (filter === null) {
			const offset = (page - 1) * limit;
			const news = await pool.query(`SELECT * FROM news ORDER BY created_at DESC, title DESC LIMIT $1 OFFSET $2`, [limit, offset]);
				if (news.rowCount === 0) return {data: [], dataLength: 0};
				const newsCounts = await pool.query(`SELECT COUNT(*) AS total FROM news`);
			return {data: news.rows, dataLength: newsCounts.rows[0].total};
		} else {
			const offset = (page - 1) * limit;
			let {about, TBtext} = filter
			// let aboutIs = "";
			if (about?.toLowerCase() === "m") {
				about = "is_about_movies = TRUE AND is_about_series = FALSE AND is_about_people = FALSE";
			} else if (about?.toLowerCase() === "s") {
				about = "is_about_series = TRUE AND is_about_movies = FALSE AND is_about_people = FALSE";
			} else if (about?.toLowerCase() === "p") {
				about = "is_about_people = TRUE AND is_about_movies = FALSE AND is_about_series = FALSE";
			}else if (about?.toLowerCase() === "ms") {
				about = "is_about_movies = TRUE AND is_about_series = TRUE AND is_about_people = FALSE";
			} else if (about?.toLowerCase() === "mp") {
				about = "is_about_movies = TRUE AND is_about_people = TRUE AND is_about_series = FALSE";
			} else if (about?.toLowerCase() === "sp") {
				about = "is_about_series = TRUE AND is_about_people = TRUE AND is_about_movies = FALSE";
			} else if (about?.toLowerCase() === "msp") {
				about = "is_about_movies = TRUE AND is_about_series = TRUE AND is_about_people = TRUE";
			} else {
				about = null;
			}

			let whereClause = ""; 
			if (about) { 
				whereClause = `(${about})`; 
			} else { 
				whereClause = `TRUE`; 
			}

			const news = await pool.query(`SELECT * FROM news 
				WHERE ${whereClause} AND ($1::text IS NULL OR title ILIKE '%' || $1::text || '%' OR body ILIKE '%' || $1::text || '%')
				ORDER BY created_at DESC, title DESC LIMIT $2 OFFSET $3`, [TBtext, limit, offset]
			);
			const newsCounts = await pool.query(`SELECT COUNT(*) AS total FROM news WHERE ${whereClause} AND 
				($1::text IS NULL OR title ILIKE '%' || $1::text || '%' OR body ILIKE '%' || $1::text || '%');`, [TBtext]
			);
			if (news.rowCount === 0) return {data: [], dataLength: newsCounts.rows[0].total};
			return {data: news.rows, dataLength: newsCounts.rows[0].total};
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}