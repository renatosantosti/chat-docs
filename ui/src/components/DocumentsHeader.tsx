import React from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewList as ListViewIcon,
  ViewModule as GridViewIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";

interface DocumentsHeaderProps {
  totalDocuments: number;
  onUpload: () => void;
  onRefresh: () => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onFilter: () => void;
  onSort: () => void;
}

const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({
  totalDocuments,
  onUpload,
  onRefresh,
  viewMode,
  onViewModeChange,
  onFilter,
  onSort,
}) => {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: 3,
        p: 4,
        mb: 3,
        color: "white",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              variant="h3"
              component="h1"
              sx={{ mb: 1, fontWeight: 700 }}
            >
              Document Intelligence Hub
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
              Manage, analyze, and extract insights from your documents with
              AI-powered tools
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={`${totalDocuments} Documents`}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: 500,
                }}
              />
              <Chip
                label="AI-Powered"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: 500,
                }}
                icon={<SearchIcon sx={{ color: "white" }} />}
              />
            </Stack>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh Documents">
              <IconButton
                onClick={onRefresh}
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Filter Documents">
              <IconButton
                onClick={onFilter}
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Sort Documents">
              <IconButton
                onClick={onSort}
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <SortIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={viewMode === "grid" ? "List View" : "Grid View"}>
              <IconButton
                onClick={() =>
                  onViewModeChange(viewMode === "grid" ? "list" : "grid")
                }
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                {viewMode === "grid" ? <ListViewIcon /> : <GridViewIcon />}
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={onUpload}
              sx={{
                backgroundColor: "white",
                color: "primary.main",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "grey.100",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Upload Document
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default DocumentsHeader;
