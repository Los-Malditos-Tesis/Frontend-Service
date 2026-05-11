import PropTypes from "prop-types";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";

const CustomDrawer = ({
  isOpen,
  onClose,
  title,
  children,
  drawerWidth = 760,
}) => {
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: drawerWidth },
          maxWidth: "100%",
          borderTopLeftRadius: 18,
          borderBottomLeftRadius: 18,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
          backgroundImage: "none",
        },
      }}
    >
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        minWidth: { xs: "100%", sm: drawerWidth }
      }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>

          <IconButton onClick={onClose} aria-label="Cerrar" size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Box sx={{ p: 6, overflowY: "auto", flex: 1 }}>{children}</Box>
      </Box>
    </Drawer>
  );
};

CustomDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  drawerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

CustomDrawer.defaultProps = {
  title: "",
};

export default CustomDrawer;