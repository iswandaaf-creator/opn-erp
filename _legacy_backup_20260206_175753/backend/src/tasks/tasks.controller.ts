import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get()
    findAll() {
        return this.tasksService.findAll();
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.tasksService.updateStatus(+id, status);
    }
}
