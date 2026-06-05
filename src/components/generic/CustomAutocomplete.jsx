import React, { useMemo, useState, forwardRef } from "react";
import PropTypes from "prop-types";
import { Autocomplete, FormControl, FormLabel, InputAdornment, TextField } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { PresenceAnimation } from "./FadeIn";

const CustomAutocomplete = forwardRef(
  (
    {
      name,
      labelText,
      ariaLabel = "",
      placeholderLabel = "Seleccione una opción",
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

    const selectedOption = useMemo(() => {
      return options.find((option) => option.value?.toString() === value?.toString()) || null;
    }, [options, value]);

    return (
      <FormControl fullWidth error={hasError}>
        {labelText && (
          <FormLabel
            htmlFor={name}
            sx={{
              color: "#202124",
              fontWeight: "600",
              lineHeight: "45px",
              mb: 1,
            }}
            className="!text-lg"
          >
            {labelText || ariaLabel}
          </FormLabel>
        )}

        <Autocomplete
          id={name}
          options={options}
          value={selectedOption}
          disabled={readOnly}
          onChange={(_, selected) => {
            onChange(selected?.value || "");
          }}
          onBlur={onBlur}
          onFocus={() => setIsFocused(true)}
          onClose={() => setIsFocused(false)}
          getOptionLabel={(option) => option?.label || ""}
          isOptionEqualToValue={(option, selected) =>
            option.value?.toString() === selected.value?.toString()
          }
          noOptionsText="No hay resultados"
          clearText="Limpiar"
          openText="Abrir"
          closeText="Cerrar"
          renderInput={(params) => (
            <TextField
              {...params}
              name={name}
              inputRef={ref}
              placeholder={placeholderLabel}
              error={hasError}
              sx={{
                backgroundColor,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.3rem",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "0.3rem",
                    borderWidth: "2px",
                    borderColor: hasError
                      ? "#FF6B6B50 !important"
                      : isFocused
                        ? "#28448550 !important"
                        : "#20212450 !important",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: hasError ? "#FF6B6B" : "#000",
                  },
                },
              }}
              InputProps={{
                ...params.InputProps,
                // startAdornment: (
                //   <>
                //     {icon && iconPosition === "start" && (
                //       <InputAdornment position="start">
                //         {React.cloneElement(icon, {
                //           style: {
                //             color: hasError ? "#FF6B6B" : isFocused ? "#284485" : "#202124",
                //           },
                //         })}
                //       </InputAdornment>
                //     )}
                //     {params.InputProps.startAdornment}
                //   </>
                // ),
                // endAdornment: (
                //   <>
                //     {params.InputProps.endAdornment}
                //     {icon && iconPosition === "end" && (
                //       <InputAdornment position="end">
                //         {React.cloneElement(icon, {
                //           style: {
                //             color: hasError ? "#FF6B6B" : isFocused ? "#284485" : "#202124",
                //             cursor: "pointer",
                //           },
                //         })}
                //       </InputAdornment>
                //     )}
                //   </>
                // ),
              }}
              {...props}
            />
          )}
        />

        <AnimatePresence>
          {errors?.message && (
            <PresenceAnimation
              as="p"
              id={`${name}-error`}
              role="alert"
              className="mx-5 mt-2 text-sm text-red-500"
            >
              {errors.message}
            </PresenceAnimation>
          )}
        </AnimatePresence>
      </FormControl>
    );
  }
);

CustomAutocomplete.displayName = "CustomAutocomplete";

CustomAutocomplete.propTypes = {
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  ariaLabel: PropTypes.string,
  placeholderLabel: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string,
    })
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

export default CustomAutocomplete;
