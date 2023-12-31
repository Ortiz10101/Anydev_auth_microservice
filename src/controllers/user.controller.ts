import User from "../models/user.model";
import { IUser } from "../interfaces/user.interface";
import AdEncrypClass from "../class/adencrypt";
import IResponse from "../interfaces/response.interface";

export default class UserController {
  private encrypt = new AdEncrypClass();

  createUser(user: IUser): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (user.password) {
            const { salt, passwordHash } = this.encrypt.genPassword(user.password);
            user.password = passwordHash;
            user.salt = salt;
          } else {
            return reject({ ok: false, message: "bad request", response: null, code: 400 });
          }

          const userCreated = await User.create(user);
          let userSended = userCreated;
          userSended.password = "";
          userSended.salt = "";

          return resolve({ ok: true, message: "user created", response: userSended, code: 201 });
        } catch (err: any) {
          return reject({ ok: false, message: "error ocurred", response: err, code: 500 });
        }
      })();
    });
  }

  getUsers(): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const usersDB = await User.find({}).select("-password -salt");
          if (usersDB.length < 1) {
            return reject({ ok: false, message: "dont have users", response: null, code: 404 });
          }

          const response = {
            users: usersDB,
            total: usersDB.length,
          };

          return resolve({ ok: true, message: "users recovered", response: response, code: 200 });
        } catch (err: any) {
          return reject({ ok: false, message: "error ocurred", response: err, code: 500 });
        }
      })();
    });
  }

  updateUser(user: IUser): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const userUpdated = await User.findOneAndUpdate({ email: user.email }, user, {
            returnDocument: "after",
          }).select("-password -salt");
          if (!userUpdated) {
            return reject({ ok: false, message: "user not found", response: null, code: 404 });
          }

          return resolve({ ok: true, message: "user updated", response: userUpdated, code: 200 });
        } catch (err: any) {
          return reject({ ok: false, message: "server error", response: err, code: 500 });
        }
      })();
    });
  }

  deleteUser(id: string): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const userDeleted = await User.findByIdAndDelete(id, { select: "-salt -password" });

          if (!userDeleted) {
            return reject({
              ok: false,
              message: `user with id ${id} does not exist`,
              response: null,
              code: 404,
            });
          }
          return resolve({ ok: true, message: "user deleted", response: userDeleted, code: 200 });
        } catch (err: any) {
          return reject({ ok: false, message: "server error", response: err, code: 500 });
        }
      })();
    });
  }

  getUserByEmail(email: string): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const userFound = await User.findOne({ email: email }).select("name lastname email");

          if (!userFound) {
            return reject({ ok: false, message: "user does not exist", response: null, code: 404 });
          }
          return resolve({ ok: true, message: "user found", response: userFound, code: 200 });
        } catch (err: any) {
          return reject({ ok: false, message: "server error", response: err, code: 500 });
        }
      })(); // IIFE Immendiately Invoked Function Expression
    });
  }

  loginUser(email: string, password: string): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const userFound = await User.findOne({ email: email });

          if (userFound) {
            const { passwordHash } = this.encrypt.saltHashPassword(password, userFound.salt);

            if (passwordHash === userFound.password) {
              let userToken = this.removeSensiteveData(userFound);
              const token = await this.encrypt.genToken(userToken);

              return resolve({
                ok: true,
                message: "login successfull",
                response: null,
                code: 200,
                token: token,
              });
            } else {
              return reject({ ok: false, message: "bad request", response: null, code: 401 });
            }
          } else {
            return reject({ ok: false, message: "user does not exist", response: null, code: 404 });
          }
        } catch (err: any) {
          return reject({ ok: false, message: "bad request", response: err, code: 500 });
        }
      })();
    });
  }

  private removeSensiteveData(user: any) {
    let objUser = user.toObject();
    delete objUser.password;
    delete objUser.salt;

    return objUser;
  }
}
