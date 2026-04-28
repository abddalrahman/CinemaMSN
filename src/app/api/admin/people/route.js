import { checkGenreList } from "@/db/CRUDquery/admin/genresCRUD";
import { addNewPeople, addPeopleGenres, checkIfPersonExist, DeletePeople, updatePerson } from "@/db/CRUDquery/admin/peopleCRUD";
import { addFileFunc, checkIfUserIsAdmin, deleteFile, filterObject } from "@/utils/recurringFunctions"
import { addPeopleValidation, editPeopleValidation } from "@/utils/zodValidations";
import { NextResponse } from "next/server";

/**
 * @method POST
 * @route ~/api/admin/people
 * @desc Add new people
 * @access private (only admin and helper can access) 
 * */
export async function POST ( req ) {
	try {
		const isUserAdmin = checkIfUserIsAdmin(req);
		if(isUserAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
		
		const data = await req.formData();
	
		const body = {
			p_name: data.get("p_name") !== null ? data.get("p_name") : undefined,
			bio: data.get("bio") !== null ? data.get("bio") : undefined,
			birth_date: data.get("birth_date") !== null ? data.get("birth_date") : undefined,
			height_cm: data.get("height_cm") !== null ? Number(data.get("height_cm")) : undefined,
			children_count: data.get("children_count") !== null ? Number(data.get("children_count")) : undefined,
			nationality: data.get("nationality") !== null ? data.get("nationality") : undefined,
			image: data.get("image") ? data.get("image") : undefined,
			genresList: data.get("genresList") ? JSON.parse(data.get("genresList")) || null : undefined,
		}
		const validationGenre = addPeopleValidation.safeParse(body);
		if(!validationGenre.success) {
			return NextResponse.json( {message: validationGenre.error.issues[0].message}, {status: 400} );
		}
		
		if(body.genresList) {
			// chekc if genres ids is currect
			const areIDsCurrect = await checkGenreList(body.genresList, 'person_role');
			if(areIDsCurrect === 0) return NextResponse.json({ message: "invalid genre ID entered" }, {status: 400});
		}

		if(body.image) {
			const addImage = await addFileFunc(body.image, 'm');
			if (addImage === "000"){
				throw new Error("upload failed");
			}else if (addImage === "111") {
				return NextResponse.json({ message: "image type must be one of this ['.png', '.jpg', '.web', '.jpeg']" }, {status: 400});
			}else if (addImage === "222") {
				return NextResponse.json({ message: "image name is too long" }, {status: 400});
			}
			body.image_url= addImage;
		}
		
		const filteredObject = filterObject( body, null, ["image", "genresList"]);
		const userAdded = await addNewPeople(filteredObject);
		if(userAdded === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		const addPeronGenres = await addPeopleGenres(userAdded.person_id, body.genresList);
		if(addPeronGenres === false) {
			return NextResponse.json( {message: "Person added successfully but failed to add its genres "}, {status: 201} );
		}
		return NextResponse.json( {message: "Person added successfully"}, {status: 201} );

	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "internal server error" }, {status: 500});
	}
}

/**
 * @method DELETE
 * @route ~/api/admin/people
 * @desc delete people
 * @access private (only admin and helper can access) 
 * */
export async function DELETE ( req ) {
	try {
		const isUserAdmin = checkIfUserIsAdmin( req );
		if (isUserAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
		const body = await req.json();
		const id = Number(body.id) || null;
		if (!id) {
			return NextResponse.json( {message: "ID is not currect"}, {status: 400} );
		}
		const isPeopleExist = await checkIfPersonExist(id);
		if (isPeopleExist === 0) {
			return NextResponse.json( {message: "can not find this people"}, {status: 404} );
		}
		const deletedPeople = await DeletePeople(id);
		if (deletedPeople === 0) {
			return NextResponse.json({ message: "internal server error"}, {status: 500});
		} else if (deletedPeople === null){
			return NextResponse.json({ message: "People not Found"}, {status: 404});
		}else {
			return NextResponse.json({ message: "People Deleted Successfuly"}, {status: 200});
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "internal server error"}, {status: 500});
	}
}

/**
 * @method PUT
 * @route ~/api/admin/people
 * @desc update person
 * @access private (only admin and helper can access) 
 * */
export async function PUT ( req ) {
	try {
		const isUserAdmin = checkIfUserIsAdmin(req);
		if(isUserAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
		
		const data = await req.formData();
		const personID = data.get("id") ? Number(data.get("id")) || null : null 
		if (personID === null) return NextResponse.json( {message: "person ID is Wrong"}, {status: 400} );
		const isPersonExist = await checkIfPersonExist(personID);
		if (isPersonExist === 0) return NextResponse.json( {message: "this person is not exist"}, {status: 400} );
	
		const body = {
			p_name: data.get("p_name") !== null ? data.get("p_name") : undefined,
			bio: data.get("bio") !== null ? data.get("bio") : undefined,
			birth_date: data.get("birth_date") !== null ? data.get("birth_date") : undefined,
			height_cm: data.get("height_cm") !== null ? Number(data.get("height_cm")) : undefined,
			children_count: data.get("children_count") !== null ? Number(data.get("children_count")) : undefined,
			nationality: data.get("nationality") !== null ? data.get("nationality") : undefined,
		}

		const bodyToCheckAllData = {
			...body,
			image: data.get("image") ? data.get("image") : undefined,
		}

		const validationP = editPeopleValidation.safeParse(body);
		if(!validationP.success) {
			return NextResponse.json( {message: validationP.error.issues[0].message}, {status: 400} );
		}

		if(bodyToCheckAllData.image) {
			const addImage = await addFileFunc(bodyToCheckAllData.image, 'm');
			if (addImage === "000"){
				throw new Error("upload failed");
			}else if (addImage === "111") {
				return NextResponse.json({ message: "image type must be one of this ['.png', '.jpg', '.web', '.jpeg']" }, {status: 400});
			}else if (addImage === "222") {
				return NextResponse.json({ message: "image name is too long" }, {status: 400});
			}
			body.image_url= addImage;
			if (isPersonExist.image_url && isPersonExist.image_url.replace("No Data", "") !== "") await deleteFile(isPersonExist.image_url);
		}
		
		const filteredObject = filterObject( body );
		const personUpdated = await updatePerson(personID, filteredObject);
		if(personUpdated === 0 || personUpdated === null) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		return NextResponse.json( {message: "Person Updated successfully"}, {status: 200} );

	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "internal server error" }, {status: 500});
	}
}