import { deleteFile } from "@/utils/recurringFunctions.js";
import pool from "../../connection/pool.js";


// add new person -- people
export async function addNewPeople (data) {
	try {
		const keys = Object.keys(data);
		const values = Object.values(data);
		const valuesPlaceholders = keys.map((p,i) => `$${i+1}`).join(', ')
		const newPeople = await pool.query(`INSERT INTO people (${keys.join(', ')}) VALUES(${valuesPlaceholders}) RETURNING person_id`, values);
		if(newPeople.rowCount === 0) return 0;
		
		return newPeople.rows[0]; 
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// update exisst person -- people
export async function updatePerson (id, data) {
	try {
		const keys = Object.keys(data);
		const values = Object.values(data);
		let setClause = keys.map((key, index) => `${key}=$${index + 1}`).join(", ");
		setClause += `, updated_at = NOW()`;
		values.push(id);
		const query = `UPDATE people SET ${setClause} WHERE person_id=$${keys.length + 1} RETURNING *`;
		const updatedPerson = await pool.query(query, values);
		if(updatedPerson.rowCount === 0) return null;
		return updatedPerson.rows[0];
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// delete person -- people
export async function DeletePeople (id) {
	try {
		const deletedPeople = await pool.query(`DELETE FROM people WHERE person_id = $1 RETURNING *`, [id]);
		if(deletedPeople.rowCount === 0) return null;
		const personData = deletedPeople.rows[0];
		if (personData.image_url && personData.image_url.replace("No Data", "").trim() !== "") {
      await deleteFile(personData.image_url);
    }
    return personData; 
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// add person genres -- people_genres table
export async function addPeopleGenres(id, genres) {
	try {
		const values = [];
		const valuesPlaceholder = genres.map((g, i)=> {
			values.push(id, g);
			return `($${i * 2 + 1}, $${i * 2 + 2})`;
		}).join(', ');

		const personGenres = await pool.query(`INSERT INTO people_genres (person_id, genre_id) VALUES ${valuesPlaceholder} RETURNING *`, values);
		if(personGenres.rowCount !== genres.length) return false;
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

// delete person genres -- people_genres table
export async function deletePeopleGenres(id, genres) {
	try {
		const deletedG = await pool.query(`DELETE FROM people_genres WHERE person_id=$1 AND genre_id = ANY($2::int[]) RETURNING genre_id`, [id, genres]);
		if(deletedG.rowCount !== genres.length) return false;
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

// check list of peolpe are exist
export async function checkListOfPeolpe (pList) {
	try {
		const peopleList = await pool.query(`SELECT person_id FROM people WHERE person_id = ANY($1::int[])`, [pList])
		if(peopleList.rowCount !== pList.length) return 0;
		return peopleList.rows.length;
		
	} catch (error) {
		console.log(error);
		return 0
	}
}

// check if perosn exist 
export async function checkIfPersonExist (id) {
	try {
		const isExist = await pool.query(`SELECT * FROM people WHERE person_id = $1`, [id]);
		if (isExist.rowCount === 0) return 0;
		return isExist.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// check if person award exist -- people_awards table
export async function CheckIfPersonAwardExist (pID, aID, date) {
	try {
		const award = await pool.query(`SELECT * FROM people_awards WHERE person_id = $1 AND genre_id = $2 AND awarded_at = $3`, [pID, aID, date]);
		if (award.rowCount > 0) return null;
		return true;
		
	} catch (error) {
		console.log(error);
		return 0
	}
}

// add person award -- people_awards table
export async function addPersonAward (personID, genreID, ADate) {
	try {
		const insertAward = await pool.query(`INSERT INTO people_awards (person_id, genre_id, awarded_at) VALUES ($1, $2, $3) RETURNING *`,
			[personID, genreID, ADate]
		);
		if (insertAward.rowCount === 0) return 0;
		return insertAward.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// delete person award -- people_awards table
export async function DeletePeopleAward (personID, genreID, ADate) {
	try {
		const deletedAward = await pool.query(`DELETE FROM people_awards WHERE person_id = $1 AND genre_id = $2 AND awarded_at = $3 RETURNING *`,
			[personID, genreID, ADate]
		);
		if (deletedAward.rowCount === 0) return null;
		return deletedAward.rows[0];
		
	} catch (error) {
		console.log(error);
		return 0;
	}
}

// get all person info
export async function getAllPersonInfo (id) {
	try {
		const mainInfo = await pool.query(`SELECT * FROM people WHERE person_id = $1`, [id]);
		const personGenres = await pool.query(`SELECT genre_id FROM people_genres WHERE person_id = $1`, [id]);
		const personAwards = await pool.query(`SELECT genre_id, awarded_at FROM people_awards WHERE person_id = $1`, [id]);
		if (mainInfo.rowCount === 0 || personGenres.rowCount === 0) return null;
		return {mainInfo: mainInfo.rows[0], personGenres: personGenres.rows, personAwards: personAwards.rows};
	} catch (error) {
		console.log(error);
		return 0;
	}
}