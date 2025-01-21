import React, { useContext, useEffect, useRef, useState } from 'react'
import { IoLocation } from "react-icons/io5";
import { RiArrowDropDownFill } from "react-icons/ri";
import { IoMdPhotos } from "react-icons/io";

import { MdVisibility, MdVisibilityOff,MdDateRange,MdOutlineAddPhotoAlternate } from "react-icons/md";
import '../index.css'
import { UserContext } from '../context/user-context';
import ChooseCity from './ChooseCity';
import { FaTrash } from "react-icons/fa";

import { IoIosInformationCircleOutline } from "react-icons/io";
import Swal from 'sweetalert2'

import Loader from './Loader';
const EnterPost = ({setComponent,component}) => {
  
  const {PostUpload,user,loading,storageLimitOfUser} = useContext(UserContext);


 
 const getTodayValue=()=>{
   const now = new Date();
   const turkishOffset = 3 * 60 * 60 * 1000; 
   const turkishDate = new Date(now.getTime() + turkishOffset);
   const year = turkishDate.getUTCFullYear();
   const month = String(turkishDate.getUTCMonth() + 1).padStart(2, '0'); // Aylar 0 tabanlı
   const day = String(turkishDate.getUTCDate()).padStart(2, '0');
   const result = `${year}-${month}-${day}`;
   return result;
 
 }
 
   const [today,setToday]=useState(getTodayValue());

  const fileInputRef = useRef(null);
    const [selectedCity,setSelectedCity]=useState("");
    const [images,setImages]=useState([]);
    const [createdObjectImages,setCreatedObjectImages] = useState([]);
    const [postState,setPostState] = useState(false);
    const [title,setTitle]=useState("");
    const [desc,setDesc]=useState("")
    const [selectedDate, setSelectedDate] = useState(today);
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/heic"];



    useEffect(()=>{
      if(selectedDate > today){
        setSelectedDate(today);

      }
    },[selectedDate])

    const handleDeleteUploadedImage=(url)=>{

      if(url){
      
        const newImages = images.filter((image)=>image.name != url.name);
        const newCreatedImages = createdObjectImages.filter((image)=>image.url != url.url);
  
        setImages(newImages);
        setCreatedObjectImages(newCreatedImages);
  
      }
  
    }

  

    const handleSubmit= async()=>{

      if(!loading){

        let ErrorArray=[];

        if (title == "") ErrorArray.push("Başlık");
        if (desc == "") ErrorArray.push("Açıklama");
        if (selectedCity == "") ErrorArray.push("Şehir");
        if (images.length < 1) ErrorArray.push("Fotoğraf");

        if(ErrorArray.length<1){  
        try {
          setComponent(<Loader size={60}/>);
          await PostUpload(title, desc, selectedCity, selectedDate, images, user.id, postState);
          
          setTitle("");
          setDesc("");
          setSelectedCity("");
          setImages([]);
          setCreatedObjectImages([]);
          setPostState(false);
          setSelectedDate(today);
          setComponent(null);

          Swal.fire({
            position: "top-end",
            icon: "success",
            text: "Gönderi başarıyla yüklendi.",
            showConfirmButton: false,
            timer: 1000,
          }); 

        } catch (error) {
          console.error("Error during post upload:", error);
       
        }
       
      }
      else{
        Swal.fire({
          position: "center",
          icon: "error",
          title:"Bir hata oluştu.",
          text: displayErrors(ErrorArray),
          showConfirmButton: true,
          confirmButtonColor: "#2DA15F",
        }); 
      }
    }
      

    }

    const displayErrors=(array)=>{
      let result="Eksik bilgiler: ";
      array.map((eachValue,i)=>{
        if(i == array.length - 1){
     
          result+= eachValue;
        }
        else{
          result+=eachValue+", ";
        }
        
      })
      return result;
    }
   

    const handleFileDialogOpen = () => {
      fileInputRef.current.value = '';
      fileInputRef.current.click(); // input'u programatik olarak tetikleme
    };


    const createObjects=(array)=>{
      array.map((eachItem)=>{
        const newObject = {url : URL.createObjectURL(eachItem),name:eachItem.name};
       
          setCreatedObjectImages((prevFiles) => [...prevFiles, newObject]);
        
      })
    }


    const handleFileChange = (event) => {
      const newFiles = Array.from(event.target.files);
      
     

      const validFiles = newFiles.filter((file) =>
        allowedTypes.includes(file.type)
      );

  


      if (images.length > 0 && validFiles.length > 0) {
        // validFiles içinde sadece benzersiz olanları seç
        const acceptedFiles = validFiles.filter(
          (eachFile) => !images.some((eachImage) => eachImage.name === eachFile.name)
        );
      
        if (acceptedFiles.length > 0) {
          setImages((prevFiles) => [...prevFiles, ...acceptedFiles]);
          createObjects(acceptedFiles);
          
          
        }
      } else {
        if (validFiles.length > 0) {
          setImages((prevFiles) => [...prevFiles, ...validFiles]); // Mevcut dosyaları ekle
          createObjects(validFiles);

        }
      }


     

      if (validFiles.length !== newFiles.length) {
        alert("Sadece .jpg, .jpeg, .png, .webp dosyalarını yükleyebilirsiniz!");
      }
      
    };



  return (
    <div className='p-3 rounded-md border relative flex flex-col gap-2 w-full min-h-[200px]'>
   
   {user ?  
   <div  className= {`absolute top-4 flex justify-center items-center gap-1 px-2 py-1 border rounded-xl right-3 text-sm ${user.premium && user ? 'bg-[#7723db]/20 text-[#7723db]' : 'bg-[#2DA15F]/20' } `}>
  
   <span>{Math.floor((storageLimitOfUser - user.storageUsage) * 10) / 10 } MB </span>
   <IoIosInformationCircleOutline title='Kullanılabilir fotoğraf kotanız' className='cursor-pointer' size={16}/>
   </div>: null}

   

<input 
id='title-input' 
value={title}
onChange={(e) => setTitle(e.target.value)}
required
className='flex-1 p-2 outline-none bg-transparent text-lg font-medium border-b border-[#E2E8F0] pr-24' placeholder='Başlık' type="text" />



<textarea 
value={desc}
onChange={(e) => setDesc(e.target.value)}
required
 className='p-2 resize-none bg-transparent italic outline-none  w-full h-[150px]' placeholder='Bir anını sakla...'></textarea>


{
  createdObjectImages.length>0 ? (

<div className='p-3 relative bg-slate-100 flex-col rounded-lg flex  gap-2'>
  <span className='font-medium'>Fotoğraflar</span>
  <div className='flex w-full gap-2 flex-wrap'>
<div className='absolute top-2 right-2 z-10 bg-white py-1 px-[10px] rounded-full font-semibold text-[#2DA15F] border'>{images.length}</div>
  {
    createdObjectImages.map((eachImage,i)=>{
      return (
        <>
        <div onClick={()=>handleDeleteUploadedImage(eachImage)} key={i+"imageurls"} className='group cursor-pointer relative flex justify-center items-center w-fit h-fit'>
                     <FaTrash size={25} className='absolute shadow-md backdrop-blur-sm p-1 hidden group-hover:block'/>
                     <img key={user.id+"-image-"+i} src={eachImage.url} className='w-[120px] h-[100px] rounded-lg object-center object-cover' alt="" />    
                </div>

        
        </>
      )
    })
  }
  </div>
</div>
) : null }




<div className=' gap-4 max-[780px]:grid-cols-1  grid grid-cols-2 items-center'>




 <div onClick={()=>{handleFileDialogOpen()}} className='w-full flex  border h-[40px] cursor-pointer gap-2 rounded-lg px-2 items-center '>
 <input ref={fileInputRef} multiple onChange={handleFileChange} accept="image/*"  type="file" />
    <MdOutlineAddPhotoAlternate className='text-[#2DA15F]' size={20}/>
    <span className=''>Fotoğraf Yükle</span>
</div> 


<div className='w-full border flex px-2  rounded-lg items-center'>
    <IoLocation className='text-[#2DA15F]' size={20}/>
   <ChooseCity style={'h-[40px] outline-none w-full  cursor-pointer bg-transparent px-2 appearance-none rounded-lg'}  selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
<RiArrowDropDownFill className='text-[#2DA15F]' size={20}/>
</div>





<div className='w-full border px-2 items-center flex gap-2 rounded-lg'>
<MdDateRange className='text-[#2DA15F]  pointer-events-none' size={20}/>
<input
value={selectedDate}
onChange={(e) => setSelectedDate(e.target.value)}
max={today}
id='date-input'  type="date"  className='w-full h-[40px] bg-transparent appearance-none outline-none' />
</div>

<div  className=' flex  max-[780px]:justify-center  items-center gap-[6px] border h-[40px] rounded-lg p-2 flex-1'>


<MdVisibilityOff size={20} className='text-[#2DA15F]' title='Özel' />

   <div onClick={()=>{setPostState(!postState)}} style={{justifyContent: postState ? 'end' : 'start'}} className=' border cursor-pointer py-2 justify-start items-center px-1 flex w-[60px] h-[25px] rounded-2xl'>
    
    
    <div className='rounded-full p-2 bg-[#2DA15F]'></div>
   </div>
   

   <MdVisibility size={20} className='text-[#2DA15F]'  title='Herkese Açık'/>


   </div>

    
    </div>


    <input onClick={()=>{handleSubmit()}} type="button" className='outline-none h-[40px] w-full rounded-lg  text-white font-medium bg-[#2DA15F] cursor-pointer ' value={ postState ? 'Herkese Açık | Yükle ' : 'Özel | Yükle'}  />

    </div>
  )
}

export default EnterPost