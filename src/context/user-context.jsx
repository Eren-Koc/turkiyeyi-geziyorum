import React, { createContext, useEffect, useState } from 'react'
import { auth, db, storage } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc,setDoc,getDocs,collection,addDoc,deleteDoc } from 'firebase/firestore';
import { getDownloadURL, ref ,getStorage, uploadBytes,deleteObject, getMetadata } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import Swal from 'sweetalert2'
export const UserContext =createContext(null);


export const UserContextProvider = (props) => {


    const [currentUserAuth,setCurrentUserAuth] = useState(null);
    const Cities = [
      "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", 
      "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", 
      "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", 
      "Gaziantep", "Giresun", "Gümüşhane", "Hakkâri", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", 
      "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", 
      "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", 
      "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", 
      "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", 
      "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
    ];
    const [traveledCities,setTraveledCities] = useState([]);
    const [allImagesCount,setAllImagesCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [user,setUser] = useState(null);
    const [publicPosts,setPublicPosts] = useState([]);
   
    const [autoVerificationConfirm,setAutoVerificationConfirm] = useState(false);
    const [storageLimitOfUser,setStorageLimitOfUser] = useState(100);
    
    const defaultProfilePictures=["https://firebasestorage.googleapis.com/v0/b/travel-app-93279.firebasestorage.app/o/profilePictures%2Fman.png?alt=media&token=f6a8faf1-41f4-431b-8794-826aa6c7908b",
      "https://firebasestorage.googleapis.com/v0/b/travel-app-93279.firebasestorage.app/o/profilePictures%2Fwoman.png?alt=media&token=80fb5f99-817f-4754-9f41-5ae3bf6d85a0",
      "https://firebasestorage.googleapis.com/v0/b/travel-app-93279.firebasestorage.app/o/profilePictures%2Fother.png?alt=media&token=fad89880-7e2d-4422-b37e-e04a71efc545"];
    const defaultBanner="https://firebasestorage.googleapis.com/v0/b/travel-app-93279.firebasestorage.app/o/banners%2Fbg.jpg?alt=media&token=4d137226-bac0-4d4a-a631-a435a2770975";
      
  
  

   useEffect(()=>{
    
    const unsubsribe = onAuthStateChanged(auth , (authUser) => { 

      

        if(authUser && authUser.emailVerified)
        {
            setCurrentUserAuth(authUser);
            getUserData(authUser.uid);
            getPublicPostData();
            setLoading(false);
            

            return;
        }

        setCurrentUserAuth();
        setUser();
        getPublicPostData();
       setLoading(false);

        
    })

    return()=> unsubsribe();
    
   },[autoVerificationConfirm])
   

   const closeLoginForm=()=>{
    const form = document.getElementById('login-form');
    form.style.display="none";     
    
}
   
    
   const getUserData = async (userId) => {
    try {
        const userRef = doc(db, "Users", userId); 
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          
            setUser(userSnap.data());
            setStorageLimitOfUser(userSnap.data().premium ? 300 : 100);
            
        } else {
  
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
};

const PostUpload = async (title, desc, city, date, images, id, postState) => {
  try {
    const userRef = doc(db, "Users", id);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      
      
      const currentUsage = userData.storageUsage || 0;

      const totalImageSizeInMB = images.length>0 ?  images.reduce((total, image) => total + image.size / (1024 * 1024), 0) : 0;

      
      if (currentUsage + totalImageSizeInMB > storageLimitOfUser) {
        Swal.fire({
          position: "center-center",
          icon: "error",
          title:"Gönderi eklenemedi.",
          text: "Eklemeye çalıştığınız gönderiyle birlikte kullanıcı limitinizi aşıyorsunuz. Daha küçük boyutta dosyalar eklemeyi deneyin veya başka gönderilerinizi silmek alan açmanızı sağlayabilir.",
          showConfirmButton: true,
          confirmButtonColor: "#2DA15F",
         
    });
        
        return;
      }

      let updatedPosts = [...(userData.posts || [])];

      const imagesUrl = images.length >0 ? await Promise.all(
        images.map(async (eachImage) => {
          const imageRef = ref(storage , ` images/${eachImage.name + uuidv4()}`);
          const snapshot = await uploadBytes(imageRef, eachImage);
          return getDownloadURL(snapshot.ref);
        })
      ) : [];
      
  

      let postId = uuidv4();

      const post = {
        id: postId,
        title: title,
        user_id: id,
        create_date: date || new Date().toISOString(),
        images: imagesUrl,
        desc: desc,
        city: city,
        public: postState,
      };

      updatedPosts.push(post);

      await updateDoc(userRef, {
        posts: updatedPosts,
        storageUsage: currentUsage + totalImageSizeInMB , 
      });

      if (postState) {
        const newPost = {
          ...post,
          username: userSnap.data().name,
          profilePicture: userSnap.data().photoURL,
        };
        CreatePublicPost(newPost);
      }

      await getUserData(userData.id);
    } else {
      console.error("Kullanıcı bulunamadı.");
    }
  } catch (error) {
    console.error("Hata:", error);
  }
};

  const Logout =()=>{
    auth.signOut();
    setCurrentUserAuth();
  }

const PostUpdate =async (title, desc, city, date, images, userId,postState,firebaseImages,post)=>{


  try {
    
    const userRef = doc(db, "Users", userId);
    const userSnap = await getDoc(userRef);
  
    if (userSnap.exists()) {

      const userData = userSnap.data(); 


      const currentUsage = userData.storageUsage || 0;
      let UpdateMBCost=0;
      const totalImageSizeInMB = images.reduce((total, image) => total + image.size / (1024 * 1024), 0);
      

      const differentImages = [
        ...post.images.filter(item => !firebaseImages.includes(item)), 
        ...firebaseImages.filter(item => !post.images.includes(item))  
      ];
      
      const deletedImageSizes = await Promise.all(
        differentImages.map(async (eachImageURL) => {
          const fileSizeInMB = await getFileSize(eachImageURL); 
          return fileSizeInMB;
        })
      );
      
      const totalDeletedImageSizeInMB = deletedImageSizes.reduce((total, size) => total + size, 0);
      
      UpdateMBCost -= totalDeletedImageSizeInMB; 

      UpdateMBCost+=totalImageSizeInMB;

      
      if (currentUsage + UpdateMBCost > storageLimitOfUser) {
        console.error("Eklediğiniz dosya boyutu kullanıcı limitini aşıyor. Dosya yüklenemedi.");
        return;
      }
      
      const OldPublicStatus =post.public;

      let updatedImages = post.images.filter(item => firebaseImages.includes(item));

      if(images.length>0){

        const imagesUrl = await Promise.all(
          images.map(async (eachImage) => {
           const imageRef = ref(storage, `images/${eachImage.name + uuidv4()}`);
           const snapshot = await uploadBytes(imageRef, eachImage);
           return getDownloadURL(snapshot.ref);
         })
       );

       updatedImages.push(...imagesUrl);
       
      }

      const changedPost={
        id:post.id,
        title:title,
      user_id: userId, 
      create_date: date,
      images: updatedImages,
      desc: desc,
      city: city,
      public: postState,
      }

      let updatedPosts = [...(userData.posts || [])];

      const updatedArray = updatedPosts.map(item => item.id === changedPost.id ? changedPost : item);

     

       await updateDoc(userRef, {
       posts: updatedArray,
       storageUsage: currentUsage + UpdateMBCost
       });

     

       deleteImages(differentImages);
       getUserData(userData.id);

       if(OldPublicStatus!=postState){
        if(OldPublicStatus){
          const foundedPost = publicPosts.find((publicPost)=>publicPost.id==changedPost.id)
          if(foundedPost){
            DeletePublicPost(foundedPost.id);
          }
        }
        else{
          const newPost ={
            ...changedPost,
            username:userData.name,
            profilePicture:userData.photoURL
          }
          
          CreatePublicPost(newPost);
        }
        
       }
       else{
        if(postState){

          const newchangedPost ={
            ...changedPost,
            username:userData.name,
            profilePicture:userData.photoURL
          }
          updatePublicPost(newchangedPost,changedPost.id);

        }
       }

    }
    

  } catch (error) {
    console.log(error);
  }

}

const deleteImages = async (firebaseImages) => {
  try {
    const storage = getStorage();

    const imagesArray = Array.isArray(firebaseImages) ? firebaseImages : [firebaseImages];

    for (const eachImage of imagesArray) {
      const filePath = decodeURIComponent(eachImage.split('/o/')[1].split('?')[0]);
      const fileRef = ref(storage, filePath);

      await deleteObject(fileRef);
    }
  } catch (error) {
    console.log(error);
  }
};

const DeletePost =async(post)=>{

  try {
    const userRef = doc(db, "Users", post.user_id);
    const userSnap = await getDoc(userRef);
  
    if (userSnap.exists()) {

      const userData = userSnap.data(); 

      const newPost = userData.posts.filter((eachPost)=>eachPost.id!=post.id);
      const deletedPost = userData.posts.filter((eachPost)=>eachPost.id==post.id);


      const currentUsage = userData.storageUsage || 0;

      const deletedImageSizes = await Promise.all(
        deletedPost[0].images.map(async (eachImageURL) => {
          const fileSizeInMB = await getFileSize(eachImageURL); 
          return fileSizeInMB;
        })
      );
      const totalDeletedImageSizeInMB = deletedImageSizes.reduce((total, size) => total + size, 0);
      
      await updateDoc(userRef, {
        posts: newPost,
        storageUsage:currentUsage - totalDeletedImageSizeInMB
        });

      DeletePublicPost(post.id);
      deleteImages(deletedPost[0].images);
      getUserData(post.user_id);
    }  
  }
   catch (error) {
    console.log(error);
  }

}



const changeImage =async(newImage,userId,imageState)=>{

  const userRef = doc(db, "Users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    
    try {
      if(imageState=="profile_picture"){

        const oldImage = userData.photoURL;
  
        const imageRef = ref(storage, `profilePictures/${newImage.name + uuidv4()}`);
        const snapshot = await uploadBytes(imageRef, newImage);
        const newImageURL = await getDownloadURL(snapshot.ref);

        
    

         await updateDoc(userRef, {
          photoURL: newImageURL,
          });

        const userpublicpostsId = userData.posts.filter((eachPost)=>eachPost.public == true).map(item => item.id);
        publicPostProfilePictureUpdate(userpublicpostsId,newImageURL);
          
        const Founded = defaultProfilePictures.find((eachProfilePicture)=>eachProfilePicture==oldImage)
        if(!Founded){
        
          deleteImages(oldImage);
        }


    }
    else{
      const oldBanner = userData.bannerURL;
  
        const imageRef = ref(storage, `banners/${newImage.name + uuidv4()}`);
        const snapshot = await uploadBytes(imageRef, newImage);
        const newImageURL = await getDownloadURL(snapshot.ref);

         await updateDoc(userRef, {
          bannerURL: newImageURL,
          });
          
          if(oldBanner!=defaultBanner){
            deleteImages(oldBanner);
          }
       
    }
      
    } catch (error) {
      console.log(error);
    }

    getUserData(userData.id);
    
  }
}

const ensurePosts = (data) => {
  return Array.isArray(data) ? data : [data];
};

const updatePublicPost=async(changedPost,id)=>{
  const docRef = doc(db, "PublicPosts", id);
  const docSnap = await getDoc(docRef);

  await updateDoc(docRef, changedPost);

}

const publicPostProfilePictureUpdate=async(posts,newProfilePicture)=>{

  const publicPostsId = ensurePosts(posts);

 try {
  
    const updatePromises = publicPostsId.map(async(id) => {

      const docRef = doc(db, "PublicPosts", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return;
      }
      
      return updateDoc(docRef, {
        profilePicture: newProfilePicture, 
      });
    });


    await Promise.all(updatePromises);

  
  } catch (error) {
    console.error("Belgeler güncellenirken bir hata oluştu:", error);
  }



   

}

const getPublicPostData = async () => {
  try {
    const postsCollectionRef = collection(db, "PublicPosts"); 
    const postsSnapshot = await getDocs(postsCollectionRef);

    if (!postsSnapshot.empty) {
      const posts = postsSnapshot.docs.map((doc) => {
        const data = doc.data();
       

        return {
          id: doc.id,
          ...data,  
        };
      });
      setPublicPosts(posts); 
    } else {
      console.log("No documents found in the collection.");
    }
  } catch (error) {
    console.error("Error getting documents:", error);
  }
};

const CreatePublicPost = async (post) => {
  try {
    if (!post.id) {
      throw new Error("Post nesnesinde bir 'id' alanı bulunmalıdır.");
    }

    const docRef = doc(db, "PublicPosts", post.id);
    await setDoc(docRef, post);

    getPublicPostData();
  } catch (e) {
    console.error("Belge eklenirken bir hata oluştu:", e);
  }
};

const DeletePublicPost=async(id)=>{
 try {
  const docRef = doc(db, "PublicPosts", id);
  const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      await deleteDoc(docRef);
      getPublicPostData();
    }
  } catch (error) {
    console.error("Belge silinirken bir hata oluştu:", error);
  }
}

const checkStorageLimit =()=>{

}

const getFileSize = async (filePath) => {
  const fileRef = ref(storage, filePath);
  const metadata = await getMetadata(fileRef);
  return metadata.size / (1024 * 1024); 
};





    

    const contextValue={currentUserAuth,setCurrentUserAuth,loading,user,PostUpload,getUserData,Logout,PostUpdate,DeletePost,setAutoVerificationConfirm,autoVerificationConfirm,changeImage,CreatePublicPost,publicPosts,Cities,storageLimitOfUser};

    return (
        <UserContext.Provider value={contextValue}>{props.children}</UserContext.Provider>
      )
}