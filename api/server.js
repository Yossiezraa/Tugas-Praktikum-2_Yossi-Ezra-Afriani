const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const db = require("./config/database");


const app = express();
const port = 3000;


dotenv.config();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Inisialisasi transporter untuk pengiriman email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


app.post("/daftar", async (req, res) => {
  const { fullname, email, password, umur, role } = req.body;
  try {
    const post_data = await db.query(`INSERT INTO user(fullname, email, password, umur, role, is_verified)
                                     VALUES ("${fullname}", "${email}", "${password}", "${umur}", "${role}", FALSE)`);


    if (post_data) {
      const user = { id: post_data.insertId, fullname, email, umur, role };
      const token = generateToken(user);
      sendVerificationEmail(user, token);


      const logInsert = await db.query(
        `INSERT INTO logs(pesan, waktu) VALUES ("User baru terdaftar dengan ID ${
          post_data.insertId
        }", "${new Date().toISOString().slice(0, 19).replace("T", " ")}")`,
      );


      res.status(200).json({
        msg: "Berhasil membuat user. Silakan verifikasi email Anda.",
        user: post_data,
      });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({
      msg: "Gagal membuat user",
      err: error,
    });
  }
});




// Fungsi untuk mengirim email verifikasi
function sendVerificationEmail(email, verificationLink) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verifikasi Email",
    html: `<p>Silakan klik link berikut untuk verifikasi email: <a href="${verificationLink}">${verificationLink}</a></p>`,
  };


  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}


// Endpoint untuk pengiriman email verifikasi
app.post("/send-verification-email", async (req, res) => {
  const { email } = req.body;


  try {
    // Di sini kamu perlu menghasilkan link verifikasi yang unik, misalnya dengan menambahkan token atau UUID
    const verificationLink = "https://example.com/verify-email?token=your-verification-token";


    // Kirim email verifikasi
    sendVerificationEmail(email, verificationLink);


    res.status(200).json({
      msg: "Email verifikasi berhasil dikirim",
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    res.status(500).json({
      msg: "Gagal mengirim email verifikasi",
      error: error.message,
    });
  }
});


// Fungsi untuk menghasilkan token JWT
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      age: user.umur,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );
}


// Endpoint untuk login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;


  try {
    const user = await db.query(`SELECT * FROM user WHERE email = "${email}" AND password = "${password}"`);


    if (user.length > 0) {
      const token = generateToken(user[0]); // Membuat token JWT


      // Insert log
      await db.query(`INSERT INTO logs(pesan, waktu) VALUES ("User dengan email ${email} berhasil login", "${new Date().toISOString().slice(0, 19).replace("T", " ")}")`);


      res.status(200).json({
        msg: "Login berhasil",
        user: user[0], // Mengirimkan data user yang berhasil login
        token: token, // Mengirimkan token JWT ke klien
      });
    } else {
      res.status(401).json({
        msg: "Login gagal, email atau password salah",
      });
    }
  } catch (error) {
    console.error("Failed to login:", error);
    res.status(500).json({
      msg: "Gagal melakukan login",
      error: error.message,
    });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
