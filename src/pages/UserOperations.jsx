import React, { useContext, useEffect, useState } from 'react'

import { confirmPasswordReset,applyActionCode } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import Header from '../components/Header';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2'
import { UserContext } from '../context/user-context';

const UserOperations = () => {
    const navigate = useNavigate();
    const {setIsVerificationSended} = useContext(UserContext);
    const [searchParams] = useSearchParams();
    const [firstPassword,setFirstPassword] = useState("");
    const [secondPassword,setSecondPassword] = useState("");
    const [oobCode,setoobCode]=useState("");
    const [mode,setMode] = useState("");

    useEffect(() => {
      const modeUrl = searchParams.get("mode"); 
    const oobCodeUrl = searchParams.get("oobCode"); 
    if ( (modeUrl!="resetPassword" && modeUrl!="verifyEmail" ) || !oobCodeUrl) {
      navigate("/"); 
    }
    else{
      setMode(modeUrl);
      setoobCode(oobCodeUrl);
      if(modeUrl=="verifyEmail"){
        verifyEmail(oobCodeUrl);
      }
       
    }
  }, [searchParams, navigate]);

  const verifyEmail=(code)=>{
    if (code) {
      // Şifre sıfırlama kodunu doğrula
      setIsVerificationSended(true);
      applyActionCode(auth, code)
        .then(() => {
         
          Swal.fire({
            position: "center-center",
            icon: "success",
            text: "Hesabınız başarıyla doğrulandı.",
            showConfirmButton: true,
            confirmButtonColor:"#2DA15F",   
            timer:1000,
          }).then((result) => {
            navigate("/profile");
          })
        })
        .catch((error) => {
          setIsVerificationSended(false);
          let errorMessage = '';

        switch (error.code) {
          case 'auth/invalid-action-code':
            errorMessage = 'Geçersiz doğrulama kodu. Lütfen doğru bir bağlantı kullanın.';
            break;
          case 'auth/expired-action-code':
            errorMessage = 'Doğrulama kodunun süresi dolmuş. Lütfen tekrar deneyin.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Bu kullanıcı hesabı devre dışı bırakılmış. Daha fazla bilgi için destekle iletişime geçin.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Bu doğrulama koduyla eşleşen bir kullanıcı bulunamadı.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Geçersiz e-posta adresi. Lütfen doğru bir e-posta girin.';
            break;
          case 'auth/invalid-continue-uri':
            errorMessage = 'Geçersiz yönlendirme URL’si. Lütfen geçerli bir bağlantı sağlayın.';
            break;
          case 'auth/missing-continue-uri':
            errorMessage = 'Yönlendirme URL’si eksik. Lütfen bağlantıyı kontrol edin.';
            break;
          default:
            errorMessage = 'Bir hata oluştu: ' + error.message;
        }

        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Hata',
          text: errorMessage,
          showConfirmButton: true,
          confirmButtonColor: '#2DA15F',
        }).then((result) => {
             navigate("/");
        });

        });
    }

  }

  const handleResetPassword=async()=>{
    if(oobCode){
        if(firstPassword==secondPassword){          
            try {
                await confirmPasswordReset(auth, oobCode, firstPassword);
                 Swal.fire({
                                position: "center-center",
                                icon: "success",
                                text: "Şifreniz başarıyla sıfırlandı.",
                                showConfirmButton: true,
                                confirmButtonColor:"#2DA15F",
                                
                              }).then((result) => {
                                navigate("/");
                              })
              } catch (error) {
                let errorMessage = '';
              
       
                switch (error.code) {
                  case 'auth/invalid-email':
                    errorMessage = 'Geçersiz e-posta adresi.';
                    break;
                  case 'auth/user-not-found':
                    errorMessage = 'Bu e-posta adresine kayıtlı bir kullanıcı bulunamadı.';
                    break;
                  case 'auth/invalid-action-code':
                    errorMessage = 'Geçersiz şifre sıfırlama kodu.';
                    break;
                  case 'auth/expired-action-code':
                    errorMessage = 'Şifre sıfırlama kodu süresi dolmuş.';
                    break;
                  case 'auth/invalid-continue-uri':
                    errorMessage = 'Geçersiz URL, lütfen geçerli bir bağlantı kullanın.';
                    break;
                  case 'auth/missing-continue-uri':
                    errorMessage = 'URL eksik. Lütfen geçerli bir bağlantı sağlayın.';
                    break;
                  default:
                    errorMessage = 'Bir hata oluştu: ' + error.message;
                }
              
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'Hata',
                  text: errorMessage,
                  showConfirmButton: true,
                  confirmButtonColor: '#2DA15F',
                }).then((result) => {
                     navigate("/");
                });
              }
            };

        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Hata',
            text: "Girilen şifreler aynı olmalıdır.",
            showConfirmButton: true,
            confirmButtonColor: '#2DA15F',
          })
        }
    }

  
  


  return (
    <div className='h-screen w-full flex justify-center items-center'>
        
        <Header/>
        <div className='fixed top-0 left-0 h-16 bg-[#2DA15F] w-full'></div>
        {mode=="resetPassword" ? (
    <div className='rounded-md min-[450px]:w-[400px] w-full mx-4 p-3 bg-slate-100 justify-center items-center flex-col flex gap-2'>
    <span className='mt-12 mb-4 text-3xl font-semibold text-[#2DA15F]'>Merhaba!</span>
    <span className='w-[80%] text-center '>Şifre sıfırlama menüsüne hoşgeldin. </span>



    <div className='flex py-12 justify-center items-center flex-col w-full gap-4 px-4'>

    <input type="password"
     placeholder='Yeni Şifre'
     value={firstPassword}
     onChange={(e) => setFirstPassword(e.target.value)}
     required
    className='h-[50px] font-medium px-3 py-1 outline-none rounded-lg bg-[#ffffff] w-full' />

<input type="password"
     placeholder='Yeni Şifre Tekrarı'
     value={secondPassword}
     onChange={(e) => setSecondPassword(e.target.value)}
     required
    className='h-[50px] font-medium px-3 py-1 outline-none rounded-lg bg-[#ffffff] w-full' />

<input onClick={()=>{handleResetPassword()}} className='w-full mt-6  bg-[#2DA15F] rounded-lg shadow-lg cursor-pointer font-medium h-[50px]' type="submit" value={"Sıfırla"} />

</div>
    </div>
) : <div className='text-lg text-center'>Hesabınız başarıyla doğrulandı. Giriş yapabilirsiniz.  <br />
&#127881;
&#127881;
&#127881;
&#127881;
</div> } 
      
    </div>
  )
}

export default UserOperations