'use client';
import { useSelector } from 'react-redux';
import { userSelector } from '~/redux/selectors/userSelector';

export default function UserDashboardLayout({ children }) {
    const currentUser = useSelector(userSelector);
    return !currentUser.isAdmin ? (
        <div className="pt-28">
            <div className="mx-auto w-[500px] rounded-lg bg-white p-10 shadow">
                <h2 className="mb-1 text-4xl font-semibold">Không có quyền truy cập</h2>
                <p className="mb-4 text-gray-600">Hãy đợi quản trị viên cấp quyền để có thể truy cập 👋</p>
            </div>
        </div>
    ) : (
        children
    );
}
