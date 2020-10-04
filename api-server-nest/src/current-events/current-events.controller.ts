import {Controller, Get, HttpException, HttpStatus, Query, UseGuards, UseInterceptors} from "@nestjs/common";
import {CurrentEventsService} from "./current-events.service";
import {CurrentEvent} from "./dto/current-event.model";
import {Venue} from "../venues/models/venue.model";
import {FindOptions} from "sequelize";
import {AuthGuard} from "../authentication/auth.guard";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {VERSION_1_URI} from "../utils/versionts";
import {LoggingInterceptor} from "../logging/logging.interceptor";

type EmbedableModels = typeof Venue

const VENUE = 'Venue';

@Controller(`${VERSION_1_URI}/current-events`)
@UseInterceptors(LoggingInterceptor)
@ApiTags('current events')
export class CurrentEventsController {
    constructor(private readonly currentEventsService: CurrentEventsService) {
    }

    @Get('verified')
    @ApiOperation({summary: 'Get current events that have been verified (for public consumptions)'})
    @ApiResponse({
        status: 200,
        description: 'Current verified events',
        type: CurrentEvent,
        isArray: true
    })
    getAllCurrentVerified(@Query('embed') embed: string[] | string = []): Promise<CurrentEvent []> {
        const findOptions = {
            ...this.getOptionsForCurrentEvents(embed),
            where: {verified: true}
        };

        return this.currentEventsService.findAll(findOptions);
    }

    @Get('non-verified')
    @UseGuards(AuthGuard)
    @ApiOperation({summary: 'Get current events that have not yet been verified (admin only)'})
    @ApiResponse({status: 403, description: 'Forbidden'})
    @ApiBearerAuth()
    getAllCurrentNonVerified(@Query('embed') embed: string[] | string = []): Promise<CurrentEvent []> {
        const findOptions = {
            ...this.getOptionsForCurrentEvents(embed),
            where: {verified: false}
        };

        return this.currentEventsService.findAll(findOptions);
    }

    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({summary: 'Get current events, both verified and non (admin only)'})
    @ApiResponse({status: 403, description: 'Forbidden'})
    @ApiBearerAuth()
    getAllCurrent(@Query('embed') embed: string[] | string = []): Promise<CurrentEvent []> {
        const findOptions = this.getOptionsForCurrentEvents(embed);

        return this.currentEventsService.findAll(findOptions);
    }

    private getOptionsForCurrentEvents(embedsFromQueryString: string[] | string): FindOptions {
        const modelNames = this.ensureEmbedQueryStringIsArray(embedsFromQueryString);

        if (modelNames.length === 0) {
            return {};
        } else {
            const include = this.getModelsForEmbedding(modelNames);

            return {include};
        }
    }

    private ensureEmbedQueryStringIsArray(embedsFromQueryString: string[] | string): string [] {
        return typeof embedsFromQueryString === 'string' ? [embedsFromQueryString] : embedsFromQueryString;
    }

    private getModelsForEmbedding(modelNames: string[]): EmbedableModels [] {
        return modelNames.map(modelName => {
            if (modelName === VENUE) {
                return Venue;
            } else {
                throw new HttpException(`"${modelName}" is not an allowable embed`, HttpStatus.BAD_REQUEST);
            }
        });
    }
}
