exports.resolvers = {
  Query: {
    getUser: async (_, __, { services, middlewares }) => {
      try {
        const payload = middlewares.verifyUser();
        const user = await services.userService.getUser(payload.id);
        if (!user) throw new Error("User Not Found");
        return {
          code: 200,
          message: "Success",
          user,
        };
      } catch (error) {
        return {
          code: 401,
          message: error.message,
          user: null,
        };
      }
    },
    async getNewAccessToken(_, __, { req, services }) {
      try {
        const token = await services.authService.getNewToken(req);
        return {
          code: 200,
          message: "Success",
          token,
        };
      } catch (error) {
        return {
          code: 400,
          message: error.message,
          token: null,
        };
      }
    },
  },
  Mutation: {
    logoutUser: async (_, __, { services, req, res }) => {
      try {
        await services.authService.logoutUser(req);
        res.clearCookie("refreshToken", { path: "/" });
        return {
          code: 200,
          message: "SUCCESS",
        };
      } catch (error) {
        return {
          code: 400,
          message: error.message,
        };
      }
    },
    createUser: async (_, args, { services }) => {
      try {
        const user = await services.authService.createUser(args);
        return {
          code: 201,
          message: "User Created",
          user,
        };
      } catch (error) {
        return {
          code: 400,
          message: error.message,
          user: null,
        };
      }
    },
    loginUser: async (_, args, { services, res }) => {
      try {
        const { token, refreshToken } = await services.authService.loginUser(
          args
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
        return {
          code: 200,
          message: "Login Successful",
          token,
        };
      } catch (error) {
        return {
          code: 400,
          message: error.message,
          token: null,
        };
      }
    },
  },
};
