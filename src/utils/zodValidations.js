const { z, email, number } = require("zod");

// -- admin section


// genres ----

// add new genres
export const addGenreValidation = z.object({
	kind: z.enum(['person_role', 'content_genre','content_award','person_award'], { 
		errorMap: () => ({ message: "this is not genre kind" })
	}),
	name: z.string().min(3, 'genre name must be at least 3 letters long').max(255, 'genre name must not be more than 255 letters'),
	description: z.string().min(10, "description must contein at least 10 letters long")
})

// check genres list
export const checkGenresList = z.object({
	genresList: z.array(z.number().int()).min(1, "No Genres Choosen")
})

// update content genres 
export const checkUpdateContentGenres = z.object({
	updateGenres: z.array(z.number().int()).min(0),
	deleteGenres: z.array(z.number().int()).min(0),
	contentId: z.number().int()
})

// people ----
// add new people
export const addPeopleValidation = z.object({
	p_name: z.string().min(3, 'name must be at least 3 letters long').max(100, 'name must not be more than 100 letters'),
	bio: z.optional(z.string().min(10, 'bio must be at least 10 letters long')),
	birth_date: z.string().regex( /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, "Date must be in YYYY-MM-DD format" ),
	height_cm: z.optional(z.number().int().min(55, 'tall must not be smaller than 55cm').max(280, 'tall must not be more than 280cm')),
	children_count: z.optional(z.number().int().min(0, 'children count must be 0 or more').max(40, 'children count must not be more than 40')),
	nationality: z.optional(z.string().max(100, 'image url must not be more than 100 letters')),
	image: z.instanceof(File).refine(
		(file) => file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp" || file.type === "image/jpg",
		{ message: "poster must be a PNG, JPG, Webp or JPEG image" }
	),
	genresList: z.array(z.number().int()).min(1, "No Genres Choosen")
});

// edit people
export const editPeopleValidation = z.object({
	p_name: z.optional(z.string().min(3, 'name must be at least 3 letters long').max(100, 'name must not be more than 100 letters')),
	bio: z.optional(z.string().min(10, 'bio must be at least 10 letters long')),
	birth_date: z.optional(z.string().regex( /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, "Date must be in YYYY-MM-DD format" )),
	height_cm: z.optional(z.number().int().min(55, 'tall must not be smaller than 55cm').max(280, 'tall must not be more than 280cm')),
	children_count: z.optional(z.number().int().min(0, 'children count must be 0 or more').max(40, 'children count must not be more than 40')),
	nationality: z.optional(z.string().max(100, 'image url must not be more than 100 letters')),
	image: z.optional(z.instanceof(File).refine(
		(file) => file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp" || file.type === "image/jpg",
		{ message: "poster must be a PNG, JPG, Webp or JPEG image" }
	)),
	genresList: z.optional(z.array(z.number().int()).min(1, "No Genres Choosen"))
});

// add people awards validation
export const addPeopleAwardsValidation = z.object({
	person_id: z.number().int().min(0, "person ID is required"),
	genre_name: z.string(),
	awarded_at: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, "Date must be in YYYY-MM-DD format")
});

// delete people awards validation
export const deletePeopleAwardsValidation = z.object({
	person_id: z.number().int(),
	genre_id: z.number().int(),
	awarded_at: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, "Date must be in YYYY-MM-DD format")
});

// content ----

