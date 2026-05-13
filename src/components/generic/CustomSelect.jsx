import React, { useState, forwardRef } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  OutlinedInput,
  FormLabel,
} from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { PresenceAnimation } from "./FadeIn";

const CustomSelect = forwardRef(
  (
    {
      name,
      labelText,
      ariaLabel = "",
      placeholderLabel = "Seleccione tipo de archivo de salida",
      options = [],
      value,
      onChange,
      onBlur,
      errors,
      icon,
      iconPosition = "start",
      readOnly = false,
      backgroundColor = "#ffffff",
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasError = !!errors?.message;
    const mergedOptions = [
      { value: "", label: placeholderLabel },
      ...options,
    ];

    return (
      <FormControl
        fullWidth
        variant="outlined"
        error={hasError}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.3rem",
            borderColor: hasError
              ? "#FF6B6B"
              : isFocused
                ? "#284485"
                : "#202124",
            // boxShadow: hasError
            //   ? "5px 5px 0px #FF6B6B"
            //   : isFocused
            //     ? "6px 6px 0px #284485"
            //     : "5px 5px 0px #000",
            "&:hover fieldset": { borderColor: hasError ? "#FF6B6B" : "#000" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: "0.3rem",
              borderWidth: "2px",
              borderColor: hasError
                ? "#FF6B6B50 !important"
                : isFocused
                  ? "#28448550 !important"
                  : "#20212450 !important",
            },
          },
        }}
      >

        {labelText && (
          <FormLabel
            htmlFor={name}
            sx={{
              color: "#202124",
              fontWeight: "600",
              lineHeight: "45px",
              mb: 1.,
            }}
            className="!text-lg"
          >
            {labelText || ariaLabel}
          </FormLabel>
        )}
        <Select
          labelId={`${name}-label`}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onOpen={() => setIsFocused(true)}
          onClose={() => setIsFocused(false)}
          disabled={readOnly}
          displayEmpty
          ref={ref}
          sx={{
            backgroundColor,
          }}
          input={
            <OutlinedInput
              notched={false}
              startAdornment={
                icon && iconPosition === "start" ? (
                  <InputAdornment position="start">
                    {React.cloneElement(icon, {
                      style: {
                        color: hasError
                          ? "#FF6B6B"
                          : isFocused
                            ? "#284485"
                            : "#202124",
                      },
                    })}
                  </InputAdornment>
                ) : null
              }
              endAdornment={
                icon && iconPosition === "end" ? (
                  <InputAdornment position="end">
                    {React.cloneElement(icon, {
                      style: {
                        color: hasError
                          ? "#FF6B6B"
                          : isFocused
                            ? "#284485"
                            : "#202124",
                        cursor: "pointer",
                      },
                    })}
                  </InputAdornment>
                ) : null
              }
              {...props}
            />
          }
          renderValue={(val) =>
            val !== ""
              ? mergedOptions.find((o) => o.value === val)?.label
              : mergedOptions[0].label
          }
        >
          {mergedOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        <AnimatePresence>
          {errors?.message && (
            <PresenceAnimation
              as="p"
              id={`${name}-error`}
              role="alert"
              className="mx-5 mt-2 text-red-500 text-sm"
            >
              {errors.message}
            </PresenceAnimation>
          )}
        </AnimatePresence>
      </FormControl>
    );
  }
);

CustomSelect.propTypes = {
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  ariaLabel: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.any, label: PropTypes.node })
  ),
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  errors: PropTypes.shape({ message: PropTypes.string }),
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(["start", "end"]),
  readOnly: PropTypes.bool,
  backgroundColor: PropTypes.string,
};

export default CustomSelect;