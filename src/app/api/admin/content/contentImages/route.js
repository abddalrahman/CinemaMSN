import { addContentImages, checkIfContentExist, deleteContetnImges } from "@/db/CRUDquery/admin/contentCRUD";
import { addFileFunc, checkIfUserIsAdmin } from "@/utils/recurringFunctions";
import { deletContentImagesValidation } from "@/utils/zodValidations";
import { NextResponse } from "next/server";

/**
 * @method POST
 * @route ~/api/admin/content/contentImages
 * @desc add images for content
 * @access private [only admin and helper can access]
*/
export async function POST ( req ) {
	try {
		const isAdmin = checkIfUserIsAdmin(req);
		if (isAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} ) 
		}
	
		const data = await req.formData();
		const contentID = data.get("content_id"); 
		if (!contentID || !Number(contentID)) {
			return NextResponse.json( {message: "content ID is required"}, {status: 400} );
		}
		const isContentExist = await checkIfContentExist(contentID);
		if (isContentExist === 0) {
			return NextResponse.json( {message: "this content ID is not Exist"}, {status: 400} );
		}
		const body = [];
		
		const featuredImages = JSON.parse(data.get("featured")) || []; 
		const files = data.getAll("images");
		
		if (files.length > 0) {
			for (const file of files) {
				const addfile = await addFileFunc(file, 'm');
				if (addfile === "000"){
					throw new Error("upload failed");
				}else if (addfile === "111") {
					continue
				}else if (addfile === "222") {
					continue
				}
				if (featuredImages.includes(file.name)){
					body.push({imageURL: addfile, isFeatured: true});
				}else {
					body.push({imageURL: addfile, isFeatured: false});
				}
			}
		}

		if (body.length > 0) {
			const addImages = await addContentImages(contentID, body);
			if (!addImages) {
				return NextResponse.json( {message: "internal server error"}, {status: 500} );
			}
			if (body.length === files.length) {
				return NextResponse.json( {message: "all images added successfuly"}, {status: 200} );
			}
			return NextResponse.json( 
				{message: "some images did not added resons contain [file name is too long, file is not image, internal error]"},
				{status: 200} 
			);
		}
		return NextResponse.json( {message: "no files added"}, {status: 400} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}


/**
 * @method DELETE
 * @route ~/api/admin/content/contentImages
 * @desc delete content images [one or more]
 * @access private [only admin and helper can access]
*/

export async function DELETE ( req ) {
	try {
		const isAdmin = checkIfUserIsAdmin(req);
		if (isAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} ) 
		}
		const body = await req.json();
		const validationIDs = deletContentImagesValidation.safeParse(body);
		if (!validationIDs.success) {
			return NextResponse.json( {message: validationIDs.error.issues[0].message}, {status: 400} ) 
		}
		const deleteImages = await deleteContetnImges(body.imagesIDS);
		if (deleteImages === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		return NextResponse.json( {message: "Deleted Successfuly"}, {status: 200} );
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}