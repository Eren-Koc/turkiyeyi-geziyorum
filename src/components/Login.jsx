import React, { useContext, useEffect, useState } from 'react'

import { FcBusinessman,FcBusinesswoman } from "react-icons/fc";
import { BsGenderAmbiguous } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

import { auth,db } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,sendPasswordResetEmail,sendEmailVerification,signOut  } from 'firebase/auth';

import { setDoc,doc } from 'firebase/firestore';
import { UserContext } from '../context/user-context';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'



const Login = () => {


    
    const {currentUser,setCurrentUser,setIsVerificationSended,isVerificationSended} = useContext(UserContext);

    const [register,setRegister]=useState(false);
    
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [name,setName]=useState("");
    const [gender,setGender]=useState(null);
    const navigate = useNavigate();
    const [resetPassword,setResetPassword] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const defaultBanner="https://firebasestorage.googleapis.com/v0/b/travel-app-93279.firebasestorage.app/o/banners%2Fbg.jpg?alt=media&token=4d137226-bac0-4d4a-a631-a435a2770975";
    const websiteUrl = "https://turkiyeyi-geziyorum.vercel.app/user-operations";
    const setProfilePicture=(gender)=>{
        if (gender=="Male")
        return "https://firebasestorage.googleapis.com/v0/b/travel-app-93279.firebasestorage.app/o/profilePictures%2Fman.png?alt=media&token=f6a8faf1-41f4-431b-8794-826aa6c7908b";
        if (gender=="Female") 
        return "https://firebasestorage.googleapis.com/v0/b/travel-app-93279.firebasestorage.app/o/profilePictures%2Fwoman.png?alt=media&token=80fb5f99-817f-4754-9f41-5ae3bf6d85a0";
        if (gender=="Other")
        return "https://firebasestorage.googleapis.com/v0/b/travel-app-93279.firebasestorage.app/o/profilePictures%2Fother.png?alt=media&token=fad89880-7e2d-4422-b37e-e04a71efc545";
    }


    const handleResetPassword = async () => {
        if (resetPassword && email) {
          try {
            if (isSending) return; 
            setIsSending(true); 
      
            await sendPasswordResetEmail(auth, email, {
              url: websiteUrl, 
              handleCodeInApp: true, 
            });
      
            Swal.fire({
              position: "center-center",
              icon: "success",
              text: "Şifre sıfırlama isteği mail adresinize gönderildi.",
              showConfirmButton: true,
              confirmButtonColor: "#2DA15F",
            });
      
            setResetPassword(false);
            setRegister(false);
          } catch (error) {
            console.error("Hata oluştu:", error.message);
          } finally {
            setIsSending(false); 
          }
        } else {
         
        }
      };


    const closeForm=()=>{
        const form = document.getElementById('login-form');
        form.style.display="none";        
    }

    const SignInORSignUp= async (event)=>{
        event.preventDefault();

        if(resetPassword) {
            handleResetPassword();
        }
        else{

       
        if(register){
            if(gender){
              
                try {

                    await createUserWithEmailAndPassword(auth,email,password)
                const user =auth.currentUser;
                if(user){
                    await setDoc(doc(db,"Users",user.uid),{
                        id:user.uid,
                        email:user.email,
                        name:name,
                        gender:gender,
                        premium:false,
                        createdAt:user.metadata.createdAt,
                        photoURL:setProfilePicture(gender),
                        bannerURL:defaultBanner,
                        posts:[],
                        storageUsage:0,

                    });
                }
                    
                    setEmail("");
                    setGender("");
                    setName("");
                    setPassword("");
                    setRegister(false);
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        text: "Başarıyla kayıt olundu.",
                        showConfirmButton: false,
                        timer: 1000,
                      });   
                    
                } catch (error) {
               
                    let errorMessage = "Bir hata oluştu."; 
                
                   
                    if (error.code === "auth/email-already-in-use") {
                        errorMessage = "Bu e-posta adresi zaten kullanılıyor.";
                    } else if (error.code === "auth/invalid-email") {
                        errorMessage = "Geçersiz bir e-posta adresi girdiniz.";
                    } else if (error.code === "auth/weak-password") {
                        errorMessage = "Şifreniz en az 6 karakter uzunluğunda olmalıdır.";
                    } else if (error.code === "auth/operation-not-allowed") {
                        errorMessage = "E-posta ile kayıt olma özelliği devre dışı bırakılmış.";
                    } else if (error.code === "auth/network-request-failed") {
                        errorMessage = "Ağ bağlantısı hatası. Lütfen tekrar deneyin.";
                    }
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        text: errorMessage,
                        showConfirmButton: true,
                        confirmButtonColor: "#2DA15F",
                    });
                }
            

                
                
               
            }
            else{
                Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    text: "Girilen bilgiler eksik.",
                    showConfirmButton: true,
                    confirmButtonColor: "#2DA15F",
                    timer: 1000,
                  });   
                
            }
            
        }
        else{
            try {
            
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

            
            
                if (!user.emailVerified && !isVerificationSended) {
                
                  
                  await sendEmailVerification(user, {
                    url: websiteUrl, 
                    handleCodeInApp: true,
                  });
                  setIsVerificationSended(true);  

                 
                  Swal.fire({
                    position: 'center-center',
                    icon: 'warning',
                    text: 'E-posta adresinizi doğrulamanız gerekiyor. Yeni bağlantı gönderildi.',
                    showConfirmButton: true,
                 confirmButtonColor: "#2DA15F",
                   
                  });
                  return; 
                }
            
            
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  text: "Başarıyla giriş yapıldı.",
                  showConfirmButton: false,
                  timer: 1000,
                });
            
             
                navigate("/profile");
                closeForm(); 
            
              } catch (error) {
        
                Swal.fire({
                  position: "top-end",
                  icon: "error",
                  text: "E-posta veya şifre yanlış.",
                  showConfirmButton: false,
                  timer: 1000,
                });
              }
            
            
        }  
    }
    
    }


