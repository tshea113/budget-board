interface BudgetBoardLogoPropsBase {
  darkMode?: boolean;
}

interface BudgetBoardLogoPropsWidth extends BudgetBoardLogoPropsBase {
  width: number;
}

interface BudgetBoardLogoPropsHeight extends BudgetBoardLogoPropsBase {
  height: number;
}

const BudgetBoardLogo = (
  props: BudgetBoardLogoPropsHeight | BudgetBoardLogoPropsWidth
): React.ReactNode => {
  return (
    <svg
      version="1.1"
      id="svg3"
      viewBox="0 0 220 38"
      width={"width" in props ? props.width : (props.height * 220) / 38}
      height={"height" in props ? props.height : (props.width * 38) / 220}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs id="defs3">
        <linearGradient
          gradientTransform="scale(0.98348605,1.0167912)"
          id="a"
          x1="1.5531187"
          y1="0"
          x2="99.359825"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#8da1d8" id="stop2" />
          <stop offset="100%" stopColor="#3c6ebe" id="stop3" />
        </linearGradient>
      </defs>
      <g id="logo" transform="translate(-39.999796,-130.999)">
        <path
          d="m 100.493,147.002 c 1.827,-0.628 2.855,-1.884 2.855,-3.788 0,-2.474 -1.656,-4.206 -4.645,-4.568 -0.913,-0.114 -1.446,-0.114 -2.379,-0.114 h -6.567 v 18.387 h 6.681 c 1.047,0 1.618,0 2.55,-0.114 2.456,-0.343 5.045,-1.96 5.045,-5.368 0,-2.38 -1.18,-3.826 -3.54,-4.435 m -7.062,-5.596 h 2.665 c 0.418,0 0.894,0.038 1.332,0.076 1.218,0.171 2.075,0.838 2.075,2.227 0,1.333 -0.666,2.075 -1.999,2.284 a 10,10 0 0 1 -1.313,0.076 h -2.76 z m 4.416,12.582 c -0.343,0.019 -0.8,0.019 -1.218,0.019 H 93.43 v -5.197 h 3.064 c 0.42,0 0.857,0.038 1.295,0.096 1.332,0.133 2.379,0.837 2.379,2.55 0,1.542 -1.047,2.417 -2.322,2.532 z m 21.794,-11.25 h -3.674 v 7.233 c 0,3.198 -1.275,4.702 -3.121,4.702 -1.694,0 -2.55,-0.933 -2.741,-2.398 a 20,20 0 0 1 -0.095,-1.942 v -7.595 h -3.693 v 8.376 c 0,1.142 0.038,1.865 0.133,2.588 0.324,1.942 2.094,3.598 5.025,3.598 1.352,0 2.36,-0.267 3.407,-0.971 l 1.085,-1.808 v 2.398 h 3.674 z m 17.169,-5.405 h -3.674 v 7.309 l -0.932,-1.466 c -0.724,-0.514 -2.17,-0.8 -3.331,-0.8 -3.655,0 -6.796,2.57 -6.796,7.729 0,4.168 2.342,7.195 6.32,7.195 1.427,0 2.874,-0.381 3.673,-0.99 l 1.066,-1.58 v 2.189 h 3.674 z m -7.347,17.378 c -2.19,0 -3.579,-1.942 -3.579,-4.854 0,-3.274 1.58,-4.91 3.712,-4.91 1.694,0 3.54,1.16 3.54,4.358 v 0.685 c 0,3.465 -1.656,4.721 -3.673,4.721 m 24.535,-11.973 h -3.674 v 1.904 l -0.932,-1.466 c -0.724,-0.514 -2.17,-0.8 -3.331,-0.8 -3.655,0 -6.796,2.475 -6.796,7.614 0,4.15 2.475,7.005 6.472,7.005 1.447,0 2.722,-0.362 3.521,-0.99 l 1.066,-1.56 v 0.342 c 0,0.61 0,1.2 -0.038,1.732 -0.133,2.265 -1.503,3.407 -3.768,3.407 -1.904,0 -3.122,-0.818 -3.293,-2.131 l -0.02,-0.229 h -3.578 l 0.038,0.267 c 0.324,3.102 2.627,4.834 6.795,4.834 4.473,0 7.348,-2.132 7.519,-6.547 0.019,-0.78 0.019,-1.866 0.019,-2.741 z m -7.347,11.668 c -2.19,0 -3.579,-1.827 -3.579,-4.74 0,-3.254 1.58,-4.72 3.712,-4.72 1.694,0 3.54,1.161 3.54,4.36 v 0.399 c 0,3.464 -1.656,4.701 -3.673,4.701 m 23.621,-4.872 c 0,-3.864 -2.284,-7.157 -6.624,-7.157 -4.34,0 -7.195,3.16 -7.195,7.5 0,4.986 3.008,7.423 6.89,7.423 3.332,0 5.997,-1.694 6.72,-4.987 h -3.674 c -0.247,1.522 -1.39,2.398 -2.95,2.398 -1.713,0 -3.045,-0.933 -3.293,-3.921 h 10.088 c 0.038,-0.476 0.038,-0.914 0.038,-1.256 m -6.795,-4.588 c 1.77,0 2.78,1.2 3.027,3.446 h -6.244 c 0.324,-2.342 1.523,-3.446 3.217,-3.446 m 13.724,0.324 h 2.931 v -2.417 h -2.931 v -3.503 h -3.674 v 3.503 h -2.075 v 2.417 h 2.075 v 6.986 c 0,0.799 0,1.408 0.057,2.055 0.153,1.999 1.142,2.893 3.883,2.893 0.838,0 1.6,-0.038 2.437,-0.17 v -2.4 c -2.056,0.153 -2.57,-0.17 -2.665,-1.56 -0.038,-0.362 -0.038,-0.761 -0.038,-1.237 z m 21.832,1.732 c 1.846,-0.628 2.855,-1.884 2.855,-3.788 0,-2.474 -1.656,-4.206 -4.644,-4.568 -0.895,-0.114 -1.428,-0.114 -2.36,-0.114 h -6.586 v 18.387 h 6.68 c 1.048,0 1.638,0 2.57,-0.114 2.437,-0.343 5.026,-1.96 5.026,-5.368 0,-2.38 -1.162,-3.826 -3.54,-4.435 z m -7.062,-5.596 h 2.665 c 0.419,0 0.914,0.038 1.333,0.076 1.218,0.171 2.074,0.838 2.074,2.227 0,1.333 -0.666,2.075 -1.998,2.284 a 10,10 0 0 1 -1.295,0.076 h -2.779 z m 4.416,12.582 c -0.342,0.019 -0.8,0.019 -1.218,0.019 h -3.198 v -5.197 h 3.065 c 0.419,0 0.856,0.038 1.313,0.096 1.333,0.133 2.36,0.837 2.36,2.55 0,1.542 -1.027,2.417 -2.322,2.532 m 15.114,-11.611 c -4.72,0 -7.348,3.14 -7.348,7.461 0,4.283 2.627,7.462 7.348,7.462 4.72,0 7.366,-3.18 7.366,-7.462 0,-4.32 -2.646,-7.461 -7.366,-7.461 m 0,12.334 c -2.208,0 -3.54,-1.846 -3.54,-4.873 0,-3.064 1.332,-4.892 3.54,-4.892 2.208,0 3.54,1.828 3.54,4.892 0,3.027 -1.332,4.873 -3.54,4.873 m 17.987,2.208 h 3.597 c -0.209,-1.58 -0.266,-2.532 -0.266,-3.598 v -4.587 c 0,-0.761 -0.019,-1.523 -0.076,-2.189 -0.21,-2.436 -1.713,-4.168 -5.672,-4.168 -3.388,0 -5.977,1.808 -6.072,5.006 l 3.56,-0.038 c 0.113,-1.542 0.913,-2.399 2.378,-2.399 1.428,0 2.075,0.724 2.19,1.713 0.037,0.476 0.037,0.914 0.037,1.333 v 0.285 h -0.894 c -5.14,0 -7.804,1.77 -7.804,4.892 0,2.684 2.094,4.13 4.549,4.13 1.332,0 2.532,-0.266 3.521,-0.932 l 0.686,-1.523 z m -3.065,-2.208 c -1.294,0 -2.15,-0.59 -2.15,-1.846 0,-1.866 1.96,-2.532 4.891,-2.323 v 1.162 c 0,1.96 -1.237,3.007 -2.74,3.007 z m 17.036,-12.315 c -0.8,0 -1.732,0.323 -2.436,0.952 l -1.104,1.98 v -2.59 h -3.693 v 14.181 h 3.693 v -6.51 c 0,-3.807 1.504,-5.158 4.568,-4.949 v -2.95 c -0.305,-0.095 -0.61,-0.114 -1.028,-0.114 M 260,137.333 h -3.674 v 7.309 l -0.932,-1.466 c -0.724,-0.514 -2.151,-0.8 -3.331,-0.8 -3.655,0 -6.796,2.57 -6.796,7.729 0,4.168 2.342,7.195 6.32,7.195 1.427,0 2.874,-0.381 3.673,-0.99 l 1.066,-1.58 v 2.189 H 260 Z m -7.347,17.378 c -2.19,0 -3.579,-1.942 -3.579,-4.854 0,-3.274 1.58,-4.91 3.712,-4.91 1.694,0 3.54,1.16 3.54,4.358 v 0.685 c 0,3.465 -1.656,4.721 -3.673,4.721"
          id="title"
          fill={props.darkMode ? "#fff" : "#000"}
        />
        <path
          clipRule="evenodd"
          d="M 71.567,15.476 59.975,0 19.417,29.243 H 35.77 Z M 82.479,29.243 77.854,16.735 43.142,29.243 Z m 2.434,-1.527 h 6.64 c 1.899,0 3.121,1.48 3.121,3.373 v 21.198 l 2.992,-1.495 -0.03,-21.297 c 0,-1.9 -2.656,-4.831 -4.556,-4.831 h -9.379 l 1.06,2.854 z m 9.761,48.99 v 17.43 c 1.732,-0.184 3.045,-1.739 3.045,-3.518 L 97.696,75.195 Z M 7.939,27.716 h 8.784 l 4.258,-3.052 h -9.966 l 0.069,-0.023 C 3.712,24.634 1.46,24.718 1.529,33.89 v 62.04 c 0,1.901 1.893,3.519 3.793,3.519 h 83.179 c 1.899,0 3.808,-1.565 3.808,-3.457 l -0.007,-16.566 -0.367,0.183 h -7.631 c -6.746,0 -12.211,-5.464 -12.211,-12.21 0,-6.746 5.465,-12.209 12.211,-12.209 h 7.631 l 0.358,-0.184 -0.008,-20.788 c 0,-1.9 -1.885,-3.449 -3.784,-3.449 H 11.008 A 5.5,5.5 0 0 1 10.252,30.708 H 8.374 A 1.53,1.53 0 0 1 6.848,29.182 1.52,1.52 0 0 1 7.939,27.716 M 91.935,58.24 h -7.631 a 9.154,9.154 0 0 0 -9.158,9.157 9.155,9.155 0 0 0 9.158,9.157 h 7.631 L 97.673,71.739 97.65,53.547 Z m -12.21,9.157 a 4.58,4.58 0 0 1 4.579,-4.577 4.58,4.58 0 0 1 4.578,4.577 4.583,4.583 0 0 1 -4.578,4.579 4.58,4.58 0 0 1 -4.579,-4.579"
          fill="url(#a)"
          transform="matrix(0.38213,0,0,0.38213,39.416,130.999)"
          id="icon"
        />
      </g>
    </svg>
  );
};

export default BudgetBoardLogo;
