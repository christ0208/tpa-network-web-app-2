import { Body, Controller, Get, Headers, Patch, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { LogHistoriesService } from 'src/log-histories/log-histories.service';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login-dto/auth-login-dto.interface';
import { AccessToken } from './interfaces/access-token/access-token.interface';

@Controller('auth')
export class AuthController {

    /**
     * Constructor for AuthController.
     * 
     * @param authService
     * @param logHistoriesService 
     */
    constructor(private authService: AuthService, private logHistoriesService: LogHistoriesService) {}

    /**
     * Login method in controller as new endpoint.
     * 
     * @param authLoginDto 
     * @returns AccessToken
     */
    @Post('login')
    async login(@Headers('x-real-ip') xRealIP: string, @Body() authLoginDto: AuthLoginDto): Promise<AccessToken> {
        const fetchedAccount = await this.authService.login(authLoginDto);

        if (fetchedAccount === null || fetchedAccount === undefined) {
            this.logHistoriesService.create({
                title: 'Authentication - Login',
                details: 'Wrong username and password combination, Source: ' + xRealIP + '; E-mail: ' + authLoginDto.email
            });
            throw new UnauthorizedException(['Wrong username and password combination']);
        } else {
            this.logHistoriesService.create({
                title: 'Authentication - Login',
                details: 'Login success, Source: ' + xRealIP + '; E-mail: ' + authLoginDto.email
            });
        }

        return fetchedAccount;
    }

    /**
     * Check access token method in controller as new endpoint.
     * Send access token from authorization request header to process access token checking.
     * 
     * @param authorization authorization request header
     * @returns AccessToken
     */
    @UseGuards(AuthGuard)
    @Get('check')
    async checkAccessToken(@Headers('Authorization') authorization: string): Promise<AccessToken> {
        if (authorization === null || authorization === undefined) throw new UnauthorizedException();

        const accessToken = authorization.replace('Bearer', '').trim();
        const accessTokenObject = await this.authService.checkAccessToken({
            accessToken: accessToken
        }, true);

        if (!accessTokenObject) throw new UnauthorizedException();

        return accessTokenObject;
    }
}