useEffect(()=>{

    selectGender();
    
},[gender])

const selectGender = () => {
    const male = document.getElementById("gender-male");
    const female = document.getElementById("gender-female");
    const other = document.getElementById("gender-other");


    if (male) male.style.border = "2px solid #F8FAFC";
    if (female) female.style.border = "2px solid #F8FAFC";
    if (other) other.style.border = "2px solid #F8FAFC";

    if (gender === "Male" && male) {
        male.style.border = "2px solid #2DA15F";
    } else if (gender === "Female" && female) {
        female.style.border = "2px solid #2DA15F";
    } else if (gender === "Other" && other) {
        other.style.border = "2px solid #2DA15F";
    }
};


  return (

    <div id='login-form' style={{display:"none"}} className='z-50 fixed top-0 left-0 w-full h-screen flex bg-black/50 justify-center items-center '>
    
        <form onSubmit={SignInORSignUp} className='rounded-2xl relative py-6 px-3 flex flex-col items-center  min-h-[300px] shadow-md w-[400px] bg-slate-200'>
        <IoClose onClick={()=>{closeForm()}} className='absolute top-3 right-3 cursor-pointer ' size={30}/>
        
        <span className='mt-12 mb-4 text-3xl font-semibold text-[#2DA15F]'>Merhaba!</span>
        <span className='w-[80%] text-center '>Tekrar hoşgeldin. Seni aramızda görmek güzel...</span>


            
        <div className='flex py-12 justify-center items-center flex-col w-full gap-4 px-4'>
        <input type="email"
         placeholder='E-mail'
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         required
        className='h-[50px] font-medium px-3 py-1 outline-none rounded-lg bg-slate-50 w-full' />

{




register && !resetPassword ? (<>
<input 
type="text" 
placeholder='Name'
value={name}
onChange={(e) => setName(e.target.value)}
required
className='h-[50px] font-medium shadow-sm px-3 py-1 outline-none rounded-lg bg-slate-50 w-full' />

<div className='w-full gap-3 flex  justify-start items-center'>

<div id='gender-male' onClick={()=>{setGender("Male")}} className='rounded-3xl  bg-slate-50 w-fit border-2 border-[#F8FAFC] py-2 cursor-pointer px-3 flex justify-center items-center gap-2'>
<FcBusinessman size={18}  />
<span className='text-sm'>Erkek</span>
</div>

<div id='gender-female' onClick={()=>{setGender("Female")}} className='rounded-3xl bg-slate-50 border-2 border-[#F8FAFC] w-fit py-2 cursor-pointer px-3 flex justify-center items-center gap-2'>
<FcBusinesswoman size={18}  />
<span className='text-sm'>Kadın</span>
</div>

<div id='gender-other' onClick={()=>{setGender("Other")}} className='rounded-3xl bg-slate-50 border-2 border-[#F8FAFC] w-fit py-2 cursor-pointer px-3 flex justify-center items-center gap-2'>
<BsGenderAmbiguous size={18} />
<span className='text-sm'>Diğer</span>
</div>

</div>
</>
   
    
) : null

}
        

        

  {
    !resetPassword ? <input type="password"
    placeholder='Password'
    value={password}
   onChange={(e) => setPassword(e.target.value)}
   required
   className='h-[50px] font-medium px-3 py-1 outline-none rounded-lg bg-slate-50 w-full' />  : null
  }
        
        {
            !register && !resetPassword  ? <span onClick={()=>{setResetPassword(true); setRegister(true);}} className='w-full text-right font-medium text-sm cursor-pointer'>Forget Password</span> : null
        }
        

        <input
        onClick={handleResetPassword}
        className='w-full mt-6  bg-[#2DA15F] rounded-lg shadow-lg cursor-pointer font-medium h-[50px]' type="submit" value={!resetPassword ? (register ? 'Kayıt Ol' : 'Giriş Yap') : 'Şifremi Unuttum'} />

        <span onClick={()=>{setRegister(!register); setResetPassword(false);}} className='text-sm mt-6 cursor-pointer'>{ register ? 'Zaten üye misin?' : 'Henüz üye olmadın mı?' }  <span className='font-medium'> {register ? 'Giriş yap.' : 'Üye ol.'}</span></span>   
        </div>




        </form>
     
    </div>
  )
}

export default Login