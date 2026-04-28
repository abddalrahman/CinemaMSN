import { verifyTokenFunc } from "./verifyToken";
import fs from "fs";
import path from "path"
import cloudinary from "./cloudinary";

// check if user is admin 
export function checkIfUserIsAdmin (req, justAdmin = false) {
	const userDate = verifyTokenFunc(req);
	if (justAdmin) {
		const isAdmin = userDate?.isAdmin == "admin" ? true : null
		return isAdmin
	}
	const isAdmin = userDate?.isAdmin == "admin" || userDate?.isAdmin == "helper" ? true : null
	return isAdmin
}

// storage image in cloudinary
export async function addFileFunc (file, type) {
	try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = file.name.split('.').pop().toLowerCase();
    const allowedImageExt = ['png', 'jpg', 'webp', 'jpeg'];
    if (type === "m") {
      if (!allowedImageExt.includes(ext)) return "111";
    } else {
      if (ext !== "mp4") return "111";
    }
    return new Promise((resolve) => {
      const uploadfile = cloudinary.uploader.upload_stream(
        {
          resource_type: type === "m" ? "image" : "video",
          folder: "cinema_msn",
        },
        (error, result) => {
          if (error) {
            console.log(error);
            resolve("000");
          } else {
            resolve(result.secure_url); 
          }
        }
      );
      uploadfile.end(buffer);
    });
  } catch (error) {
    console.log(error);
    return "000";
  }
}

// delete file functio
export async function deleteFile(url) {
 try {
    if (!url || !url.startsWith("https://res.cloudinary.com")) return;
    const parts = url.split('/');
    const fileNameWithExt = parts.pop(); 
    const fileName = fileNameWithExt.includes('.') ? fileNameWithExt.slice(0, fileNameWithExt.lastIndexOf('.')) : fileNameWithExt;
    const publicId = `cinema_msn/${fileName}`;
    const resourceType = url.includes("/video/upload/") ? "video" : "image";
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result; // { result: 'ok' } or { result: 'not found' }

  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    return null;
  }
}


// filtering object from undefined values
export function filterObject (obj, filterArray= null, ignoreArray= null) {
	if (filterArray === null) {
		const filteredObj = ignoreArray ? Object.fromEntries(
			Object.entries(obj).filter(([key, val]) => val !== undefined && !ignoreArray.includes(key) )
		): Object.fromEntries(
			Object.entries(obj).filter(([key, val]) => val !== undefined )
		)
		return filteredObj;
	} else {
		const filteredObj = ignoreArray ? Object.fromEntries(
			Object.entries(obj).filter(([key, val]) => val !== undefined && ! filterArray.includes(val) && !ignoreArray.includes(key))
		): Object.fromEntries(
			Object.entries(obj).filter(([key, val]) => val !== undefined && ! filterArray.includes(val))
		)
		return filteredObj;
	}
}

// return Director and Writer
export function getDirectorWriter (peopleData, roleAndNameData, roleName) {
	const roleID = roleAndNameData?.roles.filter((item) => item.name == roleName)[0]?.genre_id || null;
	if (roleID !== null) {
		const PeopleIds = peopleData.filter((person) => person.role_genre_id == roleID) || null;
		if (PeopleIds !== null) {
			const peopleNamesIDs = roleAndNameData?.names.filter((person) => PeopleIds.map((person) => person.person_id).includes(Number(person.person_id)))
			return peopleNamesIDs || []
		} else {
			return [];
		}
	} else {
		return [];
	}
}