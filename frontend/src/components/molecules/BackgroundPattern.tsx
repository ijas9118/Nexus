const BackgroundPattern = () => {
  return (
    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-40">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 800 800"
        opacity="1"
      >
        <defs>
          <filter
            id="bbblurry-filter"
            x="-100%"
            y="-100%"
            width="400%"
            height="400%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur
              stdDeviation="119"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              in="SourceGraphic"
              edgeMode="none"
              result="blur"
            ></feGaussianBlur>
          </filter>
        </defs>
        <g filter="url(#bbblurry-filter)">
          <ellipse
            rx="92.5"
            ry="92.5"
            cx="302.28233728858186"
            cy="482.57892420903556"
            fill="hsla(212, 100%, 50%, 1.00)"
          ></ellipse>
          <ellipse
            rx="92.5"
            ry="92.5"
            cx="529.3306105049493"
            cy="326.15370889234293"
            fill="hsla(272, 100%, 50%, 1.00)"
          ></ellipse>
        </g>
      </svg>
    </div>
  );
};

export default BackgroundPattern;
