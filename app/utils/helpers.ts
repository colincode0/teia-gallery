// Shared utility functions to reduce code duplication across components

export function ipfsHashToUrl(hash: string): string | null {
  if (!hash) return null;
  const cleanHash = hash.replace("ipfs://", "");
  return `https://ipfs.io/ipfs/${cleanHash}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date
    .getFullYear()
    .toString()
    .substring(2)} at ${formatHour(date.getHours())}:${formatMinute(
    date.getMinutes()
  )} ${formatAMPM(date.getHours())}`;
  return formattedDate;
}

function formatHour(hour: number): string {
  if (hour === 0) {
    return "12";
  } else if (hour > 12) {
    return (hour - 12).toString();
  } else {
    return hour.toString();
  }
}

function formatMinute(minute: number): string {
  if (minute < 10) {
    return `0${minute}`;
  } else {
    return minute.toString();
  }
}

function formatAMPM(hour: number): string {
  if (hour < 12) {
    return "AM";
  } else {
    return "PM";
  }
}

// Optimized shuffle function with memoization
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Type definitions
export type DigitalArt = {
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

export type DigitalArtWithToken = {
  token: DigitalArt;
};
