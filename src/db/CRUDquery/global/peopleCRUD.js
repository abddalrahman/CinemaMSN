import pool from "@/db/connection/pool";

// get people list
export async function getPeopleListFromArray ( pList ) {
	try {
		const people = await pool.query(`SELECT person_id, p_name, image_url FROM people WHERE person_id = ANY($1::int[]) `, [pList]
		);
		if (people.rowCount !== pList.length) return null;
		return people.rows;
	} catch (error) {
		console.log(error);
		return 0;
	}
}