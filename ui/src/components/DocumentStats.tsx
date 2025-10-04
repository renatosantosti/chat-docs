import React from "react";
import {
  Grid,
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
  SmartToy as AIIcon,
  Schedule as ScheduleIcon,
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
    {
      title: "Recent Uploads",
      value: recentDocuments,
      icon: <ScheduleIcon />,
      color: "#4facfe",
      trend: "+25%",
      description: "Last 7 days",
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Document Intelligence Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Main Stats */}
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                border: `1px solid ${stat.color}20`,
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: stat.color,
                      color: "white",
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
                    color={stat.trend.startsWith("+") ? "success" : "error"}
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                </Stack>

                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {stat.value.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    {stat.description}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}

        {/* Document Types Distribution */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Document Types
            </Typography>
            <Stack spacing={2}>
              {Object.entries(typeDistribution).map(([type, count]) => {
                const percentage =
                  totalDocuments > 0 ? (count / totalDocuments) * 100 : 0;
                const colors = {
                  PDF: "#e53e3e",
                  DOC: "#2b6cb0",
                  TXT: "#4a5568",
                  IMAGE: "#38a169",
                };

                return (
                  <Box key={type}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={type}
                          size="small"
                          sx={{
                            backgroundColor: `${colors[type as keyof typeof colors] || "#718096"}20`,
                            color:
                              colors[type as keyof typeof colors] || "#718096",
                            fontWeight: 500,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {count} documents
                        </Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight={500}>
                        {percentage.toFixed(1)}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor:
                            colors[type as keyof typeof colors] || "#718096",
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </Paper>
        </Grid>

        {/* AI Processing Status */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              height: "100%",
              background:
                "linear-gradient(135deg, #667eea15 0%, #764ba205 100%)",
              border: "1px solid #667eea20",
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "#667eea",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AIIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    AI Processing Status
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All documents are AI-ready
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2}>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Content Analysis
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      100%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        background:
                          "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Semantic Indexing
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      100%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        background:
                          "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Chat Ready
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      100%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        background:
                          "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentStats;
