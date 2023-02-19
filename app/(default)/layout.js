import Header from './components/Header';

export default function Layout({ children }) {
    return (
        <div className="bg-gray-100">
            <Header />
            <div className="mt-h-header">{children}</div>
        </div>
    );
}
