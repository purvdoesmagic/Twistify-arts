import { ImageResponse } from "next/og";

export const alt = "Twistify Arts handmade crochet and woolen crafts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#fffaf6",
          color: "#332722",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "64px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "#332722",
            borderRadius: "36px",
            color: "#f6c6d1",
            display: "flex",
            fontFamily: "Georgia, serif",
            fontSize: 58,
            fontWeight: 700,
            height: 150,
            justifyContent: "center",
            width: 150,
          }}
        >
          TA
        </div>
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 64, marginTop: 34 }}>
          Twistify Arts
        </div>
        <div style={{ color: "#ad5e70", display: "flex", fontFamily: "Arial, sans-serif", fontSize: 26, marginTop: 18 }}>
          Handmade crochet, woolen, floral, and festive crafts
        </div>
      </div>
    ),
    { ...size },
  );
}
