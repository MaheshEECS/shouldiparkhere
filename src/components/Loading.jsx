import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Loading = () => {
  return (
    <div>
      <FontAwesomeIcon className="spinner" icon={faSpinner} spin size="xl"/>
    </div>
  );
};

export default Loading;
