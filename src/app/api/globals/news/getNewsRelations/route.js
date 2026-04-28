import { checkNewsIfExist, getNewsContentRelationExist, getNewsPeopleRelationExist } from "@/db/CRUDquery/admin/newsCRUD";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route ~/api/globals/news/getNewsRelations
 * @desc get All News Relations
 * @access public
 * */
export async function GET (req) {
	try {
		const { searchParams } = new URL(req.url);
		const id = parseInt(searchParams.get("id")) || null;
		const needContent = searchParams.get("content") || null;
		const needPeople = searchParams.get("people") || null;
		if (!id) {
			return NextResponse.json( {message: "ID is not currect"}, {status: 400} );
		}
		const news = await checkNewsIfExist(id);
		if (news === null) {
			return NextResponse.json( {message: "This News is not Exist"}, {status: 404} );
		} else if (news === 0) {
			return NextResponse.json( {message: "internal server error"}, {status: 500} );
		}
		let NC_relations, NP_relations = "";
		NC_relations = needContent !== null ? await getNewsContentRelationExist(id) : "";
		NP_relations = needPeople !== null ? await getNewsPeopleRelationExist(id) : "";
		if (needContent !== null && NC_relations === 0) return NextResponse.json( {message: "failed to get news content relations"}, {status: 500} );
		if (needPeople !== null && NP_relations === 0) return NextResponse.json( {message: "failed to get news people relations"}, {status: 500} );

		const NC_result = NC_relations === null || NC_relations === 0 || NC_relations === "" ? [] : NC_relations;
		const NP_result = NP_relations === null || NP_relations === 0 || NP_relations === "" ? [] : NP_relations;
		return NextResponse.json( {nc: NC_result.map((c) => c.content_id), np: NP_result.map((p) => p.person_id)}, {status: 200} );

	} catch (error) {
		console.log(error);
		return NextResponse.json( {message:"internal server error"}, {status: 500} );
	}
}