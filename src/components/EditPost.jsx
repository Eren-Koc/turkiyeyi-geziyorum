import React, { useContext, useEffect, useRef, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import ChooseCity from './ChooseCity';
import { CiSquarePlus } from "react-icons/ci";


import { MdDateRange } from "react-icons/md";
import { UserContext } from '../context/user-context';
import Loader from './Loader';
import Swal from 'sweetalert2'
const EditPost = ({editPostVisibility,setEditPostVisibility,props,setComponent}) => {

  const {PostUpdate,user} = useContext(UserContext);

 const getTodayValue=()=>{
   const now = new Date();
   const turkishOffset = 3 * 60 * 60 * 1000; 
   const turkishDate = new Date(now.getTime() + turkishOffset);
   const year = turkishDate.getUTCFullYear();
   const month = String(turkishDate.getUTCMonth() + 1).padStart(2, '0');
   const day = String(turkishDate.getUTCDate()).padStart(2, '0');
   const result = `${year}-${month}-${day}`;
   return result;
 
 }
 
   const [today,setToday]=useState(getTodayValue());
   const [selectedCity,setSelectedCity]=useState(props.city);
   const fileInputRef = useRef(null);
      const [images,setImages]=useState([]);
      const [FirebaseImagesURL,setFirebaseImagesUrl] = useState(props.images);
      const [firebaseVideosURL,setFirebaseVideosURL] = useState(props.videos);
      const [createdObjectImages,setCreatedObjectImages] = useState([]);
      const [postState,setPostState] = useState(props.public);
      const [title,setTitle]=useState(props.title);
      const [desc,setDesc]=useState(props.desc)
      const [selectedDate, setSelectedDate] = useState(props.create_date);
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/heic"];

      useEffect(()=>{
        setImages([]);
        setFirebaseImagesUrl(props.images);
        setCreatedObjectImages([]);
        setPostState(props.public);
        setTitle(props.title);
        setDesc(props.desc);
        setSelectedDate(props.create_date);
      },[editPostVisibility])


       useEffect(()=>{
            if(selectedDate > today){
              setSelectedDate(today);
      
            }
          },[selectedDate])

      const handleFileDialogOpen = () => {
        fileInputRef.current.click();
      };

      const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
       
  
        const validFiles = newFiles.filter((file) =>
          allowedTypes.includes(file.type)
        );

       
  
  
        if (images.length > 0 && validFiles.length > 0) {
        
          const acceptedFiles = validFiles.filter(
            (eachFile) => !images.some((eachImage) => eachImage.name === eachFile.name)
          );
        
          if (acceptedFiles.length > 0) {

          

            setImages((prevFiles) => [...prevFiles, ...acceptedFiles]);
            createObjects(acceptedFiles);
            
            
          }
        } else {
          if (validFiles.length > 0) {
           
            setImages((prevFiles) => [...prevFiles, ...validFiles]); 
            createObjects(validFiles);
  
          }
        }

        if (validFiles.length !== newFiles.length) {
          alert("Sadece .jpg, .jpeg, .png, .webp dosyalarını yükleyebilirsiniz!");
        }
        
      };

      const createObjects=(array)=>{
        array.map((eachItem)=>{
          const newObject = {url : URL.createObjectURL(eachItem),name:eachItem.name};
          setCreatedObjectImages((prevFiles) => [...prevFiles, newObject]);
        })
      }

  const handleDeleteExistingImage=(url)=>{

    

    if(url){
      
      const newImages = FirebaseImagesURL.filter((image)=>image != url);
      setFirebaseImagesUrl(newImages);

    }

  }

  const handleDeleteUploadedImage=(url)=>{

    if(url){
    
      const newImages = images.filter((image)=>image.name != url.name);
      const newCreatedImages = createdObjectImages.filter((image)=>image.url != url.url);

      setImages(newImages);
      setCreatedObjectImages(newCreatedImages);

    }

  }

  const handleEdit=()=>{
    setComponent(<Loader size={60}/>)
    PostUpdate(title, desc, selectedCity, selectedDate, images, user.id, postState,FirebaseImagesURL,props).then((result) => {
     setComponent(null);
     setEditPostVisibility(null)
     
     Swal.fire({
      position: "top-end",
      icon: "success",
      text: "Gönderi başarıyla düzenlendi.",
      showConfirmButton: false,
      timer: 1000,
    }); 
    });
  }

  const handleClickInside = (event) => {
    event.stopPropagation();
  };

  return (
    <div onClick={handleClickInside} style={{ display: editPostVisibility ? "flex" : "none" }} className='fixed cursor-default  z-50 top-0 left-0 flex justify-center items-center w-full min-h-screen bg-black/30'>
   
    <div className='w-[450px] max-h-[80vh] overflow-auto h-fit p-3 rounded-lg flex flex-col gap-2 bg-slate-100 '>
  
    <span className='mb-2 font-medium text-lg flex justify-between items-center'>
      Gönderi Düzenle
      <IoClose onClick={()=>{setEditPostVisibility(null)}} className='w-[35px] rounded-lg bg-[#2DA15F] cursor-pointer text-white p-1 h-auto'/>
    </span>
    
    
     
    <div className='post-images max-h-[240px] overflow-auto  flex px-1 flex-wrap gap-1'>
      { props ? FirebaseImagesURL.map((image,i)=>{
        return (
          <div onClick={()=>handleDeleteExistingImage(image,FirebaseImagesURL,setFirebaseImagesUrl)} key={i+"imageurls"} className='group cursor-pointer relative flex justify-center items-center w-fit h-fit'>
             <FaTrash size={25} className='absolute shadow-md backdrop-blur-sm p-1 hidden group-hover:block'/>
        <img src={image} className='w-[100px] h-[90px] rounded-md object-cover object-center' alt="" />
        
        </div>
      )
      }): null}

      
        {
          createdObjectImages ? createdObjectImages.map((createdImage,i)=>{
            return(
              <div onClick={()=>handleDeleteUploadedImage(createdImage)}  key={i+"ern"} className='group cursor-pointer relative flex justify-center items-center w-fit h-fit'>
              <FaTrash size={25} className='absolute shadow-md backdrop-blur-sm p-1 hidden group-hover:block'/>
              <img src={createdImage.url} key={"createdImage-"+i} className='w-[100px] h-[90px] rounded-md object-cover object-center' />
         
         </div>
              
            )
          }) : null

        }
      

      <div title='Fotoğraf Ekle' onClick={()=>handleFileDialogOpen()} className='border rounded-md w-[100px] cursor-pointer h-[90px] flex justify-center items-center'>
      <input ref={fileInputRef} multiple onChange={handleFileChange} accept="image/*"  type="file" />
        <CiSquarePlus size={35} className=' text-[#2DA15F]'/>
      </div>

    </div>
   

    <div className='flex  flex-col px-1 gap-[2px]'>
      <span className='font-medium'>Başlık</span>
      <input type="text" 
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      className='bg-transparent outline-none px-1 border border-[#CBD5E1] h-[40px] rounded-md'  />
    </div>
    
    <div className='flex  flex-col px-1 gap-[2px]'>
      <span className='font-medium'>Açıklama</span>
      <textarea type="text" 
      value={desc}
      onChange={(e) => setDesc(e.target.value)}
      required
      className='bg-transparent resize-none  overflow-auto outline-none p-1 border border-[#CBD5E1] h-[80px] rounded-md'  />
    </div>


<div className='flex  flex-col px-1 gap-[2px]'>
<span className='font-medium'>Şehir</span>
    <ChooseCity  style={'h-[40px] outline-none w-full  cursor-pointer bg-transparent px-2 appearance-none border border-[#CBD5E1] rounded-lg'} selectedCity={selectedCity} setSelectedCity={setSelectedCity}/>
    </div>


    <div className='flex  flex-col px-1 gap-[2px]'>
<span className='font-medium'>Herkese Açık</span>
<select value={postState ? 1 : 0}  onChange={(e) => setPostState(e.target.value === "1")} className='h-[40px] outline-none w-full  cursor-pointer bg-transparent px-2 appearance-none border border-[#CBD5E1] rounded-lg' name="" id="">
  <option value="0">Hayır</option>
  <option value="1">Evet</option>
</select>
    
    </div>
    <div className='flex flex-col px-1 gap-[2px]'>
    <span className='font-medium'>Tarih</span>
      <div className='flex justify-center items-center border px-1 border-[#CBD5E1] rounded-lg'>
    <MdDateRange className='text-[#2DA15F]  pointer-events-none' size={20}/>
    <input
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    max={today}
    id='date-input'  type="date"  className='w-full h-[40px] bg-transparent appearance-none outline-none' />
</div>
   </div>

    <input type='submit' className='h-[40px] bg-[#2DA15F] cursor-pointer rounded-lg font-medium' onClick={()=>handleEdit()} value={'Düzenle'}/>


    </div>





</div>


  )
}

export default EditPost