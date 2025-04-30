'use server';

import { cookies } from "next/headers";
import { auth, db } from "../../../firebase/admin";



const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp( params: SignUpParams) {
     const { uid, name, email} = params;

     try {

        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return{
                success: false,
                message: 'User already exists. Please sign in instead.'
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: 'Account created successfully. Please sign in.'
        }
        
     } catch (error: any) {
        console.error('Error creating a user', error);

        if(error.code === 'auth/email-already-exists'){
            return{
                success: false,
                message: 'THis email is already in use.'
            }
        }

        return {
            success: false,
            message: 'Failed to create an account.'
        }
     }
}


export async function setSessionCookie( idToken: string){

    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK* 1000
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure:  process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })

}


export async function signIn( params: SignInParams) {
    const { email, idToken } = params;

    try {
        
        const userRecored = await auth.getUserByEmail(email);

        if( ! userRecored ){
            return {
                success: false,
                message: 'user does not exist. Create an account insted.'
            }
        }

        await setSessionCookie(idToken);
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: 'Failed to log into an account.'
        }
    }
}


export async function getCurrentUser() : Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if(!userRecord.exists)  return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (error) {
        console.log(error);
        return null;
    }

}


export async function isAutheticated() {
    const user = await getCurrentUser();


    return !!user;  // !{name:'ajikya'} => false ==> ! false -> true
    // !'' => true ==> !true -> false           (!! -> to get object as boolean)
}


export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null>{
    const interviews = await db.collection('interviews').where('userId', "==", userId).orderBy('createdAt', 'desc').get();


    return interviews.docs.map((doc) =>({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null>{

    const { userId, limit  = 20 } = params;

    const interviews = await db
    .collection('interviews')
    .orderBy('createdAt', 'desc')
    .where('finalized', "==", true)
    .where('userId', "!=", userId)
    .limit(limit)
    .get();


    return interviews.docs.map((doc) =>({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}