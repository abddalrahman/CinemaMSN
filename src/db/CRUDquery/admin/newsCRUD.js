import { deleteFile } from "@/utils/recurringFunctions.js";
import pool from "../../connection/pool.js";

// add a new news
export async function addNewNews ( data ) {
	try {
		const {title, body, image_url, is_about_movies, is_about_series, is_about_people} = data
		const addNews = await pool.query(`INSERT INTO news (title, body, image_url, is_about_movies, is_about_series, is_about_people) 
			VALUES ($1, $2, $3, $4, $5, $6) RETURNING news_id`, [title, body, image_url, is_about_movies, is_about_series, is_about_people]);
		if (addNews.rowCount === 0) return 0;
		return addNews.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// update news
export async function EditNewsData ( id, data ) {
	try {
		const keys = Object.keys(data); 
		const values = Object.values(data); 
		let setClause = keys.map((key, index) => `${key}=$${index + 1}`).join(", ");
		setClause += `, updated_at = NOW()`; 
		values.push(id); 
		const query = `UPDATE news SET ${setClause} WHERE news_id=$${keys.length + 1} RETURNING *`;
		const updatedNews = await pool.query(query, values);
		if (updatedNews.rowCount === 0) return null;
		return updatedNews.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// add a new news
export async function deleteNews ( id ) {
	try {
		const deletedN = await pool.query(`DELETE FROM news WHERE news_id =$1  RETURNING *`, [id]);
		if (deletedN.rowCount === 0) return null;
		const newsData = deletedN.rows[0];
    if (newsData.image_url && newsData.image_url.replace("No Data", "").trim() !== "") {
      await deleteFile(newsData.image_url);
    }
    return newsData;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// check if news is exsist
export async function checkNewsIfExist (id) {
	try {
		const newsData = await pool.query(`SELECT * FROM news WHERE news_id = $1`, [id]);
		if (newsData.rowCount === 0) return null;
		return newsData.rows[0];

	} catch (error) {
		console.log(error);
		return 0;
	}
}

// check news content relation exist 
export async function checkNewsContentRelationExist (newsID, contentList) {
	try {
		const relationsExist = await pool.query(`SELECT content_id FROM news_content WHERE news_id = $1 AND content_id = ANY($2::int[])`,
			[newsID, contentList]
		);
		if (relationsExist.rowCount === 0) return null
		return relationsExist.rows;
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// check news people relation exist 
export async function checkNewsPeopleRelationExist (newsID, peopleList) {
	try {
		const relationsExist = await pool.query(`SELECT person_id FROM news_people WHERE news_id = $1 AND person_id = ANY($2::int[])`,
			[newsID, peopleList]
		);
		if (relationsExist.rowCount === 0) return null 
		return relationsExist.rows;

	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get news content relation exist 
export async function getNewsContentRelationExist (newsID) {
	try {
		const relationsExist = await pool.query(`SELECT content_id FROM news_content WHERE news_id = $1`, [newsID]);
		if (relationsExist.rowCount === 0) return null 
		return relationsExist.rows;
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get news people relation exist 
export async function getNewsPeopleRelationExist (newsID) {
	try {
		const relationsExist = await pool.query(`SELECT person_id FROM news_people WHERE news_id = $1`, [newsID]);
		if (relationsExist.rowCount === 0) return null 
		return relationsExist.rows;
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// add to news people relations  -- news_people table
export async function addNewsPeoplR (newsID, peopleL) {
	try {
		const values = [];
		const valuesPlaceholder = peopleL.map((p, i)=> {
			values.push(newsID, p);
			return `($${i * 2 + 1}, $${i * 2 + 2})`;
		}).join(', ');
		const addRelations = await pool.query(`INSERT INTO news_people (news_id, person_id) VALUES ${valuesPlaceholder} RETURNING person_id`, values);
		if (addRelations.rowCount !== peopleL.length) return null;
		return addRelations.rows
		
	} catch (error) {
		console.log(error);
		return 0
	}
}

// add to news content relations  -- news_content table
export async function addNewsContentR (newsID, contentL) {
	try {
		const values = [];
		const valuesPlaceholder = contentL.map((c, i)=> {
			values.push(newsID, c);
			return `($${i * 2 + 1}, $${i * 2 + 2})`;
		}).join(', ');
		const addRelations = await pool.query(`INSERT INTO news_content (news_id, content_id) VALUES ${valuesPlaceholder} RETURNING content_id`, values);
		if (addRelations.rowCount !== contentL.length) return null;
		return addRelations.rows

	} catch (error) {
		console.log(error);
		return 0
	}
}

// delete news relation
export async function deleteNewsRelations (nID, type, cID= null, pID= null) {
	try {
		let deletedRelation = "";
		if (type === "content") {
			deletedRelation = await pool.query(`DELETE FROM news_content WHERE news_id = $1 AND content_id = $2 RETURNING content_id`, [nID, cID]);
		} else if (type === "people") {
			deletedRelation = await pool.query(`DELETE FROM news_people WHERE news_id = $1 AND person_id = $2 RETURNING person_id`, [nID, pID]);
		}
		if (deletedRelation.rowCount === 0) return null;
		return deletedRelation.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}