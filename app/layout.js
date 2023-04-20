import Providers from './components/Provider';
import '~/styles/tailwind.css';

export const metadata = {
    title: 'Ban học tập Công nghệ Phần mềm',
    description: 'Ban học tập Đoàn khoa Công nghệ Phần mềm',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
        other: {
            rel: 'apple-touch-icon-precomposed',
            url: '/favicon.ico',
        },
    },
    openGraph: {
        title: 'Ban học tập Công nghệ Phần mềm',
        description: 'Ban học tập Đoàn khoa Công nghệ Phần mềm',
        siteName: 'Ban học tập Công nghệ Phần mềm',
        images: [
            {
                url: '/images/thumbnail.png',
            },
        ],
        type: 'website',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
            <head />
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
