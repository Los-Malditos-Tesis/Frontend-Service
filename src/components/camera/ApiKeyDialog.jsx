import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CustomButton from "../generic/CustomButton";

const ApiKeyDialog = ({ open, apiKey, onClose, onCopy }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          API Key generada
        </Typography>

        <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
          Guarda esta clave ahora. No se volverá a mostrar.
        </Typography>

        <TextField
          label="API Key"
          value={apiKey}
          fullWidth
          multiline
          minRows={2}
          InputProps={{ readOnly: true }}
          sx={{
            mt: 1,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
            "& .MuiInputBase-input": {
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
            },
            backgroundColor: "#f8fafc",
            borderRadius: 1,
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 0, pb: 0, pt: 1, justifyContent: "flex-end", gap: 2 }}>
        <Button onClick={onClose} sx={{ color: "#374151" }}>
          Cerrar
        </Button>

        <CustomButton
          onClick={onCopy}
          startIcon={<ContentCopyIcon />}
          className="bg-white! text-black! border! border-gray-200! hover:bg-gray-50! w-44"
        >
          Copiar API Key
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default ApiKeyDialog;