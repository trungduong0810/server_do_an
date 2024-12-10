// import jwt from "jsonwebtoken";

// const authentication = {
//   createAccessToken: (userId, role, exp) => {
//     const payload = { userId, role };
//     const options = { expiresIn: exp };
//     return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
//   },
//   createRefreshToken: (userId, role, exp) => {
//     const payload = { userId, role };
//     const options = { expiresIn: exp };
//     return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, options);
//   },

//   // verifyAccessToken: (req, res, next) => {
//   //   const token = req.headers.token;
//   //   if (token) {
//   //     const accessToken = token.split(" ")[1];
//   //     jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//   //       if (err) {
//   //         return res.status(403).json("Token is not valid");
//   //       }
//   //       req.user = user;
//   //       next();
//   //     });
//   //   } else {
//   //     res.status(403).json("You are not authenticated");
//   //   }
//   // },

//   verifyAccessToken: (req, res, next) => {
//     const authHeader = req.headers.authorization; // Lấy tiêu đề Authorization

//     // Kiểm tra sự tồn tại và định dạng của tiêu đề Authorization
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "You are not authenticated" });
//     }

//     // Tách token từ tiêu đề Authorization
//     const token = authHeader.split(" ")[1];

//     // Xác thực token
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//       if (err) {
//         return res.status(403).json({ message: "Token is not valid" });
//       }

//       // Gắn thông tin người dùng vào req để sử dụng trong các middleware hoặc route tiếp theo
//       req.user = user;
//       next();
//     });
//   },

//   // verifyAccessTokenAdmin: (req, res, next) => {
//   //   const token = req.headers.token;

//   //   if (token) {
//   //     const accessToken = token.split(" ")[1];
//   //     jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//   //       if (err) {
//   //         return res.status(403).json("Token is not valid");
//   //       }
//   //       if (user.role !== "admin") {
//   //         return res.status(403).json("You do not have permission");
//   //       }
//   //       req.user = user;
//   //       next();
//   //     });
//   //   } else {
//   //     return res.status(403).json("You are not authenticated");
//   //   }
//   // },

//   verifyAccessTokenAdmin: (req, res, next) => {
//     const authHeader = req.headers.authorization; // Thường sử dụng 'authorization' thay vì 'token'

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "You are not authenticated" });
//     }

//     const accessToken = authHeader.split(" ")[1];

//     jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//       if (err) {
//         return res.status(403).json({ message: "Token is not valid" });
//       }

//       if (user.role !== "admin") {
//         return res.status(403).json({ message: "You do not have permission" });
//       }

//       req.user = user; // Lưu thông tin người dùng vào req để dùng sau
//       next();
//     });
//   },
// };

// export default authentication;



import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const authentication = {
  // Tạo Access Token
  createAccessToken: (userId, role, exp) => {
    const payload = { userId, role };
    const options = { expiresIn: exp };
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
  },

  // Tạo Refresh Token
  createRefreshToken: (userId, role, exp) => {
    const payload = { userId, role };
    const options = { expiresIn: exp };
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, options);
  },

  // Middleware xác thực Access Token từ cookie
  verifyAccessToken: (req, res, next) => {
    // Lấy accessToken từ cookie
    const token = req.cookies.accessToken; // Cookies sẽ tự động parse từ cookie-parser

    if (!token) {
      return res.status(401).json({ message: "You are not authenticated, missing token." });
    }

    // Xác thực token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid or expired." });
      }

      req.user = user;  // Lưu thông tin người dùng vào request
      next();  // Chuyển đến middleware hoặc route tiếp theo
    });
  },

  // Middleware xác thực Access Token cho Admin từ cookie
  verifyAccessTokenAdmin: (req, res, next) => {
    // Lấy accessToken từ cookie
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "You are not authenticated, missing token." });
    }

    // Xác thực token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid or expired." });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "You do not have permission to access this resource." });
      }

      req.user = user;  // Lưu thông tin người dùng vào request
      next();  // Chuyển đến middleware hoặc route tiếp theo
    });
  },
};

export default authentication;

