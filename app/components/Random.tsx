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
  shuffleArray,
  formatDate,
  DigitalArt,
} from "../utils/helpers";

const GET_DIGITAL_ART = gql`
  query MyQuery($limit: Int!, $offset: Int!) {
    token(
      where: {
        holders: {
          holder: { address: { _eq: "tz1YPUoCAGcKYa4T8pYiKFvSg1ivVVUahRuX" } }
        }
      }
      offset: $offset
      limit: $limit
    ) {
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
      creators(order_by: {}) {
        creator_address
      }
    }
  }
`;

const MainDisplay = React.memo(() => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [digitalArt, setDigitalArt] = useState<DigitalArt[]>([]);
  const [shuffledArt, setShuffledArt] = useState<DigitalArt[]>([]);
  const [page, setPage] = useState(1);

  const unwantedAddresses = useMemo(
    () => [
      "tz1erY7SqRTAM6UmdwzfmQ48VqB6675uUrHH",
      "tz1LtRavzB4VYRuYwcMbohYnV6SU2iRnU5DF",
    ],
    []
  );

  const excludedNames = useMemo(
    () => [
      "Windowlicker",
      "Tightening",
      "Nude Pixel 35",
      "The Love Distortion",
      "Vaim Violence",
      "Feather Therapy",
      "WILD VIOLET",
      "YUCK FOU",
    ],
    []
  );

  const itemsPerPage = 24;
  const { loading, error, data } = useQuery(GET_DIGITAL_ART, {
    variables: { limit: 1000, offset: 0 }, // Fetch a large amount of data once
  });

  useEffect(() => {
    if (data) {
      setDigitalArt(data.token);
    }
  }, [data]);

  // Shuffle the entire dataset once when digitalArt changes
  useEffect(() => {
    if (digitalArt.length > 0) {
      const filtered = digitalArt
        .slice()
        .sort((a, b) => b.last_listed - a.last_listed)
        .filter(
          (art) =>
            !unwantedAddresses.some(
              (address) => address === art.creators[0]?.creator_address
            ) && !excludedNames?.includes(art.name)
        );

      setShuffledArt(shuffleArray(filtered));
    }
  }, [digitalArt, unwantedAddresses, excludedNames]);

  // Get the current page's items from the shuffled array
  const currentPageArt = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return shuffledArt.slice(startIndex, endIndex);
  }, [shuffledArt, page, itemsPerPage]);

  // Hardcoded total pages based on actual NFT count (7 pages)
  const totalPages = 7;

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
          {currentPageArt.map((art, i) => (
            <Grid item xs={12} md={4} lg={3} key={`${art.ophash}-${i}`}>
              <Stack
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {art.extra[0]?.mime_type.startsWith("video/") ? (
                  <VideoItem art={art} />
                ) : art.extra[0]?.mime_type === "image/jpeg" ||
                  art.extra[0]?.mime_type === "image/png" ||
                  art.extra[0]?.mime_type === "image/gif" ? (
                  <ImageItem art={art} />
                ) : art.extra[0]?.mime_type === "audio/mpeg" ? (
                  <audio
                    src={ipfsHashToUrl(art.extra[0].uri) as string}
                    controls
                  />
                ) : art.extra[0]?.mime_type === "application/x-directory" ? (
                  <IframeItem art={art} />
                ) : art.display_uri ? (
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
                    {art.name}
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
                bgcolor: "#000",
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
                  onClick={() => {
                    setPage(Math.max(1, page - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
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
                  onClick={() => {
                    setPage(Math.min(totalPages, page + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
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

MainDisplay.displayName = "MainDisplay";

const ImageItem = React.memo(({ art }: { art: DigitalArt }) => {
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

const IframeItem = React.memo(({ art }: { art: DigitalArt }) => {
  const [itemOpen, setItemOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setItemOpen(true)}
        style={{
          backgroundImage: `url(${ipfsHashToUrl(art.display_uri)})`,
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
          src={ipfsHashToUrl(art.extra[0]?.uri) as string}
          width="600"
          height="600"
          style={{ border: 0 }}
        />
      </Dialog>
    </>
  );
});

IframeItem.displayName = "IframeItem";

const VideoItem = React.memo(({ art }: { art: DigitalArt }) => {
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
          src={ipfsHashToUrl(art.extra[0]?.uri) as string}
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

export default MainDisplay;
