import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) { }

    create(taskData: Partial<Task>) {
        const task = this.tasksRepository.create(taskData);
        return this.tasksRepository.save(task);
    }

    findAll() {
        return this.tasksRepository.find({ order: { createdAt: 'DESC' } });
    }

    async updateStatus(id: number, status: string) {
        await this.tasksRepository.update(id, { status });
        return this.tasksRepository.findOneBy({ id });
    }
}
