import { checkGenreList } from "@/db/CRUDquery/admin/genresCRUD";
import { addPeopleGenres, deletePeopleGenres } from "@/db/CRUDquery/admin/peopleCRUD";
import { checkIfUserIsAdmin } from "@/utils/recurringFunctions";
import { checkAddArDeleteAr } from "@/utils/zodValidations";
import { NextResponse } from "next/server";

/**
 * @method PUT
 * @route ~/api/admin/people/peopleGenres
 * @desc update person genres [add new ones and removed others]
 * @access private (only admin and helper can access)
 * */
export async function PUT (req) {
	try {
		let messages = [];
		let goodMessages = [];
		const isUserAdmin = checkIfUserIsAdmin( req );
		if (isUserAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
		const data = await req.json();
		const validation = checkAddArDeleteAr.safeParse(data);
		if (!validation.success) {
			return NextResponse.json({ message: "Data form Issue"}, {status: 400});
		}
		const updateIDs = data.AddArray;
		const deleteIDs = data.deleteArray;
		const isAllGenresExist = await checkGenreList([...updateIDs, ...deleteIDs], "person_role");
		if (isAllGenresExist === 0) {
			return NextResponse.json({ message: "Some Data Entered is Wrong"}, {status: 400});
		}
		const addNewPG = updateIDs.length > 0 ? await addPeopleGenres(data.id, updateIDs) : null;
		const deletePG = deleteIDs.length > 0 ? await deletePeopleGenres(data.id, deleteIDs) : null;
		if (addNewPG === false && deletePG === false) { 
			messages.push("Failed to update Genres")
		} else if (addNewPG !== false && deletePG !== false) {
			goodMessages.push("Genres Updated Successfuly");
		} else if (addNewPG === false && deletePG !== false) {
			goodMessages.push("Failed to add new Genres but old one Removed")
		} else {
			goodMessages.push("Failed to Delete old Genres but new one Added")
		}
		
		if (messages.length > 0) {
			return NextResponse.json({ message: "internal server error"}, {status: 500});
		} else {
			return NextResponse.json({ message: goodMessages[0]}, {status: 200});
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "internal server error"}, {status: 500});
	}
}