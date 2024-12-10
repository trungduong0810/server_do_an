import express from "express";

const apiLogoutAccount = express.Router();

apiLogoutAccount.post("/api/logout", async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    // Phản hồi thành công
    res.status(200).json({ message: "Đăng xuất thành công!" });
  } catch (error) {
    // Xử lý lỗi
    console.error("Lỗi khi đăng xuất:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi đăng xuất." });
  }
});

export default apiLogoutAccount;
