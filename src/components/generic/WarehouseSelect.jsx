import React, { forwardRef } from "react";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import CustomSelect from "./CustomSelect";

const WarehouseSelect = forwardRef(
  (
    {
      labelText = "Bodega",
      placeholderLabel = "Selecciona una bodega",
      options = [],
      iconPosition = "start",
      ...props
    },
    ref
  ) => {
    return (
      <CustomSelect
        ref={ref}
        labelText={labelText}
        placeholderLabel={placeholderLabel}
        options={options}
        // icon={<WarehouseOutlinedIcon />}
        iconPosition={iconPosition}
        {...props}
      />
    );
  }
);

export default WarehouseSelect;