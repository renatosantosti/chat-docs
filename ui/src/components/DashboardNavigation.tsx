import React from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Description as DocumentsIcon,
  CloudUpload as UploadIcon,
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
    <Box sx={{ mb: 4, textAlign: "center" }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: "#6b21a8",
        }}
      >
        Quick Navigation
      </Typography>

      <Stack
        direction="row"
        spacing={3}
        flexWrap="wrap"
        useFlexGap
        justifyContent="center"
      >
        {navigationItems.map((item) => {
          const isActive = currentPath === item.path;

          return (
            <Button
              key={item.id}
              variant={isActive ? "contained" : "outlined"}
              startIcon={item.icon}
              onClick={() => handleNavigation(item.path)}
              sx={{
                minWidth: 160,
                py: 1.5,
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                ...(isActive && {
                  background:
                    "linear-gradient(135deg, #9333ea 0%, #0284c7 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #0369a1 100%)",
                  },
                }),
                ...(!isActive && {
                  borderColor: "#9333ea",
                  color: "#9333ea",
                  "&:hover": {
                    borderColor: "#7c3aed",
                    backgroundColor: "#f3e8ff",
                  },
                }),
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
};

export default DashboardNavigation;
