import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";

export class JwtGoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID, //.env파일에 들어있음
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, //.env파일에 들어있음
      callbackURL: process.env.GOOGLE_CALLBACK_URL, //.env파일에 들어있음
      scope: ["email", "profile"],
      responseType: "token"
    });
  }

  validate(accessToken, refreshToken, profile) {
    return {
      name: profile.displayName,
      email: profile.emails[0].value,
      password: profile.id,
    };
  }
}