import ToastContainerClient from '../components/ToastContainerClient';
import Sidebar from './components/Sidebar';

export default function Layout({ children }) {
    return (
        <div className="bg-gray-100">
            <Sidebar />
            <div className="pl-w-sidebar">{children}</div>
            <ToastContainerClient autoClose={4000} />
        </div>
    );
}
