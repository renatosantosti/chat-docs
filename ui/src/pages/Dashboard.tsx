import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  ThemeProvider,
  CssBaseline,
  Snackbar,
  Alert,
  Fab,
  Zoom,
  useScrollTrigger,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
} from "@mui/material";
import { KeyboardArrowUp as KeyboardArrowUpIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { documentListRequest, DocumentState } from "@/store/document/slices";
import muiTheme from "@/theme/muiTheme";
import DocumentStats from "@/components/DocumentStats";
import DashboardNavigation from "@/components/DashboardNavigation";
import Loading from "@/components/Loading";

// Scroll to top component
function ScrollTop(props: any) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({
        block: "center",
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
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

  const handleNavigateToDocuments = () => {
    navigate("/documents-modern");
  };

  const handleNavigateToUpload = () => {
    navigate("/upload-document");
  };

  const handleNavigateToChat = (documentId: number) => {
    navigate(`/chatdoc/${documentId}`);
  };

  const renderQuickActions = () => (
    <Card
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 2,
        background: "linear-gradient(135deg, #667eea15 0%, #764ba205 100%)",
        border: "1px solid #667eea20",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Quick Actions
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <Button
          variant="contained"
          onClick={handleNavigateToUpload}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
            },
          }}
        >
          Upload Document
        </Button>
        <Button
          variant="outlined"
          onClick={handleNavigateToDocuments}
          sx={{ borderColor: "#667eea", color: "#667eea" }}
        >
          View All Documents
        </Button>
      </Stack>
    </Card>
  );

  const renderRecentDocuments = () => {
    const recentDocs = [...documents]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return (
      <Card elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Recent Documents
          </Typography>
          <Button
            variant="text"
            onClick={handleNavigateToDocuments}
            sx={{ color: "#667eea" }}
          >
            View All
          </Button>
        </Stack>

        {recentDocs.length > 0 ? (
          <Stack spacing={2}>
            {recentDocs.map((doc) => (
              <Box
                key={doc.id}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "grey.200",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "#667eea",
                    backgroundColor: "#667eea05",
                  },
                }}
                onClick={() => handleNavigateToChat(doc.id)}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      {doc.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doc.type} • {doc.pages} pages •{" "}
                      {new Date(doc.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: "#667eea", color: "#667eea" }}
                  >
                    Chat
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No documents yet. Upload your first document to get started!
            </Typography>
            <Button
              variant="contained"
              onClick={handleNavigateToUpload}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                },
              }}
            >
              Upload Document
            </Button>
          </Box>
        )}
      </Card>
    );
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
        {/* Anchor for scroll to top */}
        <Box id="back-to-top-anchor" />

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                mb: 2,
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Document Intelligence Dashboard
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600 }}
            >
              Welcome to your AI-powered document management hub. Monitor your
              documents, track processing status, and access intelligent
              insights.
            </Typography>
          </Box>

          {/* Loading */}
          {isLoading && <Loading isLoading={isLoading} />}

          {/* Navigation */}
          <DashboardNavigation currentPath={location.pathname} />

          {/* Dashboard Content */}
          {!isLoading && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Statistics */}
              {documents.length > 0 && (
                <Box>
                  <DocumentStats documents={documents} />
                </Box>
              )}

              {/* Quick Actions and Recent Documents */}
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Box sx={{ flex: 1, minWidth: "300px" }}>
                  {renderQuickActions()}
                </Box>
                <Box sx={{ flex: 1, minWidth: "300px" }}>
                  {renderRecentDocuments()}
                </Box>
              </Box>
            </Box>
          )}
        </Container>

        {/* Scroll to Top Button */}
        <ScrollTop>
          <Fab
            color="primary"
            size="medium"
            aria-label="scroll back to top"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              },
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>

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
