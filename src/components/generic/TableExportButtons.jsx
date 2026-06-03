import { useState } from "react";
import PropTypes from "prop-types";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import CustomButton from "./CustomButton";

const TableExportButtons = ({
  onExcel,
  onCsv,
  disabled = false,
  className = "",
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    handleClose();
    action?.();
  };

  return (
    <div className={`w-full sm:w-auto ${className}`.trim()}>
      <CustomButton
        action={handleOpen}
        disabled={disabled}
        className="w-full justify-between rounded-md bg-black font-normal hover:bg-slate-700 sm:w-auto sm:min-w-38"
        startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
        endIcon={<KeyboardArrowDownIcon fontSize="small" />}
      >
        Exportar
      </CustomButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        elevation={4}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.25,
              minWidth: 220,
              borderRadius: 3,
              p: 1,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => handleAction(onExcel)}
          disabled={disabled}
          sx={{
            borderRadius: 2,
            px: 2,
            py: 1.25,
          }}
        >
          <ListItemIcon>
            <FileDownloadOutlinedIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Exportar a Excel"
            slotProps={{
              primary: {
                className: "text-sm font-medium",
              },
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={() => handleAction(onCsv)}
          disabled={disabled}
          sx={{
            borderRadius: 2,
            px: 2,
            py: 1.25,
          }}
        >
          <ListItemIcon>
            <FileDownloadOutlinedIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Exportar a CSV"
            slotProps={{
              primary: {
                className: "text-sm font-medium",
              },
            }}
          />
        </MenuItem>
      </Menu>
    </div>
  );
};

TableExportButtons.propTypes = {
  onExcel: PropTypes.func.isRequired,
  onCsv: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default TableExportButtons;