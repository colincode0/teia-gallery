import React, { useEffect, useState } from "react";
import { useQuery, gql, useLazyQuery } from "@apollo/client";
import Image from "next/image";
import Stack from "@mui/material/Stack";
import {
  Button,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  Paper,
  Skeleton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

const GET_DIGITAL_ART = gql`
  query MyQuery($limit: Int!, $offset: Int!, $address: String!) {
    token_holder(
      where: { holder: { address: { _eq: $address } } }
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

function ipfsHashToUrl(hash: string) {
  if (!hash) return null;
  const cleanHash = hash.replace("ipfs://", "");
  return `https://ipfs.io/ipfs/${cleanHash}`;
}

type digitalArt = {
  token: {
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

const generateRandomColor = () => {
  const letters = "ABCDEFabcdef0123456789";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 10 + 6)];
  }
  return color;
};

export default function YourOwn({ setView }: { setView: Function }) {
  const router = useRouter();
  const { tz } = router.query;
  const isMobile = useMediaQuery("(max-width:600px)");
  const [digitalArt, setDigitalArt] = useState<digitalArt[]>([]);
  const [page, setPage] = useState(1);
  const [address, setAddress] = useState("");
  const [searched, setSearched] = useState(false);
  const [color, setColor] = useState(generateRandomColor());
  const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const itemsPerPage = 24;

  const [getDigitalArt, { loading, error, data }] = useLazyQuery(
    GET_DIGITAL_ART,
    {
      variables: {
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
        address: address,
      },
      onCompleted: (data) => {
        setDigitalArt(data.token_holder);
      },
      onError: (error) => {
        setDigitalArt([]);
        console.log(error);
      },
    }
  );

  // Hardcoded total pages based on actual NFT count (7 pages)
  const totalPages = 7;

  const handleButtonClick = () => {
    getDigitalArt();
    setSearched(true);
    router.push({
      pathname: router.pathname,
      query: { tz: address },
    });
  };

  useEffect(() => {
    console.log("digitalArt", digitalArt);
  }, [digitalArt]);

  // Refetch data when page changes
  useEffect(() => {
    if (address && searched) {
      getDigitalArt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  useEffect(() => {
    if (tz) {
      setAddress(tz as string);
      getDigitalArt();
      setSearched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tz]);

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
      {!searched && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "transparent",
              boxShadow: "none",
              mt: 3,
              mb: 2,
              mx: "auto",
              width: "100vw",
              height: "fit-content",
              pt: "20vh",
            }}
          >
            {/* <Box sx={{ height: 300, width: 300, bgcolor: "#bbb" }} /> */}
            <TextField
              label="Enter address here"
              onChange={handleChangeAddress}
              variant="outlined"
              sx={{
                ml: 1,
                "& .MuiInputBase-input": {
                  color: "#fff",
                },
                "& .MuiFormLabel-root": {
                  color: color,
                  textAlign: "center",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: color,
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: color,
                },
              }}
            />
            <Button
              variant="outlined"
              onClick={handleButtonClick}
              sx={{
                mt: 2,
                width: 300,
                color: color,
                borderColor: color,
              }}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              onClick={() => setView(0)}
              sx={{
                mt: 2,
                width: 300,
                color: color,
                borderColor: color,
              }}
            >
              Go Back
            </Button>
          </Paper>
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Grid container spacing={1}>
          {digitalArt &&
            digitalArt.map((art, i) => (
              <Grid item xs={12} md={4} lg={3} key={i}>
                <Stack
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {art.token.extra &&
                  art.token.extra[0] &&
                  art.token.extra[0].mime_type.startsWith("video/") ? (
                    <div
                      style={{
                        backgroundImage: `url(${ipfsHashToUrl(
                          art.token.display_uri || art.token.thumbnail_uri
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
                  ) : art.token.extra &&
                    art.token.extra[0] &&
                    (art.token.extra[0].mime_type === "image/jpeg" ||
                      art.token.extra[0].mime_type === "image/png" ||
                      art.token.extra[0].mime_type === "image/gif") ? (
                    <div>
                      <ImageItem art={art} />
                    </div>
                  ) : art.token.extra[0] &&
                    art.token.extra[0].mime_type === "audio/mpeg" ? (
                    <audio
                      src={ipfsHashToUrl(art.token.extra[0].uri) as string}
                      controls
                    />
                  ) : art.token.extra[0] &&
                    art.token.extra[0].mime_type ===
                      "application/x-directory" ? (
                    <IframeItem art={art} />
                  ) : art.token.display_uri && art.token.display_uri ? (
                    <div
                      style={{
                        backgroundImage: `url(${ipfsHashToUrl(
                          art.token.display_uri
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
                  ) : (
                    <Typography>Unsupported file format</Typography>
                  )}
                  {art.token.name && (
                    <Stack sx={{ mt: 1 }}>
                      <Typography
                        variant="caption"
                        align={"center"}
                        color="#999"
                      >
                        {art.token.name}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Grid>
            ))}
        </Grid>
        {digitalArt.length > 0 && totalPages > 1 && (
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
        {digitalArt.length == 0 && searched && (
          <Button
            variant="outlined"
            onClick={() => setView(0)}
            sx={{
              mt: 2,
              width: 300,
              color: color,
              borderColor: color,
            }}
          >
            Go Back
          </Button>
        )}
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
            backgroundImage: `url(${ipfsHashToUrl(art.token.extra[0].uri)})`,
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
            backgroundImage: `url(${ipfsHashToUrl(art.token.extra[0].uri)})`,
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
          <Typography variant="h4">Title: {art.token.name}</Typography>
          <Typography>Minted: {formatDate(art.token.timestamp)}</Typography>
          <Typography>Total Supply: {art.token.supply}</Typography>
          <Divider sx={{ bgcolor: "white", my: 1 }} />
          <Link
            href={`https://objkt.com/profile/${art.token.creators[0].creator_address}/created`}
            target="_blank"
            rel="noopener"
          >
            <Typography variant="caption">Link to creator on OBJKT</Typography>
          </Link>
          <Typography variant="caption">
            Description: {art.token.description}
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
          backgroundImage: `url(${ipfsHashToUrl(art.token.display_uri)})`,
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
          src={ipfsHashToUrl(art.token.extra[0].uri) as string}
          width="600"
          height="600"
          style={{ border: 0 }}
        />
      </Dialog>
    </div>
  );
}
