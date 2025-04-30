import { isAutheticated } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'
import LogoutButton from '@/components/LogoutButton'

const RootLayout = async ({ children } : { children :ReactNode}) => {

  
  
  const isUserAuthenticated = await isAutheticated();


  if( ! isUserAuthenticated)  redirect('/sign-in');

  

  return (
    <div className='root-layout'>
        {/* <nav>
          <Link href="/" className='flex items-center gap-2'>
              <Image src="/logo.svg" alt="Logo" width={38} height={32} />
              <h2 className='text-primary-100'>PrepifyAI</h2>
          </Link>
        </nav> */}

<nav className="flex items-center justify-between px-6 ">
        {/* Left side (Logo) */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepifyAI</h2>
        </Link>

        {/* Right side (Logout button) */}
          <LogoutButton />
      </nav>

        {children}
    </div>
  )
}

export default RootLayout