import React from "react";
import {
  Grid,
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
          backgroundColor: "grey.100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <DocIcon sx={{ fontSize: 48, color: "grey.400" }} />
      </Box>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        No documents found
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 400 }}
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
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
            },
          }}
        >
          Upload First Document
        </Button>

        {onRefresh && (
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
          >
            Refresh
          </Button>
        )}
      </Stack>
    </Box>
  );

  const renderLoadingSkeletons = () => (
    <Grid container spacing={3}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
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
        </Grid>
      ))}
    </Grid>
  );

  const renderDocumentStats = () => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: "grey.50",
        border: "1px solid",
        borderColor: "grey.200",
        borderRadius: 2,
      }}
    >
      <Stack direction="row" spacing={3} alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            icon={<DocIcon />}
            label={`${documents.length} Documents`}
            color="primary"
            variant="outlined"
          />
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={`Page ${currentPage} of ${totalPages}`}
            size="small"
            variant="outlined"
          />
        </Stack>

        {totalPages > 1 && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={`${Math.min(documents.length, 12)} per page`}
              size="small"
              variant="outlined"
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

      <Grid container spacing={3}>
        {documents.map((document) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={document.id}
            sx={{
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
          </Grid>
        ))}
      </Grid>

      {/* Paginação */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
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
              },
              "& .Mui-selected": {
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
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
