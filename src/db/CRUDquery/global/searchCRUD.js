import pool from "@/db/connection/pool";

export async function searchContentNewsPeople (title, about) {
	try {
		let allData = {
			people: [],
			contents: [],
			news: [],
		}
		if (about.people) {
			const people = await pool.query(`SELECT person_id, p_name, image_url FROM people WHERE p_name ILIKE  '%' || $1::text || '%' `, [title]);
			if (people.rowCount === 0) {
				allData.people=[];
			} else {
				allData.people = people.rows;
			}
		}
		if (about.content) {
			const content = await pool.query(`SELECT content_id, title, poster_url, content_type FROM content WHERE title ILIKE  '%' || $1::text || '%' `, [title]);
			if (content.rowCount === 0) {
				allData.contents=[];
			} else {
				allData.contents = content.rows;
			}
		}
		if (about.news) {
			const news = await pool.query(`SELECT news_id, title, image_url FROM news WHERE title ILIKE  '%' || $1::text || '%' `, [title]);
			if (news.rowCount === 0) {
				allData.news=[];
			} else {
				allData.news = news.rows;
			}
		}
		return allData;
	} catch (error) {
		console.log(error);
		return 0;
	}
}