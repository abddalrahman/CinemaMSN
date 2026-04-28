import { addNewGenre, checkIfGenreExist, DeleteGenre } from "@/db/CRUDquery/admin/genresCRUD";
import { checkIfUserIsAdmin } from "@/utils/recurringFunctions";
import { addGenreValidation } from "@/utils/zodValidations";
import { NextResponse, NextRequest } from "next/server";

/**
 * @method POST
 * @route ~/api/admin/genres
 * @desc Add genre
 * @access private (only admin and helper can access) 
 * */ 

export async function  POST ( req ) {
	try {
		const userIsAdmin = checkIfUserIsAdmin(req);
		if(userIsAdmin === null) {
			return NextResponse.json({message: "only admin and helper can access"}, {status: 403})
		}
		
		const body = await req.json();
		const validationGenre = addGenreValidation.safeParse(body);
		if(!validationGenre.success) {
			return NextResponse.json({message: validationGenre.error.issues[0].message}, {status: 400});
		}
	
		const genreExist = await checkIfGenreExist({kind: body.kind, name: body.name.toLowerCase()});
		if (genreExist !== 0) {
			return NextResponse.json({message: "this genre is exits"}, {status: 400})
		}
	
		const addGenre = await addNewGenre({kind: body.kind, name: body.name, description: body.description});
		if (addGenre === 0) {
			return NextResponse.json({message: "internal server error"}, {status: 500})
		}
		return NextResponse.json({message: "Genre Created Successfuly"}, {status: 201})
		
	} catch (error) {
		console.log(error);
		return NextResponse.json({message: "internal server error"}, {status: 500})
	}

}

/**
 * @method DELETE
 * @route ~/api/admin/genres
 * @desc delete genre
 * @access private (only admin and helper can access) 
 * */ 
export async function DELETE ( req ) {
	try {
		const isUserAdmin = checkIfUserIsAdmin( req );
		if (isUserAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
		const body = await req.json();
		const id = Number(body.id	) || null;
		if (!id) {
			return NextResponse.json( {message: "ID is not currect"}, {status: 400} );
		}
		const isGenreExist = await checkIfGenreExist(null, id);
		if (isGenreExist === 0) {
			return NextResponse.json( {message: "can not find this genre"}, {status: 404} );
		}
		const deletedGenre = await DeleteGenre(id);
		if (deletedGenre === 0) {
			return NextResponse.json({ message: "internal server error"}, {status: 500});
		} else if (deletedGenre === null) {
			return NextResponse.json({ message: "Genre not Found"}, {status: 404});
		}
		return NextResponse.json({ message: "Genre Deleted Successfuly"}, {status: 200});
		
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "internal server error"}, {status: 500});
	}
}