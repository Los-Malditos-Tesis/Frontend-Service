import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@emotion/react";
import { Divider } from "@mui/material";

export function SectionIntro({
  title,
  subtitle,
  id,
  eyebrow,
  children,
  smaller = false,
  vertical = false,
  className = "py-8 md:py-10 my-6 md:my-8",
  color,
  divider = false,
  ...props
}) {
  if (!color) {
    color = "#000000"; // Default color if not provided
  }
  return (
    <div {...props} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.4 }}
      >
        {eyebrow && (
          <span className="mb-6 block text-[#7b7b7b] text-base font-semibold">
            {eyebrow}
          </span>
        )}

        {vertical && children ? (
          <>
            <h2
              id={id}
              style={{ color }}
              className={`scroll-top  font-poly font-bold title ${smaller ? "text-5xl" : "text-7xl"
                }`}
            >
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-lg text-[#4B5563]">{subtitle}</p>}
            {divider && (
              <Divider
                sx={{
                  mt: 2,
                  backgroundColor: "#000000",
                  width: "10%",
                  height: "4px",
                }}
              />
            )}
            <div className="mt-6 text-lg / flex flex-col gap-4">{children}</div>
          </>
        ) : children ? (
          <div className="grid md:grid-cols-2 w-full gap-8">
            <div>
              <h2
                id={id}
                style={{ color }}
                className={`scroll-top  font-poly font-bold title ${smaller ? "text-5xl" : "text-7xl"
                }`}
                >
                {title}
              </h2>
              {subtitle && <p className="mt-1 text-lg text-[#4B5563]">{subtitle}</p>}
            </div>
            {divider && (
              <Divider
                sx={{
                  mt: 2,
                  backgroundColor: "#000000",
                  width: "10%",
                  height: "4px",
                }}
              />
            )}
            <div className="text-lg / flex flex-col gap-4">{children}</div>
          </div>
        ) : (
          <>
            <h2
              id={id}
              style={{ color }}
              className={`scroll-top  font-poly font-bold title ${smaller ? "text-5xl" : "text-7xl"
                }`}
            >
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-lg text-[#4B5563]">{subtitle}</p>}
            {divider && (
              <Divider
                sx={{
                  mt: 2,
                  backgroundColor: "#000000",
                  width: "10%",
                  height: "4px",
                }}
              />
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}