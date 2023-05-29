import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Image from "next/image";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  Button,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import { motion } from "framer-motion";
import Link from "next/link";

// Background black doesn't show up on mobile chrome

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

function ipfsHashToUrl(hash: string) {
  if (!hash) return null;
  const cleanHash = hash.replace("ipfs://", "");
  return `https://ipfs.io/ipfs/${cleanHash}`;
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

type digitalArt = {
  artifact_uri: string;
  average: number;
  decimals: number;
  description: string;
  display_uri: string;
  extra: Array<{
    mime_type: string;
    size: number;
    uri: string;
  }>;
  flag: string;
  highest_offer: number;
  is_boolean_amount: boolean;
  last_listed: number;
  last_metadata_update: number;
  level: number;
  lowest_ask: number;
  metadata: string;
  mime: string;
  name: string;
  ophash: string;
  rights: string;
  supply: number;
  symbol: string;
  thumbnail_uri: string;
  timestamp: string;
  tzip16_key: string;
  creators: {
    creator_address: string;
  }[];
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date
    .getFullYear()
    .toString()
    .substring(2)} at ${formatHour(date.getHours())}:${formatMinute(
    date.getMinutes()
  )} ${formatAMPM(date.getHours())}`;
  return formattedDate;
}

function formatHour(hour: number) {
  if (hour === 0) {
    return "12";
  } else if (hour > 12) {
    return (hour - 12).toString();
  } else {
    return hour.toString();
  }
}

function formatMinute(minute: number) {
  if (minute < 10) {
    return `0${minute}`;
  } else {
    return minute.toString();
  }
}

function formatAMPM(hour: number) {
  if (hour < 12) {
    return "AM";
  } else {
    return "PM";
  }
}
export default function MainDisplay() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [digitalArt, setDigitalArt] = useState<digitalArt[]>([]);
  const [page, setPage] = useState(1);
  const unwantedAddresses = [
    "tz1erY7SqRTAM6UmdwzfmQ48VqB6675uUrHH",
    "tz1LtRavzB4VYRuYwcMbohYnV6SU2iRnU5DF",
  ];

  const itemsPerPage = 60;
  const { loading, error, data } = useQuery(GET_DIGITAL_ART, {
    variables: { limit: itemsPerPage, offset: (page - 1) * itemsPerPage },
  });

  useEffect(() => {
    if (data) {
      setDigitalArt(data.token);
    }
  }, [data]);

  const totalPages = Math.ceil(digitalArt.length / itemsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

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
          {shuffleArray(
            digitalArt
              .slice()
              .sort((a, b) => b.last_listed - a.last_listed)
              .filter(
                (art) =>
                  !unwantedAddresses.some(
                    (address) => address === art.creators[0].creator_address
                  )
              )
          ).map((art, i) => (
            <Grid item xs={12} md={4} lg={3} key={i}>
              <Stack
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {art.extra[0].mime_type.startsWith("video/") ? (
                  <div
                    style={{
                      backgroundImage: `url(${ipfsHashToUrl(
                        art.display_uri || art.thumbnail_uri
                      )})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center center",
                      width: "300px",
                      height: "300px",
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                  />
                ) : art.extra[0].mime_type === "image/jpeg" ||
                  art.extra[0].mime_type === "image/png" ||
                  art.extra[0].mime_type === "image/gif" ? (
                  <div>
                    <ImageItem art={art} />
                  </div>
                ) : art.extra[0].mime_type === "audio/mpeg" ? (
                  <audio
                    src={ipfsHashToUrl(art.extra[0].uri) as string}
                    controls
                  />
                ) : art.extra[0].mime_type === "application/x-directory" ? (
                  <IframeItem art={art} />
                ) : art.display_uri ? (
                  <div
                    style={{
                      backgroundImage: `url(${ipfsHashToUrl(art.display_uri)})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center center",
                      width: "300px",
                      height: "300px",
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
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
            <Box style={{ display: "flex", justifyContent: "center" }}>
              <Pagination count={5} page={page} onChange={handlePageChange} />
            </Box>
          </Paper>
        </Stack>
      </motion.div>
    </div>
  );
}

function ImageItem({ art: art }: { art: digitalArt }) {
  const [itemOpen, setItemOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <div>
      {loading ? (
        <Skeleton variant="rectangular" width={300} height={300} />
      ) : (
        <div
          onClick={() => setItemOpen(true)}
          style={{
            backgroundImage: `url(${ipfsHashToUrl(art.extra[0].uri)})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            width: "300px",
            height: "300px",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      )}
      <Dialog
        open={itemOpen}
        onClose={() => setItemOpen(false)}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.95)",
          },
          "& .MuiDialog-paper": {
            backgroundColor: "black",
          },
        }}
      >
        <div
          onClick={() => setItemOpen(false)}
          style={{
            backgroundImage: `url(${ipfsHashToUrl(art.extra[0].uri)})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            width: "500px",
            height: "500px",
            maxWidth: "100%",
            maxHeight: "100%",
            backgroundColor: "black",
          }}
        />
        <Stack
          sx={{
            bgcolor: "black",
            color: "white",
            p: 1,
            display: "flex",
          }}
        >
          <Typography variant="h4">Title: {art.name}</Typography>
          <Typography>Minted: {formatDate(art.timestamp)}</Typography>
          <Typography>Total Supply: {art.supply}</Typography>
          <Divider sx={{ bgcolor: "white", my: 1 }} />
          <Link
            href={`https://objkt.com/profile/${art.creators[0].creator_address}/created`}
            target="_blank"
            rel="noopener"
          >
            <Typography variant="caption">Link to creator on OBJKT</Typography>
          </Link>
          <Typography variant="caption">
            Description: {art.description}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setItemOpen(false)}
            >
              Close
            </Button>
          </Box>
        </Stack>
      </Dialog>
    </div>
  );
}

function IframeItem({ art: art }: { art: digitalArt }) {
  const [itemOpen, setItemOpen] = useState(false);
  return (
    <div>
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
        }}
      />
      <Dialog open={itemOpen} onClose={() => setItemOpen(false)}>
        <iframe
          src={ipfsHashToUrl(art.extra[0].uri) as string}
          width="600"
          height="600"
          style={{ border: 0 }}
        />
      </Dialog>
    </div>
  );
}
