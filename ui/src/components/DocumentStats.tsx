import React from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  Description as DocIcon,
  TrendingUp as TrendingIcon,
  Storage as StorageIcon,
} from "@mui/icons-material";
import { DocumentItem } from "@/shared/models";

interface DocumentStatsProps {
  documents: DocumentItem[];
}

const DocumentStats: React.FC<DocumentStatsProps> = ({ documents }) => {
  const totalDocuments = documents.length;
  const totalPages = documents.reduce((sum, doc) => sum + doc.pages, 0);
  const avgPagesPerDoc =
    totalDocuments > 0 ? Math.round(totalPages / totalDocuments) : 0;

  // Calculate document types distribution
  const typeDistribution = documents.reduce(
    (acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Calculate recent documents (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentDocuments = documents.filter(
    (doc) => new Date(doc.date) > sevenDaysAgo,
  ).length;

  const stats = [
    {
      title: "Total Documents",
      value: totalDocuments,
      icon: <DocIcon />,
      color: "#667eea",
      trend: "+12%",
      description: "All processed documents",
    },
    {
      title: "Total Pages",
      value: totalPages,
      icon: <StorageIcon />,
      color: "#764ba2",
      trend: "+8%",
      description: "Pages analyzed by AI",
    },
    {
      title: "Avg Pages/Doc",
      value: avgPagesPerDoc,
      icon: <TrendingIcon />,
      color: "#f093fb",
      trend: "-2%",
      description: "Average document size",
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 700,
          color: "#6b21a8",
          textAlign: "center",
        }}
      >
        Document Overview
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Main Stats */}
        {stats.map((stat, index) => (
          <Box
            key={index}
            sx={{ flex: "1 1 280px", minWidth: "280px", maxWidth: "350px" }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                  borderColor: "#9333ea",
                },
              }}
            >
              <Stack spacing={2.5}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "#f3e8ff",
                      color: "#9333ea",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Chip
                    label={stat.trend}
                    size="small"
                    sx={{
                      backgroundColor: "#22c55e",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                </Stack>

                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: "#1f2937",
                      fontSize: "2.5rem",
                    }}
                  >
                    {stat.value.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#6b7280",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                    }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      display: "block",
                      color: "#9ca3af",
                      fontSize: "0.85rem",
                    }}
                  >
                    {stat.description}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DocumentStats;
