import Header from './components/Header';
import ToastContainer from './components/ToastContainerClient';

export default function Layout({ children }) {
    return (
        <div className="bg-gray-100">
            <Header />
            <div className="mt-h-header">{children}</div>
            <ToastContainer autoClose={4000} />
        </div>
    );
}
