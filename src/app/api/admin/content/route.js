import { addContentGenres, addNewContent, checkIfContentExist, UpdateContent } from "@/db/CRUDquery/admin/contentCRUD";
import { checkGenreList } from "@/db/CRUDquery/admin/genresCRUD";
import { addFileFunc, checkIfUserIsAdmin, deleteFile, filterObject } from "@/utils/recurringFunctions";
import { addContentValidation, checkGenresList, editContentValidation } from "@/utils/zodValidations";
import { NextResponse } from "next/server";
import { DeleteContent } from '@/db/CRUDquery/admin/contentCRUD';


/**
 * @method POST
 * @route ~/api/admin/content
 * @desc Add new content
 * @access private (only admin and helper can access) 
 * */

export async function POST ( req ) {
	try {
		const isUserAdmin = checkIfUserIsAdmin( req );
		if (isUserAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
	
		const data = await req.formData();
		const body = {
			title: data.get("title") ? data.get("title") : "",
			summary: data.get("summary") ? data.get("summary") : "",
			release_month: data.get("release_month") ? Number(data.get("release_month")) : 0,
			release_year: data.get("release_year") ? Number(data.get("release_year")) : 0,
			duration_minutes: data.get("duration_minutes") ? Number(data.get("duration_minutes")) : 0,
			filming_location: data.get("filming_location") ? data.get("filming_location") : undefined,
			budget: data.get("budget") ? Number(data.get("budget")) : undefined,
			revenue: data.get("revenue") ? Number(data.get("revenue")) : undefined,
			country: data.get("country") ? data.get("country") : "",
			is_expected_popular: data.get("is_expected_popular") === true ? true : false,
			release_date: data.get("release_date") ? data.get("release_date") : undefined,
			language: data.get("language") ? data.get("language") : undefined,
			c_status: data.get("c_status") ? data.get("c_status") : undefined,
			season_number: data.get("season_number") ? Number(data.get("season_number")) : undefined,
			episodes_count: data.get("episodes_count") ? Number(data.get("episodes_count")) : undefined,
			content_type: data.get("content_type") ? data.get("content_type") : undefined,
		}
		const bodyToCheckAllData = {
			...body,
			poster: data.get("poster") ? data.get("poster") : undefined,
			trailer: data.get("trailer") ? data.get("trailer") : undefined,
		}
		
		const contentCats = data.get("genresList") !== null ? JSON.parse(data.get("genresList")) : null;		
		if(contentCats !== null) {
			const validationGenresList = checkGenresList.safeParse({genresList: contentCats});
			if(!validationGenresList.success) {
				return NextResponse.json({ message: "you must choose Content Genres" }, {status: 400} );
			}
			const areIDsCurrect = await checkGenreList(contentCats, 'content_genre');
			if(areIDsCurrect === 0) return NextResponse.json({ message: "invalid genre ID entered" }, {status: 400});
		} else {
			return NextResponse.json({ message: "you must choose Content Genres" }, {status: 400} );
		}
		// check all required data exist
		const validationAllContentData = addContentValidation.safeParse( bodyToCheckAllData );
		if(!validationAllContentData.success) {
			return NextResponse.json( {message: validationAllContentData.error.issues[0].message}, {status: 400} );
		}
		// poster
		const posterImage = bodyToCheckAllData.poster;
		if(!posterImage) return NextResponse.json({ message: "poster image is required" }, {status: 403});
		const addPoster = await addFileFunc( posterImage, 'm' );
		if (addPoster === "000"){
			throw new Error("upload failed");
		}else if (addPoster === "111") {
			return NextResponse.json({ message: "image type must be one of this ['.png', '.jpg', '.web', '.jpeg']" }, {status: 400});
		}else if (addPoster === "222") {
			return NextResponse.json({ message: "image name is too long" }, {status: 400});}
		else {
			body.poster_url= addPoster;
		}

		// trailer
		const trailerV = bodyToCheckAllData.trailer;
		if(trailerV?.size > 0){
			const trailer = await addFileFunc( trailerV, 'v' );
			if (trailer === "000"){
				throw new Error("upload failed");
			}else if (trailer === "111") {
				return NextResponse.json({ message: "vedio type must be .mp4" }, {status: 400});
			}else if (trailer === "222") {
				return NextResponse.json({ message: "video name is too long" }, {status: 400});
			}else {
				body.trailer_url= trailer;
			}
		}


		const filteredObject = filterObject( body );
		const contentAdded = await addNewContent(filteredObject);
		if(contentAdded === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		if (contentCats !== null) {
			const addcontentG = await addContentGenres(contentAdded.content_id, contentCats);
			if(addcontentG === false) {
				return NextResponse.json( {message: "Content added successfully but failed to add its genres "}, {status: 201} );
			}
			return NextResponse.json( {message: "Content added successfully"}, {status: 201} );
		}
		return NextResponse.json( {message: "Content added successfully"}, {status: 201} );

	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "internal server error"}, {status: 500});
	}
}

