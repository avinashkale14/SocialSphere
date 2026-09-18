export const getImageUrl = (image) => {
  if (!image) {
    return "";
  }

  const imageValue = String(image).trim();

  if (!imageValue) {
    return "";
  }

  // Complete URL
  if (
    imageValue.startsWith("http://") ||
    imageValue.startsWith("https://") ||
    imageValue.startsWith("blob:") ||
    imageValue.startsWith("data:")
  ) {
    return imageValue;
  }

  // Backend image
  return `https://socialsphere-1b6c.onrender.com/upload/${imageValue}`;
};


export const getAvatarPlaceholder = (
  name = "User"
) => {
  const cleanName =
    String(name || "User").trim();

  const words = cleanName
    .split(/\s+/)
    .filter(Boolean);

  let initials = "U";

  if (words.length >= 2) {
    initials =
      words[0].charAt(0) +
      words[words.length - 1].charAt(0);
  } else if (words.length === 1) {
    initials = words[0].slice(0, 2);
  }

  initials = initials
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 2) || "U";

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 200 200"
    >
      <rect
        width="200"
        height="200"
        rx="100"
        fill="#e9eefb"
      />

      <circle
        cx="100"
        cy="76"
        r="34"
        fill="#6b7cff"
      />

      <path
        d="M42 174c7-35 29-52 58-52s51 17 58 52"
        fill="#6b7cff"
      />

      <text
        x="100"
        y="190"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="1"
        fill="transparent"
      >
        ${initials}
      </text>
    </svg>
  `;

  return (
    `data:image/svg+xml;charset=UTF-8,` +
    encodeURIComponent(svg)
  );
};

export const getCoverPlaceholder = () => {
  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1200"
      height="360"
      viewBox="0 0 1200 360"
    >
      <defs>
        <linearGradient
          id="cover"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="#f3f5ff"
          />

          <stop
            offset="50%"
            stop-color="#e8ecff"
          />

          <stop
            offset="100%"
            stop-color="#f8f9ff"
          />
        </linearGradient>
      </defs>

      <rect
        width="1200"
        height="360"
        fill="url(#cover)"
      />

      <circle
        cx="1040"
        cy="70"
        r="100"
        fill="#4f6df5"
        opacity="0.07"
      />

      <circle
        cx="170"
        cy="310"
        r="150"
        fill="#4f6df5"
        opacity="0.05"
      />

      <path
        d="M0 290 Q260 180 500 275 T1000 235 T1200 270 V360 H0Z"
        fill="#4f6df5"
        opacity="0.06"
      />

      <g transform="translate(600 150)">
        <rect
          x="-34"
          y="-25"
          width="68"
          height="50"
          rx="12"
          fill="#4f6df5"
          opacity="0.14"
        />

        <circle
          cx="0"
          cy="0"
          r="13"
          fill="none"
          stroke="#4f6df5"
          stroke-width="5"
          opacity="0.65"
        />

        <path
          d="M-20-25l8-10h24l8 10"
          fill="none"
          stroke="#4f6df5"
          stroke-width="5"
          opacity="0.65"
          stroke-linecap="round"
        />
      </g>

      <text
        x="600"
        y="225"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="22"
        font-weight="600"
        fill="#4f6df5"
        opacity="0.75"
      >
        Add a cover photo
      </text>

      <text
        x="600"
        y="253"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="15"
        fill="#64748b"
        opacity="0.9"
      >
        Make your profile feel more personal
      </text>
    </svg>
  `;

  return (
    `data:image/svg+xml;charset=UTF-8,` +
    encodeURIComponent(svg)
  );
};

export default getImageUrl;