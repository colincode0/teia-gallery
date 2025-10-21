import React from "react";
import { Dialog, Stack, Typography, Divider, Button, Box } from "@mui/material";
import Link from "next/link";
import { formatDate, DigitalArt, DigitalArtWithToken } from "../utils/helpers";

interface ArtDialogProps {
  open: boolean;
  onClose: () => void;
  art: DigitalArt | DigitalArtWithToken;
  children: React.ReactNode;
}

export const ArtDialog: React.FC<ArtDialogProps> = React.memo(
  ({ open, onClose, art, children }) => {
    const artData = "token" in art ? art.token : art;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.95)",
          },
          "& .MuiDialog-paper": {
            backgroundColor: "black",
          },
        }}
      >
        {children}
        <Stack
          sx={{
            bgcolor: "black",
            color: "white",
            p: 1,
            display: "flex",
            wordWrap: "break-word",
          }}
        >
          <Typography variant="h4">Title: {artData.name}</Typography>
          <Typography>Minted: {formatDate(artData.timestamp)}</Typography>
          <Typography>Total Supply: {artData.supply}</Typography>
          <Divider sx={{ bgcolor: "white", my: 1 }} />
          <Link
            href={`https://objkt.com/profile/${artData.creators[0]?.creator_address}/created`}
            target="_blank"
            rel="noopener"
          >
            <Typography variant="caption">Link to creator on OBJKT</Typography>
          </Link>
          <Typography variant="caption">
            Description: {artData.description}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" fullWidth onClick={onClose}>
              Close
            </Button>
          </Box>
        </Stack>
      </Dialog>
    );
  }
);

ArtDialog.displayName = "ArtDialog";
