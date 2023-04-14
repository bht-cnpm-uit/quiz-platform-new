'use client';

import { collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '~/configs/firebase';
import { userSelector } from '~/redux/selectors/userSelector';

export default function UserPage() {
    const currentUser = useSelector(userSelector);

    const [users, setUsers] = useState([]);
    useEffect(() => {
        const usersQuery = query(collection(db, 'users'), orderBy('createdAt'));
        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
            const usersDocSnaps = snapshot.docs;

            const users = usersDocSnaps.map((docSnap) => {
                return { id: docSnap.id, ...docSnap.data() };
            });
            setUsers(users);
        });
        return () => {
            unsubscribeUsers();
        };
    }, []);

    async function handleChangeAdminRole(id) {
        try {
            const userRef = doc(db, 'users', id);
            const userSnapshot = await getDoc(userRef);
            if (!userSnapshot.exists()) {
                return;
            }
            const user = userSnapshot.data();

            await updateDoc(userRef, {
                isAdmin: user.isAdmin ? false : true,
            });
        } catch (error) {
            console.log(error);
        }
    }
    async function handleChangeEditorRole(id) {
        try {
            const userRef = doc(db, 'users', id);
            const userSnapshot = await getDoc(userRef);
            if (!userSnapshot.exists()) {
                return;
            }
            const user = userSnapshot.data();

            await updateDoc(userRef, {
                isEditor: user.isEditor ? false : true,
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="mx-auto max-w-[900px] pt-5">
            <p className="mt-10 mb-3 font-bold">Tài khoản của bạn</p>
            <div className="rounded bg-white p-3">
                <div className="flex items-center">
                    <img className="h-12 w-12 rounded-full border object-cover" src={currentUser.avatar} />
                    <div className="ml-3 flex-1">
                        <p className="font-semibold">{currentUser.name}</p>
                        <p className="text-sm text-gray-600">{currentUser.email}</p>
                    </div>
                </div>
            </div>

            <p className="mt-5 mb-3 font-bold">Danh sách tài khoản</p>

            <div className="rounded bg-white">
                <p className="p-3 font-bold">Admin:</p>
                {users
                    .filter((user) => user.isAdmin)
                    .map((user) => (
                        <div key={user.id} className="flex items-center border-b py-2 px-3">
                            <img className="h-12 w-12 rounded-full border object-cover" src={user.avatar} />
                            <div className="ml-3 flex-1">
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div
                                    className="flex cursor-pointer rounded border px-3 py-2"
                                    onClick={() => handleChangeAdminRole(user.id)}
                                >
                                    <input type="checkbox" readOnly checked={user.isAdmin} />
                                    <span className="ml-2">Admin</span>
                                </div>
                                <div
                                    className="flex cursor-pointer rounded border px-3 py-2"
                                    onClick={() => handleChangeEditorRole(user.id)}
                                >
                                    <input type="checkbox" readOnly checked={user.isEditor} />
                                    <span className="ml-2">Editor</span>
                                </div>
                            </div>
                        </div>
                    ))}
                <p className="p-3 font-bold">Editor:</p>
                {users
                    .filter((user) => user.isEditor && !user.isAdmin)
                    .map((user) => (
                        <div key={user.id} className="flex items-center border-b py-2 px-3">
                            <img className="h-12 w-12 rounded-full border object-cover" src={user.avatar} />
                            <div className="ml-3 flex-1">
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div
                                    className="flex cursor-pointer rounded border px-3 py-2"
                                    onClick={() => handleChangeAdminRole(user.id)}
                                >
                                    <input type="checkbox" readOnly checked={user.isAdmin} />
                                    <span className="ml-2">Admin</span>
                                </div>
                                <div
                                    className="flex cursor-pointer rounded border px-3 py-2"
                                    onClick={() => handleChangeEditorRole(user.id)}
                                >
                                    <input type="checkbox" readOnly checked={user.isEditor} />
                                    <span className="ml-2">Editor</span>
                                </div>
                            </div>
                        </div>
                    ))}
                <p className="p-3 font-bold">Khác:</p>
                {users
                    .filter((user) => !user.isEditor && !user.isAdmin)
                    .map((user) => (
                        <div key={user.id} className="flex items-center border-b py-2 px-3">
                            <img className="h-12 w-12 rounded-full border object-cover" src={user.avatar} />
                            <div className="ml-3 flex-1">
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div
                                    className="flex cursor-pointer rounded border px-3 py-2"
                                    onClick={() => handleChangeAdminRole(user.id)}
                                >
                                    <input type="checkbox" readOnly checked={user.isAdmin} />
                                    <span className="ml-2">Admin</span>
                                </div>
                                <div
                                    className="flex cursor-pointer rounded border px-3 py-2"
                                    onClick={() => handleChangeEditorRole(user.id)}
                                >
                                    <input type="checkbox" readOnly checked={user.isEditor} />
                                    <span className="ml-2">Editor</span>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
