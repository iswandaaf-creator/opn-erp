import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportArticle } from './entities/article.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SupportArticle])],
    controllers: [],
    providers: [],
})
export class SupportModule { }