/**
 * @method DELETE
 * @route ~/api/admin/content
 * @desc delete a content
 * @access private (only admin and helper can access) 
 * */

export async function DELETE ( req ) {
	try {
		const isUserAdmin = checkIfUserIsAdmin( req );
		if (isUserAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
		const body = await req.json();
		const id = body.id;
		const isContentExist = await checkIfContentExist(id);
		if (isContentExist === 0) {
			return NextResponse.json( {message: "can not find this content"}, {status: 404} );
		}
		const deletedContent = await DeleteContent(id);
		if (deletedContent === 0) {
			return NextResponse.json({ message: "internal server error"}, {status: 500});
		} else {
			return NextResponse.json({ message: "Content Deleted Successfuly"}, {status: 200});
		}
		
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "internal server error"}, {status: 500});
	}
}

/**
 * @method PUT
 * @route ~/api/admin/content
 * @desc update content info
 * @access private (only admin and helper can access) 
 * */
export async function PUT (req) {
	try {
		const isUserAdmin = checkIfUserIsAdmin( req );
		if (isUserAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
		const data = await req.formData();
		const contentID = data.get("id") ? Number(data.get("id")) || null : null 
		if (contentID === null) return NextResponse.json( {message: "content ID is Wrong"}, {status: 400} );
		const isContentExist = await checkIfContentExist(contentID);
		if (isContentExist === 0) return NextResponse.json( {message: "this content is not exist"}, {status: 400} );

		const body = {
			title: data.get("title") ? data.get("title") : undefined,
			summary: data.get("summary") ? data.get("summary") : undefined,
			release_month: data.get("release_month") ? Number(data.get("release_month")) : undefined,
			release_year: data.get("release_year") ? Number(data.get("release_year")) : undefined,
			duration_minutes: data.get("duration_minutes") ? Number(data.get("duration_minutes")) : undefined,
			filming_location: data.get("filming_location") ? data.get("filming_location") : undefined,
			budget: data.get("budget") ? Number(data.get("budget")) : undefined,
			revenue: data.get("revenue") ? Number(data.get("revenue")) : undefined,
			country: data.get("country") ? data.get("country") : undefined,
			is_expected_popular: data.get("is_expected_popular") ?  data.get("is_expected_popular") === "true" : undefined,
			release_date: data.get("release_date") ? data.get("release_date") : undefined,
			language: data.get("language") ? data.get("language") : undefined,
			c_status: data.get("c_status") ? data.get("c_status") : undefined,
			season_number: data.get("season_number") ? Number(data.get("season_number")) : undefined,
			episodes_count: data.get("episodes_count") ? Number(data.get("episodes_count")) : undefined,
			content_type: data.get("content_type") ? data.get("content_type") : undefined,
		}
		const bodyToCheckAllData = {
			...body,
			poster: data.get("poster") ? data.get("poster") : undefined,
			trailer: data.get("trailer") ? data.get("trailer") : undefined,
		}
		
		// check all required data exist
		const validationAllContentData = editContentValidation.safeParse( bodyToCheckAllData );
		if(!validationAllContentData.success) {
			return NextResponse.json( {message: validationAllContentData.error.issues[0].message}, {status: 400} );
		}
		// poster
		const posterImage = bodyToCheckAllData.poster;
		if(posterImage) {
			const addPoster = await addFileFunc( posterImage, 'm' );
			if (addPoster === "000"){
				throw new Error("upload failed");
			}else if (addPoster === "111") {
				return NextResponse.json({ message: "image type must be one of this ['.png', '.jpg', '.web', '.jpeg']" }, {status: 400});
			}else if (addPoster === "222") {
				return NextResponse.json({ message: "image name is too long" }, {status: 400});}
			else {
				body.poster_url= addPoster;
				await deleteFile(isContentExist.poster_url);
			}
		}
		
		// trailer
		const trailerV = bodyToCheckAllData.trailer;
		if(trailerV?.size > 0){
			const trailer = await addFileFunc( trailerV, 'v' );
			if (trailer === "000"){
				throw new Error("upload failed");
			}else if (trailer === "111") {
				return NextResponse.json({ message: "vedio type must be .mp4" }, {status: 400});
			}else if (trailer === "222") {
				return NextResponse.json({ message: "video name is too long" }, {status: 400});
			}else {
				body.trailer_url= trailer;
				if (isContentExist.trailer_url?.replace("No Data", "").trim() !== "") {
					await deleteFile(isContentExist.trailer_url);
				}
			}
		}

		const filteredObject = filterObject( body );
		const contentUpdated = await UpdateContent(contentID, filteredObject);
		if(contentUpdated === 0 || contentUpdated === null) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		return NextResponse.json( {message: "Content Updated successfully"}, {status: 200} );

	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "internal server error"}, {status: 500});
	}
}