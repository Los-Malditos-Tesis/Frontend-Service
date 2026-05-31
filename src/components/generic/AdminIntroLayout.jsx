import React from "react";
import PropTypes from "prop-types";
import DashboardLayout from "../../containers/Dashboard/DashboardLayout";
import { CustomContainer } from "./CustomContainer";
import { SectionIntro } from "./SectionIntro";
import CustomButton from "./CustomButton";
import Breadcrumbs from "../../containers/Dashboard/Breadcrumbs";
import AddIcon from "@mui/icons-material/Add";

const AdminIntroLayout = ({
  title,
  subtitle,
  eyebrow = <Breadcrumbs />,
  buttonLabel,
  onCreate,
  secondaryButtonLabel,
  onSecondaryCreate,
  secondaryStartIcon,
  children,
  showAddIcon = true,
  className = "mb-6 pt-6 pb-8 md:mb-8 md:pb-10",
}) => {
  return (
    <DashboardLayout>
      <CustomContainer>
        <div className="space-y-6">
          <SectionIntro
            title={title}
            subtitle={subtitle}
            eyebrow={eyebrow}
            smaller
            className={className}
          >
            <div className="ml-auto flex flex-col gap-3 sm:flex-row sm:items-center">
              {secondaryButtonLabel && onSecondaryCreate && (
                <CustomButton action={onSecondaryCreate} startIcon={secondaryStartIcon}>
                  {secondaryButtonLabel}
                </CustomButton>
              )}

              {buttonLabel && onCreate && (
                <CustomButton action={onCreate} startIcon={showAddIcon ? <AddIcon /> : null}>
                  {buttonLabel}
                </CustomButton>
              )}
            </div>
          </SectionIntro>

          {children}
        </div>
      </CustomContainer>
    </DashboardLayout>
  );
};

AdminIntroLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  eyebrow: PropTypes.node,
  buttonLabel: PropTypes.node,
  onCreate: PropTypes.func,
  secondaryButtonLabel: PropTypes.node,
  onSecondaryCreate: PropTypes.func,
  secondaryStartIcon: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default AdminIntroLayout;
