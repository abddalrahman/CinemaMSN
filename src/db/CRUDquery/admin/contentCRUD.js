import { deleteFile } from "@/utils/recurringFunctions.js";
import pool from "../../connection/pool.js";

// add new content
export async function addNewContent ( data ) {
	try {
		const ObjKeys = Object.keys( data );
		const ObjValues = Object.values( data );
		const placeholderValues = ObjKeys.map((_, i) => `$${i+1}`).join(', ');
		const newContent = await pool.query(`INSERT INTO content (${ObjKeys.join(', ')}) VALUES (${placeholderValues}) RETURNING content_id`, ObjValues);
		if (newContent.rowCount === 0) return 0;
		return newContent.rows[0];
		
	} catch (error) {
		console.log(error); 
		return 0;
	}
}

// delete content
export async function DeleteContent ( id ) {
	try {	
		const mediaImages = await pool.query(`SELECT file_url FROM content_media WHERE content_id = $1`,[id]);
		const deletedContent = await pool.query(`DELETE FROM content WHERE content_id = $1 RETURNING poster_url, trailer_url`, [id]);
		if (deletedContent.rowCount === 0) return 0;
		const mainFiles = deletedContent.rows[0];
    const extraImages = mediaImages.rows;
		const allUrls = [];
		if (mainFiles.poster_url) allUrls.push(mainFiles.poster_url);
    if (mainFiles.trailer_url) allUrls.push(mainFiles.trailer_url);
		extraImages.forEach(img => {if (img.file_url) allUrls.push(img.file_url);});

		const deletePromises = allUrls.map(url => {
      if (url && url.replace("No Data", "").trim() !== "") {
        return deleteFile(url);
      }
      return Promise.resolve();
    });

    await Promise.all(deletePromises);
		return deletedContent.rows[0]; 
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// update content
export async function UpdateContent ( id, data ) {
	try {
		const keys = Object.keys(data); 
		const values = Object.values(data); 
		let setClause = keys.map((key, index) => `${key}=$${index + 1}`).join(", "); 
		setClause += `, updated_at = NOW()`;
		values.push(id); 
		const query = `UPDATE content SET ${setClause} WHERE content_id=$${keys.length + 1} RETURNING *`; 
		const updatedCotent = await pool.query(query, values);
		if (updatedCotent.rowCount === 0) return null;
		return updatedCotent.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// add content genres -- content_genres table
export async function addContentGenres(id, genres) {
	try {
		const values = [];
		const valuesPlaceholder = genres.map((g, i)=> {
			values.push(id, g);
			return `($${i * 2 + 1}, $${i * 2 + 2})`;
		}).join(', ');
		const contentGenres = await pool.query(`INSERT INTO content_genres (content_id, genre_id) VALUES ${valuesPlaceholder} RETURNING *`, values);
		if(contentGenres.rowCount !== genres.length) return false;
		return true;
		
	} catch (error) {
		console.log(error);
		return false;
	}
}

// delete content genres -- content_genres table
export async function deleteContentGenres(id, genres) {
	try {
		const deletedG = await pool.query(`DELETE FROM content_genres WHERE content_id=$1 AND genre_id = ANY($2::int[]) RETURNING genre_id`, [id, genres]);
		if (deletedG.rowCount !== genres.length) return 0;
		return deletedG.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// add content people -- content_people table
export async function addContentPeople (cID, peopleData) { // [{22, 2, T}, {23, 12, f}]
	try {
		const values = [];
		const valuesPlaceholder = peopleData.map((obj, i) => {
			values.push(obj.people_id, cID, obj.role_id, obj.is_lead);
			return `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`;
		}).join(', ');
		const addConnention = await pool.query(`INSERT INTO content_people (person_id ,content_id ,role_genre_id ,is_lead)
			VALUES ${valuesPlaceholder} RETURNING content_id`, values);
		if (addConnention.rowCount !== peopleData.length) return false;
		return true;
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get content people -- content_people table
export async function getContentPeople (contentID) {
	try {
		const cPeople = await pool.query(`SELECT cp.*, p.p_name, p.image_url FROM content_people cp JOIN people p ON 
			cp.person_id = p.person_id WHERE cp.content_id = $1;`, [contentID]
		);
		if (cPeople.rowCount === 0) return [];
		return cPeople.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// delete content people relation
export async function deleteCastMemeber (p_id, c_id, r_id) {
	try {
		const deletedMember = await pool.query(`DELETE FROM content_people WHERE person_id = $1 AND content_id = $2 AND role_genre_id = $3 
			RETURNING person_id`, [p_id, c_id, r_id]
		);
		if(deletedMember.rowCount === 0) return null;
		return deletedMember.rows;

	} catch (error) {
		console.log(error);
		return 0;
	}
}

// check if content exist
export async function checkIfContentExist (id) {
	try {
		const isExist = await pool.query(`SELECT * FROM content WHERE content_id = $1`, [id]);
		if (isExist.rowCount === 0) return 0;
		return isExist.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// check content list if exist
export async function checkContentList (CList, type) {
	try {
		let contentInfo;
		if (type === null) {
			contentInfo = await pool.query(`SELECT content_id FROM content WHERE content_id = ANY($1::int[])`, [CList]);
		}else {
			contentInfo = await pool.query(`SELECT content_id FROM content WHERE content_id = ANY($1::int[]) AND content_type = $2`, [CList, type]);
		}
		if(contentInfo.rowCount !== CList.length) return 0;
		
		return contentInfo.rows.length;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// add images for contetn -- content_media table
export async function addContentImages (id, files) {
	try {
		const values = [];
		const valuesPlaceholder = files.map((obj, i) => {
			values.push(id, obj.imageURL, 'image', obj.isFeatured);
			return `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`;
		}).join(', ');
		const imagesAdded  = await pool.query(`INSERT INTO content_media (content_id, file_url, media_type, is_featured) 
			VALUES ${valuesPlaceholder}`, values);
		if (imagesAdded.rowCount !== files.length) return false;
		return true;

	} catch (error) {
		console.log(error);
		return false;
	}
}
// get content images
export async function getContentImages (contentID, featured= false) {
	try {
		if (!featured) {
			const images = await pool.query(`SELECT media_id, file_url, is_featured FROM content_media WHERE content_id = $1`, [contentID]);
			if (images.rowCount === 0) return [];
			return images.rows;
		} else {
			const images = await pool.query(`SELECT media_id, file_url, is_featured FROM content_media WHERE content_id = $1 AND is_featured = TRUE`, 
				[contentID]
			);
			if (images.rowCount === 0) return 0;
			return images.rows;
		}
	} catch (error) {
		console.log(error);
		return 0;
	}
}
// delete content images [one or more]
export async function deleteContetnImges (IDs) {
	try {	
		const deletedImages = await pool.query(`DELETE FROM content_media WHERE media_id = ANY($1::int[]) RETURNING file_url`, [IDs]);
		if (deletedImages.rowCount === 0) return 0;
		const rows = deletedImages.rows;
    const deletePromises = rows.map(row => {
      if (row.file_url) {
        return deleteFile(row.file_url);
      }
      return Promise.resolve();
    });
    await Promise.all(deletePromises);
    return rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// check if content award exist -- content_awards TABLE
export async function CheckIfContentAwardExist (cID, aID, date) {
	try {
		const award = await pool.query(`SELECT * FROM content_awards WHERE content_id = $1 AND genre_id = $2 AND awarded_at = $3`, [cID, aID, date]);
		if (award.rowCount > 0) return null;
		return true;
		
	} catch (error) {
		console.log(error);
		return 0
	}
}

// add content award -- content_awards table
export async function addContentAward (contentID, genreID, ADate) {
	try {
		const insertAward = await pool.query(`INSERT INTO content_awards (content_id, genre_id, awarded_at) VALUES ($1, $2, $3) RETURNING *`,
			[contentID, genreID, ADate]
		);
		if (insertAward.rowCount === 0) return 0;
		return insertAward.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}