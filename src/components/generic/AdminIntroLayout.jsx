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
  eyebrow=<Breadcrumbs />,
  buttonLabel,
  onCreate,
  children,
  showAddIcon = true,
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
            className="pb-8 md:pb-10 mb-6 md:mb-8 pt-6"
          >
            <CustomButton
              className="max-w-[13.5rem] ml-auto"
              action={onCreate}
              startIcon={showAddIcon ? <AddIcon /> : null}
            >
              {buttonLabel}
            </CustomButton>
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
  buttonLabel: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default AdminIntroLayout;