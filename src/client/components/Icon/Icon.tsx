import React from 'react';

const icons: { [index: string]: { viewBox: string; contents: JSX.Element } } = {
  check: {
    contents: <polyline fill="none" stroke="#000" strokeWidth="1.1" points="4,10 8,15 17,4" />,
    viewBox: '0 0 20 20',
  },
  chevronLeft: {
    contents: <polyline fill="none" stroke="#000" strokeWidth="1.03" points="13 16 7 10 13 4" />,
    viewBox: '0 0 20 20',
  },
  chevronRight: {
    contents: <polyline fill="none" stroke="#000" strokeWidth="1.03" points="7 4 13 10 7 16" />,
    viewBox: '0 0 20 20',
  },
  close: {
    contents: (
      <React.Fragment>
        <line fill="none" stroke="#000" strokeWidth="1.1" x1="4" y1="4" x2="17" y2="17" />
        <line fill="none" stroke="#000" strokeWidth="1.1" x1="17" y1="4" x2="4" y2="17" />
      </React.Fragment>
    ),
    viewBox: '0 0 20 20',
  },
  logo: {
    contents: (
      <React.Fragment>
        <path d="M56 52.31s-14.27-2.79-29.4 12.13S6.25 84 6.25 84s19.6 11.11 40.68-1.74C39.75 63.44 56 52.31 56 52.31zM86.82 52.31s14.31-2.79 29.44 12.13S136.61 84 136.61 84 117 95.14 95.93 82.29c7.18-18.85-9.11-29.98-9.11-29.98z" />
        <path d="M72 105.14S49.47 82.9 49.51 70.3s13.24-18.19 20.9-18.2c6 0 22.3.34 22.3 19 0 14.79-11.12 20.49-20.71 34.04z" />
        <path d="M49.51 86.8s-5.45 4.2-5.45 15.43 7.24 19 27.05 38.28c19.12-17.41 25.64-28.66 26.09-37.28S91.82 86.8 91.82 86.8l-19.51 24zM44.06 88.49a58.65 58.65 0 0 1-9.94 21.92C25.77 121.66 1 126.08 1 126.08s7.35-11.63 8.66-19.69 1.86-15.52 1.86-15.52a62.61 62.61 0 0 0 16.64 1.37c10.15-.37 15.9-3.75 15.9-3.75zM97.22 88.49a58.58 58.58 0 0 0 10 21.92c8.34 11.25 33.09 15.67 33.09 15.67s-7.36-11.63-8.66-19.69-1.86-15.52-1.86-15.52a62.72 62.72 0 0 1-16.65 1.37c-10.14-.37-15.92-3.75-15.92-3.75z" />
        <path d="M1 126.08s7.35-10.74 8.66-18.8 1.86-16.41 1.86-16.41M40.86 112.4s-1.24 2.89-9.09 7.44c-5.29 3.07-10.27 5.79-10.27 5.79l13.55 25.93 21.43-19S46 124.41 40.86 112.4zM100.38 112.76s1.24 2.89 9.09 7.45c5.28 3.06 10.27 5.78 10.27 5.78l-13.55 25.93-21.43-19s10.51-8.15 15.62-20.16zM17.28 126.08s-6.62-.4-9.08 5.28 1.69 7.89-2.85 25.28a122.4 122.4 0 0 0 21.14-12.52zM124.12 127.41s6.62-.4 9.08 5.28-1.68 7.88 2.86 25.28a121.91 121.91 0 0 1-21.15-12.53zM60 135.64s-15.28 9.57-6.88 19.63 18 20.2 18 20.2 14.16-16.8 16.22-20.2 8.85-10.7-5.11-20.2a80.1 80.1 0 0 1-11.59 12.33z" />
        <path d="M33 158l-5-10.58s-4.16 1.11-8.53 6.5c2 16.4 17.05 30.31 17.05 30.31A75.06 75.06 0 0 1 54.2 163.4c-8.53-8.1-9.92-15.53-9.92-15.53zM107.16 158.91l5.16-10.52s4.14 1.17 8.42 6.62c-2.25 16.37-17.53 30.08-17.53 30.08a74.56 74.56 0 0 0-17.35-21c8.66-8 10.16-15.41 10.16-15.41zM15.92 154.78s3.59 15.12 8.37 21.61c-4.78 6.2-12.74 8.7-12.74 8.7s4.59-16.33 2.32-28.45c1.65-2.46 2.05-1.86 2.05-1.86zM124.51 155.68s-3.59 15.12-8.37 21.6c4.78 6.21 12.74 8.7 12.74 8.7s-4.59-16.33-2.32-28.45c-1.65-2.46-2.05-1.85-2.05-1.85z" />
        <path d="M44.06 180.38l-6.09 11L27.76 182s-7 15.68 18.62 29.61c10.1-9.95 7.9-23.23-2.32-31.23zM96 181.27l6.1 11 10.2-9.44s7 15.69-18.62 29.61c-10.06-9.88-7.86-23.17 2.32-31.17zM56.48 168.12s-12.92 8.61 0 20.91 14.16 13.33 14.16 13.33l14.12-15.14s12.6-12 0-20.48c-5.07 7.27-14.05 15.41-14.05 15.41z" />
        <path d="M57.92 196.88s-4.37 7.12 4.22 18.55c6.39 8.49 8.41 11.77 8.41 11.77s1.74-1.52 9-12c9.39-13.69 1.42-17.84 1.42-17.84L70.55 208zM75.43 47.42h-9S67.08 23.58 56 3.78c1.4-3 3.28-3.25 3.28-3.25s13.53 16.61 16.15 46.89z" />
      </React.Fragment>
    ),
    viewBox: '0 0 141.28 227.96',
  },
  menu: {
    contents: (
      <React.Fragment>
        <rect y="9" width="20" height="2" />
        <rect y="3" width="20" height="2" />
        <rect y="15" width="20" height="2" />
      </React.Fragment>
    ),
    viewBox: '0 0 20 20',
  },
  pencil: {
    contents: (
      <React.Fragment>
        <path fill="none" stroke="#000" d="M17.25,6.01 L7.12,16.1 L3.82,17.2 L5.02,13.9 L15.12,3.88 C15.71,3.29 16.66,3.29 17.25,3.88 C17.83,4.47 17.83,5.42 17.25,6.01 L17.25,6.01 Z" />
        <path fill="none" stroke="#000" d="M15.98,7.268 L13.851,5.148" />
      </React.Fragment>
    ),
    viewBox: '0 0 20 20',
  },
  percent: {
    contents: (
      <React.Fragment>
        <path d="M3.57,2.14a2.91,2.91,0,0,1-.14.92A2.14,2.14,0,0,1,3,3.72a1.69,1.69,0,0,1-.57.4,1.8,1.8,0,0,1-.69.13,1.82,1.82,0,0,1-.7-.13,1.48,1.48,0,0,1-.56-.4,1.94,1.94,0,0,1-.38-.66A2.91,2.91,0,0,1,0,2.14a2.84,2.84,0,0,1,.14-.93A1.81,1.81,0,0,1,.52.54,1.62,1.62,0,0,1,1.08.13,1.82,1.82,0,0,1,1.78,0a1.82,1.82,0,0,1,.7.13A1.72,1.72,0,0,1,3,.54a1.82,1.82,0,0,1,.39.67A2.84,2.84,0,0,1,3.57,2.14Zm-.46,0a2.69,2.69,0,0,0-.1-.8A1.54,1.54,0,0,0,2.72.8,1.1,1.1,0,0,0,2.29.49a1.25,1.25,0,0,0-.51-.1,1.25,1.25,0,0,0-.51.1A1.15,1.15,0,0,0,.85.8a1.53,1.53,0,0,0-.28.54,2.66,2.66,0,0,0-.11.8,2.53,2.53,0,0,0,.11.78,1.53,1.53,0,0,0,.28.54,1,1,0,0,0,.42.31,1.25,1.25,0,0,0,.51.1,1.25,1.25,0,0,0,.51-.1,1,1,0,0,0,.43-.31A1.54,1.54,0,0,0,3,2.92,2.55,2.55,0,0,0,3.11,2.14ZM6.79.2,6.88.13A.25.25,0,0,1,7,.1h.41L1.32,8.48a.25.25,0,0,1-.21.11H.7ZM8.15,6.57A2.58,2.58,0,0,1,8,7.49a1.78,1.78,0,0,1-.39.66,1.56,1.56,0,0,1-.56.4,1.8,1.8,0,0,1-1.39,0,1.56,1.56,0,0,1-.56-.4,1.76,1.76,0,0,1-.38-.66,2.82,2.82,0,0,1-.14-.92,2.93,2.93,0,0,1,.14-.93A1.89,1.89,0,0,1,5.11,5a1.56,1.56,0,0,1,.56-.4,1.82,1.82,0,0,1,1.4,0,1.69,1.69,0,0,1,.57.4A2.06,2.06,0,0,1,8,5.64,2.94,2.94,0,0,1,8.15,6.57Zm-.45,0a2.71,2.71,0,0,0-.11-.8,1.53,1.53,0,0,0-.28-.54,1,1,0,0,0-.42-.31,1.34,1.34,0,0,0-.52-.1,1.25,1.25,0,0,0-.51.1,1,1,0,0,0-.42.31,1.54,1.54,0,0,0-.29.54,2.73,2.73,0,0,0-.1.8,2.62,2.62,0,0,0,.1.79,1.54,1.54,0,0,0,.29.54,1,1,0,0,0,.42.3,1.25,1.25,0,0,0,.51.1,1.34,1.34,0,0,0,.52-.1,1,1,0,0,0,.42-.3,1.53,1.53,0,0,0,.28-.54A2.6,2.6,0,0,0,7.7,6.57Z" />
      </React.Fragment>
    ),
    viewBox: '0 0 8.15 8.69',
  },
  ['plus-circle']: {
    contents: (
      <React.Fragment>
        <circle fill="none" stroke="#000" stroke-width="1.1" cx="9.5" cy="9.5" r="9" />
        <line fill="none" stroke="#000" x1="9.5" y1="5" x2="9.5" y2="14" />
        <line fill="none" stroke="#000" x1="5" y1="9.5" x2="14" y2="9.5" />
      </React.Fragment>
    ),
    viewBox: '0 0 20 20',
  },
  ['minus-circle']: {
    contents: (
      <React.Fragment>
        <circle fill="none" stroke="#000" stroke-width="1.1" cx="9.5" cy="9.5" r="9" />
        <line fill="none" stroke="#000" x1="5" y1="9.5" x2="14" y2="9.5" />
      </React.Fragment>
    ),
    viewBox: '0 0 20 20',
  },
  trash: {
    contents: (
      <React.Fragment>
        <polyline fill="none" stroke="#000" points="6.5 3 6.5 1.5 13.5 1.5 13.5 3" />
        <polyline fill="none" stroke="#000" points="4.5 4 4.5 18.5 15.5 18.5 15.5 4" />
        <rect x="8" y="7" width="1" height="9" />
        <rect x="11" y="7" width="1" height="9" />
        <rect x="2" y="3" width="16" height="1" />
      </React.Fragment>
    ),
    viewBox: '0 0 20 20 ',
  },
};

type IconProps = {
  className?: string;
  width?: string | number;
  height?: string | number;
  icon: string;
};

function Icon(props: IconProps) {
  const { icon, className, width, height } = props;

  const svg: {
    viewBox: string;
    contents: JSX.Element;
  } = icons[icon];

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} className={className} viewBox={svg.viewBox}>
      {svg.contents}
    </svg>
  );
}

export default Icon;
