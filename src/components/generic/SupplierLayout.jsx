import React from "react";
import PropTypes from "prop-types";
import CustomButton from "../../components/generic/CustomButton";
import { CustomContainer } from "../../components/generic/CustomContainer";
import { SectionIntro } from "../../components/generic/SectionIntro";

const SupplierLayout = ({
  title,
  eyebrow,
  description,
  buttonLabel,
  onCreate,
  children,
}) => {
  return (
    <CustomContainer>
      <div className="space-y-6">
        <SectionIntro title={title} eyebrow={eyebrow} divider vertical>
          <p>{description}</p>

          <CustomButton className="max-w-xs" action={onCreate}>
            {buttonLabel}
          </CustomButton>
        </SectionIntro>

        {children}
      </div>
    </CustomContainer>
  );
};

SupplierLayout.propTypes = {
  title: PropTypes.string.isRequired,
  eyebrow: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default SupplierLayout;
