import { Controller, Get } from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {VersionResponse} from "./dto/version-response";
import {CURRENT_VERSION_URI} from "./utils/versionts";

@Controller()
@ApiTags("API Root")
export class AppController {
  constructor() {}

  @Get('version')
  @ApiOperation({ summary: 'says hello to the world' })
  getVersion(): VersionResponse {
    const version = CURRENT_VERSION_URI;

    return { version }
  }
}
