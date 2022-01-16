import {Module} from "@nestjs/common";
import {AuthenticationController} from "./authentication.controller";

@Module({
    imports: [],
    controllers: [AuthenticationController],
})
export class AuthenticationModule {
}