// add new content
export const addContentValidation = z.object({
	title: z.string().min(1, 'title must be at least 1 letters long').max(255, 'title must not be more than 255 letters'),
	summary: z.string().min(1, 'summary must be at least 1 letters long'),
	poster: z.instanceof(File).refine( 
		(file) => file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp" || file.type === "image/jpg",
		{ message: "poster must be a PNG, JPG, Webp or JPEG image" }
	),
	trailer: z.optional(z.instanceof(File).refine( 
		(file) => file.type === "video/mp4",
		{ message: "poster must be a PNG or JPEG image" }
	)),
	release_month: z.number().int().min(1, 'release month value must be 1 at less').max(12, 'release month value must not be more than 12'),
	release_year: z.number().int().min(1890, 'release year value must be 1890 at less'),
	duration_minutes: z.number().int().min(1, "you must enter duration minutes"),
	filming_location: z.optional(z.string().max(255, 'filming location must not be more than 255 letters')),
	budget: z.optional(z.number().int()),
	revenue: z.optional(z.number().int()),
	country: z.string().min(1, "country is required").max(100, 'country name must not be more than 100 letters'),
	is_expected_popular: z.optional(z.boolean()),
	release_date: z.optional(z.string().regex( /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, "Date must be in YYYY-MM-DD format" )) ,
	language: z.optional(z.string().max(50, 'language name must not be more than 50 letters')),
	c_status: z.enum(['upcoming','available','hidden'], {
		errorMap: () => ({message: "content status must be one of  this values ['upcoming','available','hidden']"})
	}),
	season_number: z.number().int().min(1, 'season number value must be 1 at less'),
	episodes_count: z.optional(z.number().int().min(0, 'episodes_count value must be 0 at less')),
	content_type: z.enum(['M', 'S'], {
		errorMap: () => ({message: "content type must value can be M or S"})
	})
});

//edit content validation 
export const editContentValidation = z.object({
	title: z.optional(z.string().min(1, 'title must be at least 1 letters long').max(255, 'title must not be more than 255 letters')),
	summary: z.optional(z.string().min(1, 'summary must be at least 1 letters long')),
	poster: z.optional(z.instanceof(File).refine( 
		(file) => file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp" || file.type === "image/jpg",
		{ message: "poster must be a PNG, JPG, Webp or JPEG image" }
	)),
	trailer: z.optional(z.instanceof(File).refine( 
		(file) => file.type === "video/mp4",
		{ message: "trailer must be a mp4 video" }
	)),
	release_month: z.optional(z.number().int().min(1, 'release month value must be 1 at less').max(12, 'release month value must not be more than 12')),
	release_year: z.optional(z.number().int().min(1890, 'release year value must be 1890 at less')),
	duration_minutes: z.optional(z.number().int().min(1, "you must enter duration minutes")),
	filming_location: z.optional(z.string().max(255, 'filming location must not be more than 255 letters')),
	budget: z.optional(z.number().int()),
	revenue: z.optional(z.number().int()),
	country: z.optional(z.string().min(1, "country is required").max(100, 'country name must not be more than 100 letters')),
	is_expected_popular: z.optional(z.boolean()),
	release_date: z.optional(z.string().regex( /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, "Date must be in YYYY-MM-DD format" )) ,
	language: z.optional(z.string().max(50, 'language name must not be more than 50 letters')),
	c_status: z.optional(z.enum(['upcoming','available','hidden'], {
		errorMap: () => ({message: "content status must be one of  this values ['upcoming','available','hidden']"})
	})),
	season_number: z.optional(z.number().int().min(1, 'season number value must be 1 at less')),
	episodes_count: z.optional(z.number().int().min(0, 'episodes_count value must be 0 at less')),
	content_type: z.optional(z.enum(['M', 'S'], {
		errorMap: () => ({message: "content type must value can be M or S"})
	}))
});

// contetn people relations validation
export const addContentPeopleConnectionValidation = z.array(
	z.object({
		content_id: z.number().int().min(1),
		people_id: z.number().int().min(1),
		role_id: z.number().int().min(1),
		is_lead: z.boolean()
	})
);

// delete comtent member validation
export const deletContentCastMemberValidation = z.object({
	person_id: z.number().int(),
	content_id: z.number().int(),
	role_genre_id: z.number().int(),
})

// add content awards validation
export const addContentAwardsValidation = z.object({
	content_id: z.number().int().min(0, "content ID is required"),
	genre_name: z.string(),
	awarded_at: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, "Date must be in YYYY-MM-DD format")
});

// delete content images validation
export const deletContentImagesValidation = z.object({
	imagesIDS: z.array(z.number().int()).min(1, "no Images Selected To Delete")
})

