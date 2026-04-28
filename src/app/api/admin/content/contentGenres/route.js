import { addContentGenres, deleteContentGenres } from "@/db/CRUDquery/admin/contentCRUD";
import { checkGenreList } from "@/db/CRUDquery/admin/genresCRUD";
import { checkIfUserIsAdmin } from "@/utils/recurringFunctions";
import { checkUpdateContentGenres } from "@/utils/zodValidations";
import { NextResponse } from "next/server";

/**
 * @method PUT
 * @route ~/api/admin/content/contentGenres
 * @desc update content genres [add new ones and delete removed one]
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
		const validation = checkUpdateContentGenres.safeParse(data);
		if (!validation.success) {
			return NextResponse.json({ message: "Data form Issue"}, {status: 400});
		}
		const updateIDs = data.updateGenres;
		const deleteIDs = data.deleteGenres;
		const isAllGenresExist = await checkGenreList([...updateIDs, ...deleteIDs], "content_genre");
		if (isAllGenresExist === 0) {
			return NextResponse.json({ message: "Some Data Entered is Wrong"}, {status: 400});
		}
		const addNewCG = updateIDs.length > 0 ? await addContentGenres(data.contentId, updateIDs) : null;
		const deleteCG = deleteIDs.length > 0 ? await deleteContentGenres(data.contentId, deleteIDs) : null;
		if (addNewCG === false && deleteCG === 0) { 
			messages.push("Failed to update Genres")
		} else if (addNewCG !== false && deleteCG !== 0) {
			goodMessages.push("Genres Updated Successfuly");
		} else if (addNewCG === false && deleteCG !==0) {
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