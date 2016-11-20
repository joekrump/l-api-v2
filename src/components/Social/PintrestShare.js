import React from 'react';

const PintrestShare = (props) => (
  <a href={`http://pinterest.com/pin/create/button/?url=${props.url}&amp;media=${props.image_url}&amp;description=${props.description}`} 
    target="_blank" 
    className="svgpt" 
    title="Share on Pinterest">
    <svg width="33" height="33" viewBox="0 0 33 33">
      <desc>Pinterest</desc>
      <g><path d="M 16.5,0C 7.387,0,0,7.387,0,16.5s 7.387,16.5, 16.5,16.5c 9.113,0, 16.5-7.387, 16.5-16.5S 25.613,0, 16.5,0z M 18.1,22.047 c-1.499-0.116-2.128-0.859-3.303-1.573C 14.15,23.863, 13.36,27.113, 11.021,28.81 c-0.722-5.123, 1.060-8.971, 1.888-13.055c-1.411-2.375, 0.17-7.155, 3.146-5.977 c 3.662,1.449-3.171,8.83, 1.416,9.752c 4.79,0.963, 6.745-8.31, 3.775-11.325 c-4.291-4.354-12.491-0.099-11.483,6.135c 0.245,1.524, 1.82,1.986, 0.629,4.090c-2.746-0.609-3.566-2.775-3.46-5.663 c 0.17-4.727, 4.247-8.036, 8.337-8.494c 5.172-0.579, 10.026,1.898, 10.696,6.764 C 26.719,16.527, 23.63,22.474, 18.1,22.047z"></path></g>
    </svg>
  </a>
);


export default PintrestShare;