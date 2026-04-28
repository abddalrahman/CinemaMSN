import { checkContentList } from "@/db/CRUDquery/admin/contentCRUD";
import { addNewsContentR, addNewsPeoplR, checkNewsContentRelationExist, checkNewsIfExist, checkNewsPeopleRelationExist, deleteNewsRelations } from "@/db/CRUDquery/admin/newsCRUD";
import { checkListOfPeolpe } from "@/db/CRUDquery/admin/peopleCRUD";
import { checkIfUserIsAdmin } from "@/utils/recurringFunctions";
import { addNewsConnectionsValidation, deleteCNRelValidation, deletePNRelValidation } from "@/utils/zodValidations";
import { NextResponse } from "next/server";


/**
 * @method POST
 * @route ~/api/admin/news/newsConnections
 * @desc add news relations with contetns and people
 * @access private [only admin and helper can access]
 * */ 
export async function POST ( req ) {
	try {
		const isUserAdmin = checkIfUserIsAdmin( req );
		if (isUserAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
	
		const body = await req.json();
		const validationNews = addNewsConnectionsValidation.safeParse(body);
		if (!validationNews.success) {
			return NextResponse.json( {message: validationNews.error.issues[0].message}, {status: 400} );
		}
		const { newsID, movies= null, series= null, people= null } = body;
		const  isNewsExist = await checkNewsIfExist(newsID);
		if (isNewsExist === null) {
			return NextResponse.json( {message: "this news is not Exist"}, {status: 404} );
		} else if (isNewsExist === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
	
		let peopleIDs = []
		const moviesIDs = [];
		const seriesIDs = [];
		let allContentIDs = [];
		if (movies !== null) {
			movies.map((mId) => { 
				moviesIDs.includes(mId) ? '' : moviesIDs.push(Number(mId));
				allContentIDs.includes(mId) ? '' : allContentIDs.push(Number(mId));
			});
		}
		if (series !== null) {
			series.map((sId) => { 
				seriesIDs.includes(sId) ? '' : seriesIDs.push(Number(sId));
				allContentIDs.includes(sId) ? '' : allContentIDs.push(Number(sId));
			});
		}
		if (people !== null) {
			people.map((pId) => { peopleIDs.includes(pId) ? '' : peopleIDs.push(Number(pId)); });
		}
	
		const moviesExist = moviesIDs.length > 0 ? await checkContentList(moviesIDs, "M") : 0;
		const seriesExist = seriesIDs.length > 0 ? await checkContentList(seriesIDs, "S") : 0;
		const peopleExist = peopleIDs.length > 0 ? await checkListOfPeolpe(peopleIDs) : 0;
		if (moviesExist === 0 && seriesExist === 0 && peopleExist === 0) {
			return NextResponse.json( {message: "Data Entered is Wrong"}, {status: 400} );
		}
		if (moviesExist === 0 && moviesIDs.length > 0 || seriesExist === 0 && seriesIDs.length > 0 || peopleExist === 0 && peopleIDs.length > 0) {
			return NextResponse.json( {message: "some IDs entered are wrong"}, {status: 400} );
		}
		
		// check if relations exist before
		const CRelationsExist = allContentIDs.length > 0 ? await checkNewsContentRelationExist(newsID, allContentIDs) : null;
		const PRelationsExist = peopleIDs.length > 0 ? await checkNewsPeopleRelationExist(newsID, peopleIDs) : null;
		if (CRelationsExist === 0 || PRelationsExist === 0){
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		
		let addNC_relations = 0;
		let addNP_relations = 0;
		let finalMessage = '';
		if (allContentIDs.length > 0) {
			if (CRelationsExist) {
				finalMessage += 'some (news contetn) Relations are already exist, ';
				CRelationsExist.map((content) => {
					const contentIdValue = Number(content.content_id);
					allContentIDs = allContentIDs.filter((item) => item !== contentIdValue);
				});
			}
			addNC_relations = allContentIDs.length > 0 ? await addNewsContentR(newsID, allContentIDs) : -1;
			finalMessage += addNC_relations === 0 ? "add news Content Relations failed, " :''
			finalMessage += addNC_relations === -1 ? "no news contetn Relations added, " :''
			finalMessage += addNC_relations === null ? "some news contetn Relations failed to added, " :''
		}
		
		if (peopleIDs.length > 0) {
			if (PRelationsExist) {
				finalMessage += 'some (news people) Relations are already exist, ';
				PRelationsExist.map((person) => {
					const personIdValue = Number(person.person_id);
					peopleIDs = peopleIDs.filter((item) => item !== personIdValue);
				});
			}
			addNP_relations = peopleIDs.length > 0 ? await addNewsPeoplR(newsID, peopleIDs) : -1;
			finalMessage += addNP_relations === 0 ? "add news People Relations failed, " :''
			finalMessage += addNP_relations === -1 ? "no news people Relations added, " :''
			finalMessage += addNP_relations === null ? "some news people Relations failed to added, " :''
		}
	
		if (addNC_relations === 0 && addNP_relations === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		return NextResponse.json( {message: `${finalMessage !== '' ? finalMessage : 'Relations added Successfuly'}`} , {status: 200} );

	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}

}


/**
 * @method DELETE
 * @route ~/api/admin/news/newsConnections
 * @desc delete news relations
 * @access private [only admin and helper can access]
 * */ 
export async function DELETE ( req ) {
	try {
		const isAdmin = checkIfUserIsAdmin( req );
		if (isAdmin === null) {
			return NextResponse.json( {message: "only admin and helper can access"}, {status: 403} );
		}
		
		const body = await req.json();
		const toDelete = body.deleteIs || null
		if (!toDelete) {
			return NextResponse.json( {message: "Data sent is wrong"}, {status: 400} );
		}
		let deleteRelation = null;
		
		if (toDelete === "content") {
			const validationIDs = deleteCNRelValidation.safeParse(body);
			if (!validationIDs.success) {
				return NextResponse.json( {message: validationIDs.error.issues[0].message}, {status: 400} );
			}
			const {content_id, news_id} = body;
			deleteRelation = await deleteNewsRelations(news_id, "content", content_id);
			
		} else if (toDelete === "people") {
			const validationIDs = deletePNRelValidation.safeParse(body);
			if (!validationIDs.success) {
				return NextResponse.json( {message: validationIDs.error.issues[0].message}, {status: 400} );
			}
			const {person_id, news_id} = body;
			deleteRelation = await deleteNewsRelations(news_id, "people", null, person_id);
		} else {
			return NextResponse.json( {message: "Data sent is wrong"}, {status: 400} );
		}

		if (deleteRelation === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		} else if (deleteRelation === null) {
			return NextResponse.json( {message: "No Data Deleted. Data sent is wrong"}, {status: 400} );
		}
		return NextResponse.json( {message: "Deleted Successfuly"}, {status: 200} );
		
	} catch (error) {
		console.log(error);
		return NextResponse.json( {message: "internal server error"}, {status: 500} );
	}
}