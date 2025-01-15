import React, { useRef, useState } from 'react'
import Header from '../components/Header'
import { CiMicrophoneOn } from "react-icons/ci";
import { GiThink } from "react-icons/gi";
import { FaGithub,FaLinkedin  } from "react-icons/fa";
import { RiGalleryView } from "react-icons/ri";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2'

const Contact = () => {
  const form = useRef();
  const [section,setSection] = useState("");
  const [isSelected,setIsSelected] = useState(false);
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [message,setMessage]=useState("");

  const eamiljsServisId = process.env.REACT_APP_EMAILJS_SERVIS_ID;
  const emailjsTemplateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const emailjsPublicKey=process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  

  const sendEmail = (e) => {
    e.preventDefault();

   
      emailjs.sendForm(eamiljsServisId, emailjsTemplateId, form.current, {
        publicKey: emailjsPublicKey,
      })
      .then(
        () => {
           Swal.fire({
              position: "top-end",
              icon: "success",
              text: "E-posta başarıyla gönderildi.",
              showConfirmButton: false,
              timer: 1000,
        }); 
        setName("");
        setEmail("");
        setMessage("");
        setIsSelected(false);
        setSection("");
        },
        (error) => {
          Swal.fire({
            position: "center-center",
            icon: "error",
            title: "Bir hata oluştu.",
            text:'şuan bu form mevcut değil. contact.erenkoc@gmail.com adresine ulaşabilirsin.',
            showConfirmButton: true,
            confirmButtonColor: "#2DA15F",
            
           
      }); 
        },
      );
  };

  return (
    <div className='flex justify-center items-center w-full min-h-screen'>
    <Header props={"İletişim"} />
    <div className='fixed top-0 left-0 w-full h-16 bg-black'></div>
    
    <div className='flex flex-col max-[700px]:gap-4 pt-20 pb-4 gap-16 max-[1200px]:px-8 max-[600px]:px-4 px-32 justify-evenly overflow-hidden w-full'>
      <div className='flex flex-col gap-2'>
      <span className=' max-[700px]:text-3xl text-5xl font-semibold'>{!isSelected ? 'İletişime Geç' : section=='Help' ? 'Yardım Al' : section=="Suggestion" ?  'Öneri'  :'Premium'}</span>
      <span>{!isSelected ? 'Hemen konuyu seç ve en hızlı çözüme ulaş.' : section=='Help' ? 'Yaşadığın problemi belirt ve en kısa sürede destek al.' : section=="Suggestion" ?  'Projenin geliştirilmesine katkıda bulun.'  :'Daha yüksek kotada fotoğraflar yükle, daha fazla anı depola.'}</span>
      </div>
    
    <div className='w-full grid gap-4 grid-cols-6'>

   {
    !isSelected ? <>
       <div onClick={()=>{setSection("Help"); setIsSelected(true);}} className='col-span-2  max-[900px]:px-4 max-[700px]:col-span-6 flex flex-col hover:bg-[#2DA15F]/20 cursor-pointer gap-8 py-4 px-8 rounded-md min-h-[250px] bg-slate-100'>
       <div className='w-full flex justify-end'>
        <CiMicrophoneOn className='text-[#2DA15F]' size={70}/>
       </div>
       <div className='w-full flex gap-3 flex-col'>
        <span className='font-semibold text-2xl'>Yardım Al!</span>
        <span>Yaşadığın problemi belirt ve en kısa sürede destek al.</span>
       </div>
      </div>
  
      <div onClick={()=>{setSection("Suggestion"); setIsSelected(true);}} className='col-span-2 max-[900px]:px-4 max-[700px]:col-span-6 flex flex-col hover:bg-[#2DA15F]/20 cursor-pointer gap-8 py-4 px-8 rounded-md min-h-[250px] bg-slate-100'>
       <div className='w-full flex justify-end'>
        <GiThink className='text-[#2DA15F]' size={70}/>
       </div>
       <div className='w-full flex gap-3 flex-col'>
        <span className='font-semibold text-2xl '>Öneri !</span>
        <span>Projenin geliştirilmesine katkıda bulun.</span>
       </div>
      </div>
      
      <div onClick={()=>{setSection("Premium"); setIsSelected(true);}} className='col-span-2 max-[900px]:px-4 max-[700px]:col-span-6 flex flex-col hover:bg-[#2DA15F]/20 cursor-pointer gap-8 py-4 px-8 rounded-md min-h-[250px] bg-slate-100'>
       <div className='w-full flex justify-end'>
        <MdOutlineWorkspacePremium className='text-[#2DA15F]' size={70}/>
       </div>
       <div className='w-full flex gap-3 flex-col'>
        <span className='font-semibold text-2xl'>Premium Ol!</span>
        <span>Daha yüksek kotada fotoğraflar yükle, daha fazla anı depola.</span>
       </div>
      </div>
      </> :  
      <div className='pt-12 w-full col-span-6 bg-slate-100  rounded-md relative'>
      <div onClick={()=>{setIsSelected(false); setSection("");}} className='flex gap-2 justify-center absolute top-4 left-4 z-10 cursor-pointer items-center'>
      <IoArrowBackOutline className='' size={25}/>
      <span className='font-medium'>Geri</span>
      </div>
      <form ref={form} onSubmit={sendEmail} className='col-span-6 max-[600px]:px-3 px-8 py-4 grid-cols-2  gap-4 grid '>

      <label className='flex flex-col gap-1 max-[720px]:col-span-2 col-span-2 h-fit'  htmlFor="">
          <span className='text-sm'>Konu</span>
          <input required type="text" placeholder='Eren Koç' readOnly value={section} name='user_subject' className='h-12 outline-none  px-2 rounded-lg' />
        </label>
        <label className='flex flex-col gap-1 max-[720px]:col-span-2 col-span-1 h-fit'  htmlFor="">
          <span className='text-sm'>Adınız Soyadınız</span>
          <input required type="text" placeholder='Eren Koç' name='user_name' value={name} onChange={(e)=>setName(e.target.value)} className='h-12 outline-none  px-2 rounded-lg' />
        </label>
        <label className='flex flex-col gap-1 max-[720px]:col-span-2 col-span-1 h-fit' name='user_email' htmlFor="">
          <span className='text-sm'>E-Mail Adresiniz</span>
          <input required type="email" placeholder='contact.erenkoc@gmail.com' value={email} onChange={(e)=>setEmail(e.target.value)} className='h-12 outline-none px-2 rounded-lg' />
        </label>
        <label className='flex flex-col gap-1 col-span-2' htmlFor="">
          <span className='text-sm'>Mesajınız</span>
          <textarea required className='resize-none outline-none p-2 h-[120px]' value={message} onChange={(e)=>setMessage(e.target.value)} name="message" id=""></textarea>
        </label>
        <input type="submit" className='col-span-2 h-12 mt-4 bg-black font-medium text-white text-lg cursor-pointer rounded-md' />
      </form>
      </div>
      
   }

      

      <div className='col-span-6 h-[100px] max-[600px]:h-[80px] flex items-center justify-evenly rounded-md bg-slate-100'>
        <a href='https://github.com/Eren-Koc' target='blank' className='flex flex-col group items-center justify-center gap-1 w-fit'>
          <FaGithub className='text-[#2DA15F] w-[35px] h-[35px] max-[600px]:w-[25px] max-[600px]:h-[25px] '/>
          <span className=''>Github</span>
        </a>
        <a href='https://www.linkedin.com/in/eren-ko%C3%A7/' target='blank' className='flex flex-col group items-center justify-center gap-1 w-fit'>
          <FaLinkedin className='text-[#2DA15F]  w-[35px] h-[35px] max-[600px]:w-[25px] max-[600px]:h-[25px] ' />
          <span className=''>LinkedIn</span>
        </a>
        <a target='blank' href='' className='flex flex-col group items-center justify-center gap-1 w-fit'>
          <RiGalleryView className='text-[#2DA15F]  w-[35px] h-[35px] max-[600px]:w-[25px] max-[600px]:h-[25px] ' />
          <span className=''>Portfolyo</span>
        </a>
      </div>
      
    </div>

    </div>
    </div>
  )
}

export default Contact