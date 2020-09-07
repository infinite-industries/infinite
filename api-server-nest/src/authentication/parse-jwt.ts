import * as fs from "fs";
import jwt = require('jsonwebtoken');
import {Request} from "express";

const PATH_TO_PEM = process.env.jwtPEM || './keys/1nfinite.pem';
const SECRET = fs.readFileSync(PATH_TO_PEM);

export interface UserInformation {
    token: string,
    decodedToken: Record<string, unknown>,
    isInfiniteAdmin: boolean,
    venueIds: string []

}

export function parseJwt(req: Request): Promise<UserInformation> {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    return getUserInformationFromToken(token);
}

function getUserInformationFromToken(token: string): Promise<UserInformation> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET, (err, decodedToken) => {
            if (err) {
                reject(`error decoding request token: ${err}`);
            } else {
                const isInfiniteAdmin = !!decodedToken['https://infinite.industries.com/isInfiniteAdmin'];
                const venueIds = decodedToken['https://infinite.industries.com/venueIDs'];

                resolve({
                    token,
                    decodedToken,
                    isInfiniteAdmin,
                    venueIds
                });
            }
        });
    });
}