import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { User } from '../decorators/user.decorator';
import { UserEntity } from '../entities/user.entity';

@Controller('countries')
export class CountriesController {
    constructor(private readonly countriesService: CountriesService) { }

    @Get(':language')
    async getCountries(@Param('language') languageParam: string, @User() user: UserEntity) {
        try {
         return await this.countriesService.fetchCountryData(
            languageParam, 
            user);           
        } catch (error) {
            const status = error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;

            throw new HttpException({
                status,
                error: 'Error fetching country data.',
              }, status, {
                cause: error
              });
        }

    }
}
