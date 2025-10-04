import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  ThemeProvider,
  CssBaseline,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { documentListRequest, DocumentState } from "@/store/document/slices";
import muiTheme from "@/theme/muiTheme";
import DocumentStats from "@/components/DocumentStats";
import DashboardNavigation from "@/components/DashboardNavigation";
import Loading from "@/components/Loading";

const Dashboard: React.FC = () => {
  const location = useLocation();
  const documentState = useSelector(
    (store: { document: DocumentState }) => store.document,
  );
  const dispatch = useDispatch();

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const { isLoading, documents } = documentState;

  useEffect(() => {
    dispatch(documentListRequest());
  }, [dispatch]);

  const showNotification = (
    message: string,
    severity: "success" | "error" | "info" | "warning",
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: "#1f2937",
                fontSize: "2.5rem",
              }}
            >
              Document Intelligence Dashboard
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#6b7280",
                fontWeight: 400,
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              Monitor your documents and access intelligent insights with
              AI-powered analytics.
            </Typography>
          </Box>

          {/* Loading */}
          {isLoading && <Loading isLoading={isLoading} />}

          {/* Navigation */}
          <DashboardNavigation currentPath={location.pathname} />

          {/* Dashboard Content */}
          {!isLoading && (
            <Box>
              {/* Statistics */}
              {documents.length > 0 && <DocumentStats documents={documents} />}
            </Box>
          )}
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
