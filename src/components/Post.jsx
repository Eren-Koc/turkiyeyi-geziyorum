import React, { useContext, useEffect, useState } from 'react'
import { SlOptions } from "react-icons/sl";
import { MdLock } from "react-icons/md";
import antalya from '../images/antalya.jpg';
import { MdVisibility, MdVisibilityOff, MdDateRange,MdOutlineDeleteOutline } from "react-icons/md";

import { CiEdit } from "react-icons/ci";
import Gallery from './Gallery';
import EditPost from './EditPost'; 
import { UserContext } from '../context/user-context';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

const Post = ({props,userData,setComponent}) => {
  
  const navigate=useNavigate();
  const [loading,setLoading]=useState(true);
  const {DeletePost} = useContext(UserContext);

  const [visibleGalleryId, setVisibleGalleryId] = useState(null);
  const [visibleEditPostId,setVisibleEditPostId] = useState(null);
  
  const handleGalleryToggle = (id) => {
    if (!id) {
      console.error("Geçersiz ID: ID undefined veya null");
      return;
    }

  
    setVisibleGalleryId(prevState => prevState === id ? null : id);
  };
  const handleEditPostToggle = (id) => {
    if (!id) {
      console.error("Geçersiz ID: ID undefined veya null");
      return;
    }
    setVisibleEditPostId(prevState => prevState === id ? null : id);
   
  };

  useEffect(()=>{
    if(props){
      setLoading(false);
    }
  })
  const formatDate=(date)=> {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
  }

  

  if(loading){
    return <div>yükleniyor</div>
  }

  const handleDelete=()=>{

    Swal.fire({
      title: "Gönderiyi silmek istediğine emin misin?",
      text: "Bu işlem geri döndürülemez!",
      showDenyButton: true,
      showCancelButton: false,
      icon:"question",
      iconColor:"#2DA15F",
      confirmButtonText: "Evet, Sil!",
      confirmButtonColor:"#2DA15F",
      denyButtonColor:"#aaa",
      denyButtonText: `Vazgeç`
    }).then((result) => {
      if (result.isConfirmed) {

         DeletePost(props).then((result) => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            text: "Gönderi başarıyla silindi.",
            showConfirmButton: false,
            timer: 1000,
          }); 
         });
 
        
      } else if (result.isDenied) {
       
      }
    });

     
  }

  return (
    
    <div  className='flex flex-col w-full h-fit gap-2 my-2'>

      <Gallery images={props.images}  GalleryVisibility={visibleGalleryId === props.id}  setGalleryVisibility={() => setVisibleGalleryId(null)}/>

    
              <div className='flex items-stretch gap-2'>
                 <div className='bg-[#2DA15F] mt-2 w-[3px] rounded-md '>
               
                 
                 </div>
                 

               <div className='post flex-col w-full gap-3'>

               <div className='flex justify-between mb-2 items-center'>
              
              {!userData ?  <div  className='flex justify-center items-center'>
                           <span className='text-xl font-medium '>{props.city} </span>
                           
                           {/* <span className='text-[13px]'>{props.create_date}</span> */}
                           </div> : null }
                       
                       {
                         !userData ? (
                           <div className='flex gap-2 items-center justify-center'>
                       <div style={{backgroundColor: props.public ? '#D5ECDF' : '#F1F5F9' }} className=' flex gap-1 max-[500px]:p-[6px] p-2 rounded-lg justify-center items-center'>
                         {
                           props.public ? <MdVisibility size={18} className='w-[18px] h-[18px] max-[500px]:h-[16px] max-[500px]:w-[16px]'/> : <MdVisibilityOff size={18} className='w-[18px] h-[18px] max-[500px]:h-[16px] max-[500px]:w-[16px]'/>
                         }
                           {/* <MdLock size={18} className='w-[18px] h-[18px] max-[500px]:h-[16px] max-[500px]:w-[16px]'/> */}
                           {/* <span className='text-sm'>{props.public ? "Açık" : 'Özel'}</span> */}
                         </div>
         
                         {
                           props.id ? (
                             <div  onClick={()=>handleEditPostToggle(props.id)} className='relative hover:bg-[#2DA15F]/20  cursor-pointer  rounded-lg p-2 max-[500px]:p-[6px] bg-slate-100'>
                         <CiEdit title='Düzenle' className=''  size={20}/>
                   
                       <EditPost 
                       setComponent={setComponent}
                       editPostVisibility={visibleEditPostId === props.id} 
                       props={props} 
                       setEditPostVisibility={() => setVisibleEditPostId(null)}/>
                       
                       </div>
                           ) : null
                         }
                       
                         
                       <div title='Sil' onClick={()=>handleDelete()} className='relative  cursor-pointer hover:bg-[#2DA15F]/20  rounded-lg p-2 max-[500px]:p-[6px] bg-slate-100'>
                       <MdOutlineDeleteOutline/>
                       </div>
         
                       </div>
                         ) :  <div className='flex gap-3 items-center  justify-center w-fit'>
                         <img src={userData.profilePicture} className='w-[36px] h-[36px] object-center object-cover rounded-full' alt="" />
                         <span className='font-medium'>{userData.username}</span>
                       </div>
                       }
                       
                        
                         </div>  

               <div className=' relative flex flex-col gap-3  rounded-lg w-full h-fit'>
               
                
                {
                  props.id ? (<>

                     
                        <div  className='post-images max-h-[400px] pr-2 mb-9  overflow-y-auto'>
                    <div onClick={() => handleGalleryToggle(props.id)}  className='columns-3 max-[600px]:columns-2 cursor-pointer gap-2 w-full overflow-y-auto'>
                  
                  {
                    props.images.map((eachImage,i)=>{
                     return (
                      <div key={props.id+"-image-"+i} className='mb-2 break-inside-avoid'>
                     <img     
                          src={eachImage}
                          alt="Main"
                          className="w-full object-cover rounded-lg"
                        /> 
                     </div>
                      ) 
                     
                    })
                  }

            
                </div>
                </div>
               
                  </>)  : null
                }
                
              

                  <div className='relative w-full flex flex-col gap-2 h-fit'>              

                  {userData ?   <div className='flex flex-col pl-2'>
                  <span className='text-xl font-medium'>{props.city} </span>
                  {/* <span className='text-[13px]'>{props.create_date}</span> */}
                  </div> : null}

                <div className='rounded-md text-[16px] w-full flex bg-slate-100 px-2 py-3 gap-2 flex-col'>
                {props.create_date ? ( <div className='absolute top-[-40px] min-w-[120px] text-center left-[-10px] z-10 py-[6px] w-fit rounded-r-md bg-[#2DA15F] text-sm font-semibold flex justify-center items-center gap-1 text-white '>
                    <MdDateRange size={18} className=''/>
                    <span>{formatDate(props.create_date)}</span>
                    </div>) : null}
                  <span className='text-lg font-medium'>{props.title}</span>
                <span className='text-sm'>
                  {props.desc}
                  </span>
                </div>
                </div>

                </div>

                </div>
                

               </div>
               </div>
    
  )
}

export default Post