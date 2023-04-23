import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VersionResponse } from './dto/version-response';
import { CURRENT_VERSION_URI, SUPPORTED_VERSIONS } from './utils/versionts';

@Controller()
@ApiTags('API Root')
export class AppController {
  constructor() {}

  @Get('version')
  @ApiOperation({ summary: 'get version information about this api' })
  getVersion(): VersionResponse {
    const version = CURRENT_VERSION_URI;
    const supportedVersions = SUPPORTED_VERSIONS;

    return { version, supportedVersions };
  }
}
