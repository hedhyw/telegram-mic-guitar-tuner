import { Roboto } from 'next/font/google';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Tuner from './components/Tuner';


const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Mic Guitar Tuner</title>
        <meta name="description" content="This is a guitar tuner that uses the microphone to determine the frequency of the sound and help you to correctly adjust each string." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${roboto.className}`}>
        <Tuner />
      </main>
    </>
  );
}
