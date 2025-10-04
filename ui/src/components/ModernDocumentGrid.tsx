import React from "react";
import {
  Box,
  Typography,
  Stack,
  Pagination,
  Paper,
  Chip,
  Skeleton,
  Alert,
  Button,
} from "@mui/material";
import {
  Description as DocIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { DocumentItem } from "@/shared/models";
import ModernDocumentCard from "./ModernDocumentCard";

interface ModernDocumentGridProps {
  documents: DocumentItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onChat: (documentId: number) => void;
  onDelete: (documentId: number) => void;
  onView?: (documentId: number) => void;
  onDownload?: (documentId: number) => void;
  onShare?: (documentId: number) => void;
  onEdit?: (documentId: number) => void;
  isLoading?: boolean;
  viewMode?: "grid" | "list";
  onRefresh?: () => void;
  onUpload?: () => void;
}

const ModernDocumentGrid: React.FC<ModernDocumentGridProps> = ({
  documents,
  currentPage,
  totalPages,
  onPageChange,
  onChat,
  onDelete,
  onView,
  onDownload,
  onShare,
  onEdit,
  isLoading = false,
  viewMode = "grid",
  onRefresh,
  onUpload,
}) => {
  const renderEmptyState = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 4,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          backgroundColor: "#f3e8ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <DocIcon sx={{ fontSize: 48, color: "#9333ea" }} />
      </Box>

      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: 700, color: "#1f2937" }}
      >
        No documents found
      </Typography>

      <Typography
        variant="h6"
        sx={{ mb: 4, maxWidth: 500, color: "#6b7280", fontWeight: 400 }}
      >
        Start building your document intelligence hub by uploading your first
        document. Our AI will help you analyze and extract insights from your
        content.
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onUpload}
          sx={{
            background: "linear-gradient(135deg, #9333ea 0%, #0284c7 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #7c3aed 0%, #0369a1 100%)",
            },
            px: 4,
            py: 1.5,
            fontSize: "1rem",
          }}
        >
          Upload First Document
        </Button>

        {onRefresh && (
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            sx={{
              borderColor: "#9333ea",
              color: "#9333ea",
              "&:hover": {
                borderColor: "#7c3aed",
                backgroundColor: "#f3e8ff",
              },
              px: 4,
              py: 1.5,
            }}
          >
            Refresh
          </Button>
        )}
      </Stack>
    </Box>
  );

  const renderLoadingSkeletons = () => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        justifyContent: "center",
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Box
          key={index}
          sx={{ flex: "1 1 280px", minWidth: "280px", maxWidth: "350px" }}
        >
          <Paper
            elevation={0}
            sx={{ p: 2, borderRadius: 3, border: "1px solid #e5e7eb" }}
          >
            <Stack spacing={2}>
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: 1 }}
              />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
              <Stack direction="row" spacing={1}>
                <Skeleton
                  variant="rectangular"
                  width={60}
                  height={24}
                  sx={{ borderRadius: 3 }}
                />
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={24}
                  sx={{ borderRadius: 3 }}
                />
              </Stack>
              <Skeleton
                variant="rectangular"
                height={4}
                sx={{ borderRadius: 2 }}
              />
              <Skeleton
                variant="rectangular"
                height={36}
                sx={{ borderRadius: 1 }}
              />
            </Stack>
          </Paper>
        </Box>
      ))}
    </Box>
  );

  const renderDocumentStats = () => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        justifyContent="center"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            icon={<DocIcon />}
            label={`${documents.length} Documents`}
            sx={{
              backgroundColor: "#f3e8ff",
              color: "#9333ea",
              border: "1px solid #e9d5ff",
              fontWeight: 500,
            }}
          />
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={`Page ${currentPage} of ${totalPages}`}
            size="small"
            sx={{
              backgroundColor: "#f0f9ff",
              color: "#0284c7",
              border: "1px solid #bae6fd",
              fontWeight: 500,
            }}
          />
        </Stack>

        {totalPages > 1 && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={`${Math.min(documents.length, 12)} per page`}
              size="small"
              sx={{
                backgroundColor: "#f0fdf4",
                color: "#16a34a",
                border: "1px solid #bbf7d0",
                fontWeight: 500,
              }}
            />
          </Stack>
        )}
      </Stack>
    </Paper>
  );

  if (isLoading) {
    return (
      <Box>
        {renderDocumentStats()}
        {renderLoadingSkeletons()}
      </Box>
    );
  }

  if (documents.length === 0) {
    return renderEmptyState();
  }

  return (
    <Box>
      {renderDocumentStats()}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {documents.map((document) => (
          <Box
            key={document.id}
            sx={{
              flex: "1 1 280px",
              minWidth: "280px",
              maxWidth: "350px",
              display: "flex",
              "& > *": {
                width: "100%",
              },
            }}
          >
            <ModernDocumentCard
              document={document}
              onChat={onChat}
              onDelete={onDelete}
              onView={onView}
              onDownload={onDownload}
              onShare={onShare}
              onEdit={onEdit}
            />
          </Box>
        ))}
      </Box>

      {/* Paginação */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 6,
            mb: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 2,
                fontWeight: 500,
                fontSize: "1rem",
              },
              "& .Mui-selected": {
                background: "linear-gradient(135deg, #9333ea 0%, #0284c7 100%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #0369a1 100%)",
                },
              },
              "& .MuiPaginationItem-root:not(.Mui-selected)": {
                border: "1px solid #e5e7eb",
                "&:hover": {
                  backgroundColor: "#f3e8ff",
                  borderColor: "#9333ea",
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ModernDocumentGrid;