// news ----

// add new news
export const addNewNewsValidation = z.object({
	title: z.string().min(1, 'title must be at least 1 letters long').max(255, 'title must not be more than 255 letters'),
	body: z.string().min(10, 'news body must be at least 10 letters long'),
	is_about_movies: z.boolean(),
	is_about_series: z.boolean(),
	is_about_people: z.boolean(),
	image: z.instanceof(File).refine(
		(file) => file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp" || file.type === "image/jpg",
		{ message: "poster must be a PNG, JPG, Webp or JPEG image" }
	)
})

// edit news
export const editNewsValidation = z.object({
	title: z.optional(z.string().min(1, 'title must be at least 1 letters long').max(255, 'title must not be more than 255 letters')),
	body: z.optional(z.string().min(10, 'news body must be at least 10 letters long')),
	is_about_movies: z.optional(z.boolean()),
	is_about_series: z.optional(z.boolean()),
	is_about_people: z.optional(z.boolean()),
	image: z.optional(z.instanceof(File).refine( 
		(file) => file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp" || file.type === "image/jpg",
		{ message: "poster must be a PNG, JPG, Webp or JPEG image" }
	))
})

// add news connections
export const addNewsConnectionsValidation = z.object({
	newsID: z.number().int().min(0, "news ID is required"),
	movies: z.optional(z.array(z.number().int())),
	series: z.optional(z.array(z.number().int())),
	people: z.optional(z.array(z.number().int()))
}).refine(
	(data) => data.movies?.length || data.series?.length || data.people?.length,
	{
		message: "At least one of movies, series, or people must be provided"
	}
)

// delete news content relation
export const deleteCNRelValidation = z.object({
	content_id: z.number().int().min(0, "content ID is required"),
	news_id: z.number().int().min(0, "news ID is required"),
})

// delete news people relation
export const deletePNRelValidation = z.object({
	person_id: z.number().int().min(0, "content ID is required"),
	news_id: z.number().int().min(0, "news ID is required"),
})

// ____________________________________________________________________________________________________________

// -- users section

// register
export const registerUserValidation = z.object({
	username: z.string().min(3, 'username must be at least 3 letters long').max(100, 'username must not be more than 100 letters'),
	email: z.email(),
	password: z.string().regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, { 
		message: "Password must be at least 8 characters long and contain at least one uppercase, one lowercase, and one number" 
	})
});

// login
export const loginUserValidation = z.object({
	email: z.email(),
	password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
		message: "Password must be at least 8 characters long and contain at least one uppercase, one lowercase, and one number"
	})
});

// rating
export const addRatingValidation = z.object({
	content_id: z.number().int().min(0, "content ID is required"),
	score: z.number().int().min(1, "rating must be at less 1").max(10, "rating must not be more than 10")
});

// update user info 
export const updateUserValidation = z.object({
	username: z.optional(z.string().min(3, 'username must be at least 3 letters long').max(100, 'username must not be more than 100 letters')),
	bio: z.optional(z.string().min(10, 'bio must be at least 10 letters long').max(400, 'bio must not be more than 400 letters')),
	password_hash: z.optional(z.string().regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, { 
		message: "Password must be at least 8 characters long and contain at least one uppercase, one lowercase, and one number" 
	})),
	profile_image_url: z.optional(z.instanceof(File).refine( 
		(file) => file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp" || file.type === "image/jpg",
		{ message: "profile image must be a PNG, JPG, Webp or JPEG image" }
	)),
	is_watchlist_private: z.optional(z.boolean()),
	is_watched_private: z.optional(z.boolean()),
	is_news_saved_private: z.optional(z.boolean()),
	is_favorite_people_private: z.optional(z.boolean()),
	is_ratings_private: z.optional(z.boolean()),
	email: z.email()
});

// comment--

