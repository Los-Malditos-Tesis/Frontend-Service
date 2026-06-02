import PropTypes from "prop-types";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import CustomButton from "./CustomButton";

const TableExportButtons = ({ onExcel, onCsv, disabled = false, className = "" }) => {
  return (
    <div className={`min-w-[14.5rem] flex w-full flex-col gap-2 sm:w-auto sm:flex-row ${className}`.trim()}>
      <CustomButton
        action={onExcel}
        disabled={disabled}
        className="max-w-[7rem] rounded-xl bg-slate-900 text-sm font-semibold hover:bg-slate-700"
        startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
      >
        Excel
        </CustomButton>
      <CustomButton
        action={onCsv}
        disabled={disabled}
        className="max-w-[7rem] rounded-xl bg-slate-700 text-sm font-semibold hover:bg-slate-600"
        startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
      >
        CSV
      </CustomButton>
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