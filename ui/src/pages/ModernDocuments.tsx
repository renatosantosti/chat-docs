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
  Button,
  Stack,
} from "@mui/material";
import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { documentListRequest, DocumentState } from "@/store/document/slices";
import muiTheme from "@/theme/muiTheme";
import AdvancedSearch from "@/components/AdvancedSearch";
import ModernDocumentGrid from "@/components/ModernDocumentGrid";
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

const ModernDocuments: React.FC = () => {
  const navigate = useNavigate();
  const documentState = useSelector(
    (store: { document: DocumentState }) => store.document,
  );
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const { isLoading, documents } = documentState;

  // Filter documents based on search term
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(documentListRequest());
  }, [dispatch]);

  const handleUpload = () => {
    navigate("/upload-document");
  };

  const handleRefresh = () => {
    dispatch(documentListRequest());
    showNotification("Documents refreshed successfully", "success");
  };

  const handleSearch = () => {
    // Search is handled by the filtered documents logic
    showNotification(`Found ${filteredDocuments.length} documents`, "info");
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    showNotification("Search cleared", "info");
  };

  const handleChat = (documentId: number) => {
    navigate(`/chatdoc/${documentId}`);
  };

  const handleDelete = (documentId: number) => {
    // This will be handled by the Redux saga and ModernDocumentCard
    // No need to show notification here as it's handled by the saga
  };

  const handleView = (documentId: number) => {
    // Navigate to document details or open in viewer
    showNotification("Document viewer not implemented yet", "info");
  };

  const handleDownload = (documentId: number) => {
    showNotification("Download feature not implemented yet", "info");
  };

  const handleShare = (documentId: number) => {
    showNotification("Share feature not implemented yet", "info");
  };

  const handleEdit = (documentId: number) => {
    showNotification("Edit feature not implemented yet", "info");
  };

  const handleFilter = () => {
    showNotification("Advanced filters not implemented yet", "info");
  };

  const handleSort = () => {
    showNotification("Sort options not implemented yet", "info");
  };

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
        {/* Anchor for scroll to top */}
        <Box id="back-to-top-anchor" />

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
              My Documents
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#6b7280",
                fontWeight: 400,
                maxWidth: 600,
                margin: "0 auto",
                mb: 4,
              }}
            >
              Manage and interact with your documents using AI-powered
              intelligence.
            </Typography>

            {/* Upload Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleUpload}
                sx={{
                  background:
                    "linear-gradient(135deg, #9333ea 0%, #0284c7 100%)",
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(147, 51, 234, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #0369a1 100%)",
                    boxShadow: "0 6px 20px rgba(147, 51, 234, 0.4)",
                  },
                }}
              >
                Upload
              </Button>
            </Box>
          </Box>

          {/* Search */}
          <AdvancedSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={handleSearch}
            onClear={handleClearSearch}
            totalResults={filteredDocuments.length}
          />

          {/* Loading */}
          {isLoading && <Loading isLoading={isLoading} />}

          {/* Document Grid */}
          {!isLoading && (
            <ModernDocumentGrid
              documents={paginatedDocuments}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onChat={handleChat}
              onDelete={handleDelete}
              onView={handleView}
              onDownload={handleDownload}
              onShare={handleShare}
              onEdit={handleEdit}
              viewMode={viewMode}
              onRefresh={handleRefresh}
              onUpload={handleUpload}
            />
          )}
        </Container>

        {/* Scroll to Top Button */}
        <ScrollTop>
          <Fab
            color="primary"
            size="medium"
            aria-label="scroll back to top"
            sx={{
              background: "linear-gradient(135deg, #9333ea 0%, #0284c7 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #7c3aed 0%, #0369a1 100%)",
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

export default ModernDocuments;