// add comment
export const addCommentValidation = z.object({
	content_id: z.number().int().min(0, "content ID is required"),
	title: z.string().min(3, "review title must be 3 letters long at least").max(255, "review title must not be more than 255 letters long"),
	body: z.string().min(200, "your review must be at least 200 letters long"),
	is_spoiler_by_author: z.boolean(),
})

// update comment
export const updateCommentValidation = z.object({
	content_id: z.number().int().min(0, "content ID is required"),
	title: z.optional(z.string().min(3, "review title must be 3 letters long at least").max(255, "review title must not be more than 255 letters long")),
	body: z.optional(z.string().min(200, "your review must be at least 200 letters long")),
	is_spoiler_by_author: z.optional(z.boolean()),
})

// add active with comments
export const addActiveWithCommentValidation = z.object({
	comment_id: z.number().int().min(0, "comment ID is required"),
	content_id: z.number().int().min(0, "content ID is required"),
	user_id: z.number().int().min(0, "content ID is required"),
	active: z.enum(['like','spoiler', 'report'])
})

// update user by admin [role and status]
export const updateUserByAdmin = z.object({
	user_id: z.number().int(),
	u_status: z.optional(z.enum(['active','banned', 'nactive'])),
	u_role: z.optional(z.enum(['admin', 'helper', 'user']))
})

// watchlist and watched
export const addWatchListAndWatched = z.object({
	content_id: z.number().int(),
	wl_status: z.enum(['queued','watched'], { 
		errorMap: () => ({ message: "this is not watching status" })
	})
})


// ____________________________________________________________________________________________________________

// -- OTP section

// otp
export const codeOTPValidation = z.object({
	sendingCode: z.string().min(6, "uncurrect OTP Code").max(6, "uncurrect OTP Code")
})
export const clientOTPValidation = z.object({
	num1: z.number().min(0, "Each cell must contain one number between 0 and 9").max(9, "Each cell must contain one number between 0 and 9"),
	num2: z.number().min(0, "Each cell must contain one number between 0 and 9").max(9, "Each cell must contain one number between 0 and 9"),
	num3: z.number().min(0, "Each cell must contain one number between 0 and 9").max(9, "Each cell must contain one number between 0 and 9"),
	num4: z.number().min(0, "Each cell must contain one number between 0 and 9").max(9, "Each cell must contain one number between 0 and 9"),
	num5: z.number().min(0, "Each cell must contain one number between 0 and 9").max(9, "Each cell must contain one number between 0 and 9"),
	num6: z.number().min(0, "Each cell must contain one number between 0 and 9").max(9, "Each cell must contain one number between 0 and 9"),
});


// ____________________________________________________________________________________________________________

// -- messages section

// user send messages
export const userMessage = z.object({
	title: z.string().min(3, "message title must be 3 letters long at least").max(190, "message title must not be more than 199 letters long"),
	body: z.string().min(10, "your message must be at least 10 letters long"),
	reply_to_id: z.optional(z.number().int())
})

// admin send messages
export const adminMessage = z.object({
	title: z.string().min(3, "message title must be 3 letters long at least").max(190, "message title must not be more than 199 letters long"),
	body: z.string().min(10, "your message must be at least 10 letters long"),
	resever_id: z.number().int(),
	reply_to_id: z.optional(z.number().int())
})

// ____________________________________________________________________________________________________________

// -- global section

//  form {id, deleteArray(numbers), addArray(numbers)}
export const checkAddArDeleteAr = z.object({
	id: z.number().int(),
	AddArray: z.array(z.number().int()).min(0),
	deleteArray: z.array(z.number().int()).min(0)
})

// check peoples Ids List and roles ids list 
export const PeopleAndRolesLists = z.object({
	peopleIDs: z.array(z.number().int()).min(1),
	rolesIDsSet: z.array(z.number().int()).min(1)
})

// check email 
export const checkEmail = z.object({
	email: z.email()
})

// check password 
export const checkPass = z.object({
	password: z.string().regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, { 
		message: "Password must be at least 8 characters long and contain at least one uppercase, one lowercase, and one number" 
	})
})