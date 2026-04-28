import { DomainPath } from "./DomainPath";

// fetch api function
export async function fetchAPIFunc(urlText, methodName, bodyObj, cookieObj = null, isFormData= false, cache= null, revalidate= null) {
	const fetchObj = methodName === "GET" ? {
		method: `${methodName}`,
		headers:{
			"Content-Type": "application/json"
		}
	} : {
		method: `${methodName}`,
		headers: {},
		body: isFormData ? bodyObj : JSON.stringify(bodyObj)
	}
	if (Object.keys(bodyObj).length > 0 && methodName === "GET") {
		fetchObj.body = JSON.stringify(bodyObj);
	}
	if (cookieObj !== null) {
		fetchObj.headers.Cookie = `jwtToken=${cookieObj}`
	}
	if (!isFormData) {
		fetchObj.headers["Content-Type"] = `application/json`
	}
	if (cache !== null) {
		fetchObj.cache = `${cache}`
	}
	if (revalidate !== null) {
    fetchObj.next = { revalidate: revalidate };
  }
	const fetchedData = await fetch(`${urlText}`, fetchObj);
	return fetchedData;
}
// { cache: 'no-store' }
export async function Logoutfunction() {
	const respons = await fetch(`${DomainPath}/api/users/logout`, {
		method: "GET",
		credentials: "include"
	});
	const result = await respons.json();
	if (respons.status == 200) {
		return 200
	}
	return 0
}

// filtering object from undefined values or any val in array
export function filterObjectInClient (obj, filterArray= null) {
	if (filterArray === null) {
		const filteredObj = Object.fromEntries(
			Object.entries(obj).filter(([_, val]) => val !== undefined )
		);
		return filteredObj;
	} else {
		const filteredObj = Object.fromEntries(
			Object.entries(obj).filter(([_, val]) => val !== undefined && ! filterArray.includes(val) )
		);
		return filteredObj;
	}
}

// append to form data
export function CreateFormData (obj) {
	const formData = new FormData();
	Object.entries(obj).forEach(([key, val]) => {
		if (val instanceof File) {
			formData.append(key, val);
		} else if (Array.isArray(val)) {
			if (val.every((item) => item instanceof File)) {
				val.forEach(file => formData.append(key, file));
			}else {
				formData.append(key, JSON.stringify(val));
			}
		} else if (typeof val === "object") {
			formData.append(key, JSON.stringify(val));
		} else {
			formData.append(key, val);
		}
	})
	return formData;
}

// check if two objects are identical
export function checkTwoObjIdentical (obj1, obj2, ignorePropArray= [], equalValues= []) {
	return Object.keys(obj2).some((key) => {
		if (!ignorePropArray.includes(key)){
			if (equalValues.length > 0) {
				if (equalValues.includes(obj1[key]) && equalValues.includes(obj2[key])) {
					return false
				}
				return obj1[key] != obj2[key]
			}
			return obj1[key] != obj2[key]
		}
		return false
	});
}

// filter object from not updated prop
export function FilterNotUpdatedProp (obj1, obj2, ignorePropArray= []) {
	const newObj = {};
	Object.keys(obj2).forEach((key) => {
		if (!ignorePropArray.includes(key)) {
			if (obj1[key] != obj2[key]) {
				newObj[key] = obj2[key];
			}
		}
	});
	return newObj;
}

// check if two arrays are identical
export function checkTwoArrIdentical (arr1, arr2, isNum= false) {
	if (arr1.length !== arr2.length) return false
	if (isNum) {
		const a1 = arr1.map((item) => parseInt(item));
		const a2 = arr2.map((item) => parseInt(item));
		return a1.every((item) => a2.includes(item));
	}
	return arr1.every((item) => arr2.includes(item));
}

// calc time in hr and min
export function CalcTime (time, Short= false) {
	const numTime = Number(time);
	if (!numTime) return null;
	const hours = Math.floor(numTime / 60);
	const minutes = numTime % 60;
	if (Short) return `${hours}h: ${minutes}m`;
	return `${hours}hr: ${minutes}mins`;
}

// get date form from date 
export function calcAge (date) {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const m = months[new Date(date).getMonth()];
	const y = new Date(date).getFullYear();
	const d = new Date(date).getDate();
	const thisYear = new Date().getFullYear();
	const showDate = thisYear == y ? `${m} ${d}` : `${m} ${d}-${y}`;
	return showDate;
}

// calc rating avg from rating array --> [{score: 1}, {score: 2}, {score: 3} ...]
export function calcAvgRating (ratingsArray) {
	let avg = 0;
	ratingsArray.forEach((rating) => {
		avg += Number(rating.score);
	});
	if (ratingsArray.length === 0) return 0;
	return (avg / ratingsArray.length).toFixed(1);
} 

// calc rating number with format
export function calcRatingNumber (ratingsArray) {
	const count = ratingsArray.length;
	if (count < 1000){
		return count;
	}
	if (count > 1000 && count < 1000000){
		return (count / 1000).toFixed(2) + 'K';
	} 
	if (count > 1000000){
		return (count / 1000000).toFixed(3) + 'M';
	} 
}

// calc rating percentage
export function calcRatingPercentage (ratingsArray, val) {
	const valCount = ratingsArray.filter((item) => item.score === val).length;
	const percentage = valCount > 0 ? valCount / ratingsArray.length * 100 : 0;
	return parseInt(percentage);
}

// get specific rating
export function getSpecificRating (ratingsArray, id) {
	const userRating = ratingsArray.filter((item) => item.user_id === id) || null;
	if (userRating === null || userRating.length === 0) return "Not Rated By This User" 
	return userRating[0].score;
}