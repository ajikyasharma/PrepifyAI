"use client";
import React from 'react'
import { redirect, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import axios from 'axios'
import { Button } from './ui/button';

const LogoutButton = () => {

    const router = useRouter();

    const handleLogout = async() =>{
        try {
          await axios.get("/api/user/logout")
           toast.success('Logout successfully.')
           router.push('/sign-in')
             
      } catch (error: any) {
          console.log(error);
      }
      }

  return (
    <Button
    onClick={handleLogout}
    className=" btn text-red-600 font-bold cursor-pointer"
  >
    Logout
  </Button>
  )
}

export default LogoutButton