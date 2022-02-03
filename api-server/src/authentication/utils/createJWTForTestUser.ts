import * as jwt from "jsonwebtoken";
import {SECRET} from "../../constants";

export default function createJWTForTestUser(
    props: {nickname: string, name: string, picture: string, sub: string}
) {
    const userValues = {
        "https://infinite.industries.com/isInfiniteAdmin": true,
        ...props
    };

    return jwt.sign(userValues, SECRET);
}
