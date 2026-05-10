import express from "express";
import dotenv from "dotenv";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// Fix __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route động để render index.html với sitekey từ env
app.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "public", "index.html");
  fs.readFile(indexPath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Không đọc được file index.html");
    const html = data.replace(
      /data-sitekey="[^"]*"/,
      `data-sitekey="${process.env.TURNSTILE_SITE_KEY || ""}"`
    );
    res.send(html);
  });
});
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.post("/submit", async (req, res) => {
  try {
    const token = req.body["cf-turnstile-response"];
    const name = req.body.name;
    const email = req.body.email;

    if (!token) {
      return res.status(400).send("Thiếu token CAPTCHA");
    }

    const formData = new URLSearchParams();
    formData.append("secret", process.env.TURNSTILE_SECRET_KEY);
    formData.append("response", token);

    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData
      }
    );

    const verifyResult = await verifyResponse.json();

    if (!verifyResult.success) {
      return res.status(403).send(`
        <h2>CAPTCHA không hợp lệ</h2>
        <pre>${JSON.stringify(verifyResult, null, 2)}</pre>
      `);
    }

    return res.send(`
      <h2>Gửi form thành công</h2>
      <p>Tên: ${name}</p>
      <p>Email: ${email}</p>
      <p>Turnstile hợp lệ.</p>
    `);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Lỗi server");
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});