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
} from "@mui/material";
import { KeyboardArrowUp as KeyboardArrowUpIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { documentListRequest, DocumentState } from "@/store/document/slices";
import muiTheme from "@/theme/muiTheme";
import DocumentsHeader from "@/components/DocumentsHeader";
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
    // This will be handled by the Redux saga
    showNotification("Document deleted successfully", "success");
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

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <DocumentsHeader
            totalDocuments={documents.length}
            onUpload={handleUpload}
            onRefresh={handleRefresh}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onFilter={handleFilter}
            onSort={handleSort}
          />

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

export default ModernDocuments;
