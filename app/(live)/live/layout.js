import ClientToastContainer from './components/ClientToastContainer';

export default function Layout({ children }) {
    return (
        <>
            {children}
            <ClientToastContainer autoClose={4000} />
        </>
    );
}
