import React from "react";
import { Box, Typography, Stack, Button, Paper, Chip } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Description as DocumentsIcon,
  CloudUpload as UploadIcon,
  SmartToy as AIIcon,
  TrendingUp as AnalyticsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface DashboardNavigationProps {
  currentPath: string;
}

const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  currentPath,
}) => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      description: "Overview and insights",
    },
    {
      id: "documents",
      label: "Documents",
      icon: <DocumentsIcon />,
      path: "/documents-modern",
      description: "Manage your documents",
    },
    {
      id: "upload",
      label: "Upload",
      icon: <UploadIcon />,
      path: "/upload-document",
      description: "Add new documents",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: "grey.50",
        border: "1px solid",
        borderColor: "grey.200",
        mb: 3,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Quick Navigation
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {navigationItems.map((item) => {
          const isActive = currentPath === item.path;

          return (
            <Button
              key={item.id}
              variant={isActive ? "contained" : "outlined"}
              startIcon={item.icon}
              onClick={() => handleNavigation(item.path)}
              sx={{
                minWidth: 140,
                justifyContent: "flex-start",
                ...(isActive && {
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  },
                }),
                ...(!isActive && {
                  borderColor: "#667eea",
                  color: "#667eea",
                  "&:hover": {
                    borderColor: "#5a6fd8",
                    backgroundColor: "#667eea05",
                  },
                }),
              }}
            >
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  {item.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.8, display: "block" }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Button>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default DashboardNavigation;
