import {
  initializeApp
} from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes
} from "firebase/storage";
export const errorFileMsg = 'Telah terjadi kesalahan pada upload file!'

function initializeStorage() {
  const settings = Meteor.settings.public
  // console.log(settings)
  const firebaseApp = initializeApp({
    apiKey: settings.FIREBASE_KEY,
    projectId: settings.FIREBASE_PROJECTID,
    storageBucket: settings.FIREBASE_STORAGEBUCKET,
    appId: settings.FIREBASE_APPID,
  });
  const storage = getStorage(firebaseApp);
  return storage
}



uploadImageFile = function (file, identifier, fileName) {
  if (file === undefined) {
    throw new Error('No file!')
  }
  const storage = initializeStorage()
  const imageRef = ref(storage, `${identifier}/${fileName}`)
  return uploadBytes(imageRef, file)
}

// .then((snapshot) => {
//     console.log('Image Uploaded Successfully');
//     console.log(snapshot)
// }).catch((error) => {
//     console.error(error);
//     if(!errorMsg){
//         errorMsg = 'Telah terjadi kesalahan pada upload file!'
//     }
//     throw new Error(errorMsg)
// });

getFireImage = async function (identifier, fileName) {
  const storage = initializeStorage();
  const url = ref(storage, `${identifier}/${fileName}`);
  const downloadUrl = await getDownloadURL(url)
  try {
    return downloadUrl
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}