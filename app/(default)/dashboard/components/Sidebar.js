'use client';
import { signInWithPopup, GoogleAuthProvider, getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { auth } from '~/configs/firebase';
import { userSelector } from '~/redux/selectors/userSelector';

export default function Sidebar() {
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

    return (
        <div className="fixed left-0 top-0 bottom-0 flex w-w-sidebar flex-col bg-white">
            <div className="flex items-center justify-center py-5 text-lg font-bold text-primary">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                    />
                </svg>
                <span className="ml-2">QUẢN LÝ</span>
            </div>
            <div className="mt-2 flex-1">
                <Link href="/dashboard" className="flex items-center border p-2 font-semibold hover:bg-gray-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                    </svg>

                    <span className="ml-2">Trang chủ</span>
                </Link>
                <Link href="/dashboard/quiz" className="flex items-center border p-2 font-semibold hover:bg-gray-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                        />
                    </svg>

                    <span className="ml-2">Bài trắc nghiệm</span>
                </Link>
            </div>
            <div className="mb-3 px-3">
                {currentUser && (
                    <div className="mb-3 w-full space-y-1">
                        <div className="flex items-center">
                            <img className="h-9 w-9 rounded-full border object-cover" src={currentUser.avatar} />
                            <p className="ml-2 flex-1 font-semibold">{currentUser.name}</p>
                        </div>
                        <p className="overflow-clip text-sm">{currentUser.email}</p>
                    </div>
                )}
                <button className="w-full rounded bg-primary py-2 text-white hover:bg-primary-dark" onClick={logout}>
                    Đăng xuất
                </button>
            </div>
        </div>
    );
}
