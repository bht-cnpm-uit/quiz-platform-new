import Sidebar from './components/Sidebar';

export default function Layout({ children }) {
    return (
        <div className="flex space-x-4">
            <Sidebar />
            <div className="flex flex-1 justify-center">{children}</div>
        </div>
    );
}
