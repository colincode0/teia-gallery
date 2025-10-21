import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useQuery, gql } from "@apollo/client";
import Stack from "@mui/material/Stack";
import {
  CircularProgress,
  Dialog,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";
import { motion } from "framer-motion";
import { OptimizedImage } from "./OptimizedImage";
import { ArtDialog } from "./ArtDialog";
import {
  ipfsHashToUrl,
  formatDate,
  DigitalArtWithToken,
} from "../utils/helpers";

const GET_DIGITAL_ART = gql`
  query MyQuery($limit: Int!, $offset: Int!) {
    token_holder(
      where: {
        holder: { address: { _eq: "tz1YPUoCAGcKYa4T8pYiKFvSg1ivVVUahRuX" } }
      }
      offset: $offset
      limit: $limit
      order_by: { last_incremented_at: desc }
    ) {
      last_incremented_at
      token {
        artifact_uri
        average
        decimals
        description
        display_uri
        extra
        flag
        highest_offer
        is_boolean_amount
        last_listed
        last_metadata_update
        level
        lowest_ask
        metadata
        mime
        name
        ophash
        rights
        supply
        symbol
        thumbnail_uri
        timestamp
        tzip16_key
        creators {
          creator_address
        }
      }
    }
  }
`;

const Sorted = React.memo(() => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [digitalArt, setDigitalArt] = useState<DigitalArtWithToken[]>([]);
  const [page, setPage] = useState(1);

  const unwantedAddresses = useMemo(
    () => [
      "tz1erY7SqRTAM6UmdwzfmQ48VqB6675uUrHH",
      "tz1LtRavzB4VYRuYwcMbohYnV6SU2iRnU5DF",
    ],
    []
  );

  const itemsPerPage = 24;
  const { loading, error, data } = useQuery(GET_DIGITAL_ART, {
    variables: { limit: itemsPerPage, offset: (page - 1) * itemsPerPage },
  });

  useEffect(() => {
    if (data) {
      setDigitalArt(data.token_holder);
    }
  }, [data]);

  // Hardcoded total pages based on previous NFT count (240 NFTs = 10 pages with 24 per page)
  const totalPages = 10;

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    },
    []
  );

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "66vh",
        }}
      >
        <CircularProgress
          color={"error"}
          thickness={0.5}
          size={isMobile ? 50 : 200}
        />
      </Box>
    );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Grid container spacing={1}>
          {digitalArt &&
            digitalArt.map((art, i) => (
              <Grid item xs={12} md={4} lg={3} key={`${art.token.ophash}-${i}`}>
                <Stack
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {art.token.extra[0]?.mime_type.startsWith("video/") ? (
                    <VideoItem art={art} />
                  ) : art.token.extra[0]?.mime_type === "image/jpeg" ||
                    art.token.extra[0]?.mime_type === "image/png" ||
                    art.token.extra[0]?.mime_type === "image/gif" ? (
                    <ImageItem art={art} />
                  ) : art.token.extra[0]?.mime_type === "audio/mpeg" ? (
                    <audio
                      src={ipfsHashToUrl(art.token.extra[0].uri) as string}
                      controls
                    />
                  ) : art.token.extra[0]?.mime_type ===
                    "application/x-directory" ? (
                    <IframeItem art={art} />
                  ) : art.token.display_uri ? (
                    <OptimizedImage
                      art={art}
                      width={300}
                      height={300}
                      priority={i < 8} // Prioritize first 8 images
                    />
                  ) : (
                    <Typography>Unsupported file format</Typography>
                  )}
                  <Stack sx={{ mt: 1 }}>
                    <Typography variant="caption" align={"center"} color="#999">
                      {art.token.name}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            ))}
        </Grid>
        {totalPages > 1 && (
          <Stack spacing={2}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                bgcolor: "#444",
                my: 2,
              }}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      borderColor: "#ccc",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                    "&:disabled": {
                      borderColor: "#666",
                      color: "#666",
                    },
                  }}
                >
                  ← Previous
                </Button>
                <Typography variant="body2" sx={{ color: "white", mx: 2 }}>
                  Page {page} of {totalPages}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      borderColor: "#ccc",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                    "&:disabled": {
                      borderColor: "#666",
                      color: "#666",
                    },
                  }}
                >
                  Next →
                </Button>
              </Box>
            </Paper>
          </Stack>
        )}
      </motion.div>
    </div>
  );
});

Sorted.displayName = "Sorted";

const ImageItem = React.memo(({ art }: { art: DigitalArtWithToken }) => {
  const [itemOpen, setItemOpen] = useState(false);

  return (
    <>
      <OptimizedImage
        art={art}
        width={300}
        height={300}
        onClick={() => setItemOpen(true)}
      />
      <ArtDialog open={itemOpen} onClose={() => setItemOpen(false)} art={art}>
        <OptimizedImage
          art={art}
          width={500}
          height={500}
          onClick={() => setItemOpen(false)}
        />
      </ArtDialog>
    </>
  );
});

ImageItem.displayName = "ImageItem";

const IframeItem = React.memo(({ art }: { art: DigitalArtWithToken }) => {
  const [itemOpen, setItemOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setItemOpen(true)}
        style={{
          backgroundImage: `url(${ipfsHashToUrl(art.token.display_uri)})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          width: "300px",
          height: "300px",
          maxWidth: "100%",
          maxHeight: "100%",
          cursor: "pointer",
        }}
      />
      <Dialog open={itemOpen} onClose={() => setItemOpen(false)}>
        <iframe
          src={ipfsHashToUrl(art.token.extra[0]?.uri) as string}
          width="600"
          height="600"
          style={{ border: 0 }}
        />
      </Dialog>
    </>
  );
});

IframeItem.displayName = "IframeItem";

const VideoItem = React.memo(({ art }: { art: DigitalArtWithToken }) => {
  const [itemOpen, setItemOpen] = useState(false);

  return (
    <>
      <OptimizedImage
        art={art}
        width={300}
        height={300}
        onClick={() => setItemOpen(true)}
      />
      <ArtDialog open={itemOpen} onClose={() => setItemOpen(false)} art={art}>
        <video
          src={ipfsHashToUrl(art.token.extra[0]?.uri) as string}
          controls
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            backgroundColor: "black",
          }}
        />
      </ArtDialog>
    </>
  );
});

VideoItem.displayName = "VideoItem";

export default Sorted;
