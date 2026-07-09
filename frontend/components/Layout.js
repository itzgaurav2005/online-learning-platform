import Navbar from './Navbar';
import Head from 'next/head';

export default function Layout({ children, title = 'LearnHub - Online Learning Platform' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Learn new skills with our comprehensive online courses" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>{children}</main>
      </div>
    </>
  );
}
