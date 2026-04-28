import { addNewNews, checkNewsIfExist, deleteNews, EditNewsData } from "@/db/CRUDquery/admin/newsCRUD";
import { addFileFunc, checkIfUserIsAdmin, deleteFile, filterObject } from "@/utils/recurringFunctions";
import { addNewNewsValidation, editNewsValidation } from "@/utils/zodValidations";
import { NextResponse } from "next/server";


/**
 * @method POST
 * @route ~/api/admin/news
 * @desc "add new news"
 * @access private [only admin and helper can access]
*/
export async function POST ( req ) {
	try {
		const isAdmin = checkIfUserIsAdmin( req );
		if (isAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
	
		const data = await req.formData();
		const body = {
			title: data.get("title") ? data.get("title") : "",
			body: data.get("body") ? data.get("body") : "",
			is_about_movies: data.get("is_about_movies") === "t" ? true : false,
			is_about_series: data.get("is_about_series") === "t" ? true : false,
			is_about_people: data.get("is_about_people") === "t" ? true : false
		}
	
		const bodyTOValidation = {...body, image: data.get("image") !== "" ? data.get("image") : undefined || undefined}
		const validationNews = addNewNewsValidation.safeParse(bodyTOValidation);
		if (!validationNews.success) {
			return NextResponse.json( {message: validationNews.error.issues[0].message}, {status: 400} );
		}
		const newsImage = data.get("image");
		if (newsImage && newsImage !== "") {
			const imageUrl = await addFileFunc(newsImage, 'm');
			if (imageUrl === "000") {
				throw new Error("upload failed");
			}else if (imageUrl === "111") {
				return NextResponse.json({ message: "image type must be one of this ['.png', '.jpg', '.webp', '.jpeg']" }, {status: 400});
			}else if (imageUrl === "222") {
				return NextResponse.json({ message: "image name is too long" }, {status: 400});
			}else {
				body.image_url= imageUrl;
			}
		}
		
		
		const newNews = await addNewNews( body );
		if (newNews === 0) {
			return NextResponse.json({ message: "internal server error" }, {status: 500});
		}
		return NextResponse.json({ message: "News Added Successfuly" }, {status: 201});
		
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "internal server error" }, {status: 500});
	}
}

/**
 * @method DELETE
 * @route ~/api/admin/news
 * @desc "delete news"
 * @access private [only admin and helper can access]
*/
export async function DELETE ( req ) {
	try {
		const isAdmin = checkIfUserIsAdmin( req );
		if (isAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
		
		const body = await req.json();
		const id = parseInt(body.id) || null;
		if (!id) {
			return NextResponse.json( {message: "ID is not currect"}, {status: 400} );
		}
		const newNews = await deleteNews( id );
		if (newNews === 0) {
			return NextResponse.json({ message: "internal server error" }, {status: 500});
		} else if (newNews === null) {
			return NextResponse.json({ message: "News not Found" }, {status: 404});
		}
		return NextResponse.json({ message: "Deleted Successfuly" }, {status: 200});
		
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "internal server error" }, {status: 500});
	}
}

/**
 * @method PUT
 * @route ~/api/admin/news
 * @desc "update news"
 * @access private [only admin and helper can access]
*/
export async function PUT ( req ) {
	try {
		const isAdmin = checkIfUserIsAdmin( req );
		if (isAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
	
		const data = await req.formData();
		const newsID = data.get("id") ? Number(data.get("id")) || null : null 
		if (newsID === null) return NextResponse.json( {message: "news ID is Wrong"}, {status: 400} );
		const isNewsExist = await checkNewsIfExist(newsID);
		if (isNewsExist === null) return NextResponse.json( {message: "this news is not exist"}, {status: 400} );
		if (isNewsExist === 0) return NextResponse.json( {message: "internal server error"}, {status: 500} );


		const body = {
			title: data.get("title") ? data.get("title") : undefined,
			body: data.get("body") ? data.get("body") : undefined,
			is_about_movies: data.get("is_about_movies") ? data.get("is_about_movies") === "true" : undefined,
			is_about_series: data.get("is_about_series") ? data.get("is_about_series") === "true" : undefined,
			is_about_people: data.get("is_about_people") ? data.get("is_about_people") === "true" : undefined
		}
	
		const bodyTOValidation = {...body, image: data.get("image") ? data.get("image") : undefined}
		const validationNews = editNewsValidation.safeParse(bodyTOValidation);
		if (!validationNews.success) {
			return NextResponse.json( {message: validationNews.error.issues[0].message}, {status: 400} );
		}
		const newsImage = data.get("image");
		if (newsImage && newsImage !== "") {
			const imageUrl = await addFileFunc(newsImage, 'm');
			if (imageUrl === "000") {
				throw new Error("upload failed");
			}else if (imageUrl === "111") {
				return NextResponse.json({ message: "image type must be one of this ['.png', '.jpg', '.web', '.jpeg']" }, {status: 400});
			}else if (imageUrl === "222") {
				return NextResponse.json({ message: "image name is too long" }, {status: 400});
			}else {
				body.image_url= imageUrl;
				await deleteFile(isNewsExist.image_url)
			}
		}
		
		const filteredObject = filterObject( body );
		if (Object.keys(filteredObject).length == 0) {
			return NextResponse.json({ message: "no acceptable change to update" }, {status: 400});
		}
		const updatedNews = await EditNewsData( newsID, filteredObject );
		if (updatedNews === null) {
			return NextResponse.json({ message: "can not find news to update it" }, {status: 404});
		} else if (updatedNews === 0) {
			return NextResponse.json({ message: "internal server error" }, {status: 500});
		}
		return NextResponse.json({ message: "News Updated Successfuly" }, {status: 200});
		
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "internal server error" }, {status: 500});
	}
}