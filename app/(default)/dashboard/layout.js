'use client';
import {
    GoogleAuthProvider,
    getAdditionalUserInfo,
    getAuth,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import ToastContainerClient from '../components/ToastContainerClient';
import Sidebar from './components/Sidebar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '~/redux/slices/userSlice';
import { auth, db } from '~/configs/firebase';
import { userSelector } from '~/redux/selectors/userSelector';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

function IsPermissionLayout({ children }) {
    const currentUser = useSelector(userSelector);
    function logout() {
        signOut(auth)
            .then(() => {
                console.log('logged out');
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return !(currentUser.isAdmin || currentUser.isEditor) ? (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="w-[500px] rounded-lg bg-white p-10 shadow">
                <h2 className="mb-1 text-4xl font-semibold">Không có quyền truy cập</h2>
                <p className="mb-4 text-gray-600">Hãy đợi quản trị viên cấp quyền để có thể truy cập 👋</p>
                <div className="mb-3">
                    <button
                        className="flex h-10 w-full items-center justify-center rounded-md bg-orange-500 px-5 font-medium text-white transition hover:bg-orange-600"
                        onClick={logout}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                        </svg>
                        <span className="ml-2">Đăng xuất</span>
                    </button>
                </div>
            </div>
        </div>
    ) : (
        children
    );
}

function IsLoginLayout({ children }) {
    const currentUser = useSelector(userSelector);
    const provider = new GoogleAuthProvider();
    async function login() {
        try {
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            console.log({ credential });
        } catch (error) {
            console.log(error);
        }
    }
    return !currentUser ? (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="w-[500px] rounded-lg bg-white p-10 shadow">
                <h2 className="mb-1 text-4xl font-semibold">Đăng nhập</h2>
                <p className="mb-4 text-gray-600">Chào bạn, đăng nhập để tiếp tục 👋</p>
                <div className="mb-3">
                    <button
                        className="flex h-10 w-full items-center justify-center rounded-md bg-primary px-5 font-medium text-white transition hover:bg-primary-dark"
                        onClick={login}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                        </svg>
                        <span className="ml-2">Đăng nhập bằng Google</span>
                    </button>
                </div>
            </div>
        </div>
    ) : (
        children
    );
}

export default function Layout({ children }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    async function checkAndCreateUser(user) {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            let userSnapshot = await getDoc(userDocRef);
            console.log({ userSnapshot });
            if (userSnapshot.exists()) {
                return { id: userSnapshot.id, ...userSnapshot.data() };
            }
            await setDoc(userDocRef, {
                avatar: user.photoURL,
                name: user.displayName,
                email: user.email,
                createdAt: serverTimestamp(),
            });
            userSnapshot = await getDoc(userDocRef);
            if (userSnapshot.exists()) {
                return { id: userSnapshot.id, ...userSnapshot.data() };
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                checkAndCreateUser(user)
                    .then((userFromDB) => {
                        if (userFromDB) {
                            console.log('Sign in', user);
                            dispatch(userActions.login(userFromDB));
                        } else {
                            dispatch(userActions.logout());
                            console.log('Not Sign in');
                        }
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                console.log('Not Sign in');
                dispatch(userActions.logout());
                setLoading(false);
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {loading ? (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div role="status">
                        <svg
                            aria-hidden="true"
                            className="mr-2 h-8 w-8 animate-spin fill-primary text-gray-200 dark:text-gray-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ) : (
                <IsLoginLayout>
                    <IsPermissionLayout>
                        <Sidebar />
                        <div className="pl-w-sidebar">{children}</div>
                        <ToastContainerClient autoClose={4000} />
                    </IsPermissionLayout>
                </IsLoginLayout>
            )}
        </div>
    );
}
