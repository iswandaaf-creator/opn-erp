import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard'; // Assuming you have this
// import { Roles } from '../auth/roles.decorator';

@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @Post()
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(UserRole.SUPER_ADMIN) 
    create(@Body() createCompanyDto: any) {
        // Validation would be nice here
        return this.companiesService.create(createCompanyDto);
    }

    @Get()
    // @UseGuards(JwtAuthGuard)
    findAll() {
        return this.companiesService.findAll();
    }
}
