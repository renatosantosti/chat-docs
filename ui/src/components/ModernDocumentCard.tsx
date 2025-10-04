import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  Chip,
  Avatar,
  Stack,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Description as DocIcon,
  Chat as ChatIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  Pages as PagesIcon,
  SmartToy as AIIcon,
  TrendingUp as TrendingIcon,
} from "@mui/icons-material";
import { DocumentItem } from "@/shared/models";

interface ModernDocumentCardProps {
  document: DocumentItem;
  onChat: (documentId: number) => void;
  onDelete: (documentId: number) => void;
  onView?: (documentId: number) => void;
  onDownload?: (documentId: number) => void;
  onShare?: (documentId: number) => void;
  onEdit?: (documentId: number) => void;
}

const ModernDocumentCard: React.FC<ModernDocumentCardProps> = ({
  document,
  onChat,
  onDelete,
  onView,
  onDownload,
  onShare,
  onEdit,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    onDelete(document.id);
    setDeleteDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "#9333ea";
      case "doc":
      case "docx":
        return "#0284c7";
      case "txt":
        return "#6b7280";
      case "image":
        return "#16a34a";
      default:
        return "#9333ea";
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "txt":
        return "📃";
      case "image":
        return "🖼️";
      default:
        return "📄";
    }
  };

  return (
    <>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease-in-out",
          cursor: "pointer",
          position: "relative",
          overflow: "visible",
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            borderColor: "#9333ea",
          },
        }}
      >
        {/* Header com tipo de documento */}
        <Box
          sx={{
            position: "relative",
            height: 120,
            background: `linear-gradient(135deg, ${getDocumentTypeColor(document.type)} 0%, ${getDocumentTypeColor(document.type)}80 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            borderRadius: "24px 24px 0 0",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h2" sx={{ fontSize: "3rem", mb: 1 }}>
              {getDocumentTypeIcon(document.type)}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {document.type.toUpperCase()}
            </Typography>
          </Box>

          {/* Menu de ações */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <MoreIcon />
          </IconButton>

          {/* Badge de páginas */}
          <Chip
            icon={<PagesIcon />}
            label={`${document.pages} pages`}
            size="small"
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "text.primary",
              fontWeight: 500,
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Stack spacing={2}>
            {/* Título do documento */}
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "2.6em",
              }}
            >
              {document.title}
            </Typography>

            {/* Descrição */}
            {document.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  minHeight: "2.4em",
                }}
              >
                {document.description}
              </Typography>
            )}

            {/* Metadados */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                icon={<ScheduleIcon />}
                label={formatDate(document.date)}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.75rem" }}
              />
              <Chip
                label={document.type}
                size="small"
                sx={{
                  backgroundColor: `${getDocumentTypeColor(document.type)}20`,
                  color: getDocumentTypeColor(document.type),
                  fontWeight: 500,
                }}
              />
            </Stack>

            {/* Barra de progresso (simulando processamento) */}
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Typography variant="caption" color="text.secondary">
                  AI Processing
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  100%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    background:
                      "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  },
                }}
              />
            </Box>
          </Stack>
        </CardContent>

        <CardActions sx={{ p: 3, pt: 0 }}>
          <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
            <Button
              variant="contained"
              startIcon={<AIIcon />}
              onClick={() => onChat(document.id)}
              sx={{
                flex: 1,
                background: "linear-gradient(135deg, #9333ea 0%, #0284c7 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #0369a1 100%)",
                },
                borderRadius: 2,
                py: 1.5,
                fontWeight: 500,
              }}
            >
              Chat with AI
            </Button>

            {isHovered && (
              <Tooltip title="Quick View">
                <IconButton
                  onClick={() => onView?.(document.id)}
                  sx={{
                    backgroundColor: "grey.100",
                    "&:hover": {
                      backgroundColor: "grey.200",
                    },
                  }}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </CardActions>
      </Card>

      {/* Menu de ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            onView?.(document.id);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDownload?.(document.id);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onShare?.(document.id);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onEdit?.(document.id);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialog de confirmação de exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ backgroundColor: "error.main" }}>
              <DeleteIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">Delete Document</Typography>
              <Typography variant="body2" color="text.secondary">
                This action cannot be undone
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>"{document.title}"</strong>?
            This will permanently remove the document and all associated data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete Document
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModernDocumentCard;
