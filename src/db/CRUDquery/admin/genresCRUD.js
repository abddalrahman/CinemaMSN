import pool from "../../connection/pool.js";


// check if genre exist
export async function checkIfGenreExist (data, id= null) {
	try {
		if(id !== null) {
			const genreInfo = await pool.query(`SELECT * FROM genres WHERE genre_id = $1`, [id]);
			if(genreInfo.rowCount === 0) return 0;
			return genreInfo.rows[0];
		}
		const genreInfo = await pool.query(`SELECT * FROM genres WHERE kind = $1 AND name = $2`, [data.kind, data.name]);
		if(genreInfo.rowCount === 0) return 0;
		
		return genreInfo.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// check genre list if exist
export async function checkGenreList (GList, kind) {
	try {
		const genreInfo = await pool.query(`SELECT genre_id FROM genres WHERE genre_id = ANY($1::int[]) AND kind = $2`, [GList, kind]);
		if(genreInfo.rowCount !== GList.length) return 0;
		
		return genreInfo.rows.length;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// add new genre
export async function addNewGenre (data) {
	try {
		const genreInfo = await pool.query(`INSERT INTO genres (kind, name, description) VALUES($1, $2, $3) RETURNING genre_id `,
			[data.kind, data.name, data.description]
		);
		if(genreInfo.rowCount === 0) return 0;
		return genreInfo.rows[0];
	
	} catch (error) {
		console.log(error);
		return 0
	}
}

// get genres
export async function getGenres (type) {
	try {
		const genres = await pool.query(`SELECT genre_id, name, description FROM genres WHERE kind = $1`, [type]);
		if(genres.rowCount === 0) return [];
		
		return genres.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// delete genre
export async function DeleteGenre (id) {
	try {
		const genreInfo = await pool.query(`DELETE FROM genres WHERE genre_id = $1 RETURNING genre_id `, [id]);
		if(genreInfo.rowCount === 0) return null;
		return genreInfo.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}