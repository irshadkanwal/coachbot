import localFont from 'next/font/local';

export const cbi = localFont({
  src: [
    {
      path: '../../public/Icons/coachbot-icons.woff',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../../public/Icons/coachbot-icons.ttf',
      weight: 'normal',
      style: 'normal',
    },
  ],
  variable: '--font-cbi',
});

export const helveticaNow = localFont({
  src: [
    { path: '../../public/HelveticaNow/HelveticaNowDisplay.woff2' },
    { path: '../../public/HelveticaNow/HelveticaNowDisplay.woff' },
  ],
  style: 'normal',
  display: 'swap',
  variable: '--font-helvetica-now',
})