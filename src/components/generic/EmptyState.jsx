import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

import InboxIcon from "@mui/icons-material/Inbox";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";

const icons = {
  default: <InboxIcon sx={{ fontSize: 60 }} />,
  search: <SearchOffIcon sx={{ fontSize: 60 }} />,
  error: <ErrorOutlineIcon sx={{ fontSize: 60 }} />,
};

const EmptyState = ({
  title = "Sin datos",
  description = "No hay información para mostrar.",
  type = "default", // default | search | error
  action = null,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col items-center justify-center text-center py-10 px-6"
    >
      <div className="text-gray-400 mb-4">
        {icons[type] || icons.default}
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        {title}
      </h3>

      <p className="text-gray-500 max-w-md mb-6">
        {description}
      </p>

      {action && <div>{action}</div>}
    </motion.div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.oneOf(["default", "search", "error"]),
  action: PropTypes.node,
};

export default EmptyState;